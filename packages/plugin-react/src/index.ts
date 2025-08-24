import { constants } from 'node:fs'
import { access, stat } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'

import { createFilter } from '@rollup/pluginutils'
import { Options, minify as swcMinify, transform as swcTransform } from '@swc/core'

import { defaultPluginOptions, INCLUDE_REGEXP } from './constants'
import { deepMerge } from './merge'
import { ReactPluginOptions } from './types'
import { getSwcConfig } from './config'
import { wrapHMR } from './hmr'

const fileExists = (path: string) =>
  access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false)

const resolveFile = async (
  resolved: string,
  { extensions, include }: Pick<ReactPluginOptions, 'extensions' | 'include'>,
  index = false
) => {
  const fileWithoutExtension = resolved.replace(include as string, '')

  for (const ext of extensions || []) {
    const file = index ? join(resolved, `index${ext}`) : `${fileWithoutExtension}${ext}`
    // We need to respect the order, and we only check one file at a time, and we can return early

    if (await fileExists(file)) {
      return file
    }
  }

  return null
}

export const react = (options: ReactPluginOptions = defaultPluginOptions) => {
  const opts = deepMerge<ReactPluginOptions>(defaultPluginOptions, options)
  const { exclude, extensions, include, isDev } = opts
  const filter = createFilter(INCLUDE_REGEXP, exclude)

  return {
    name: 'plugin-react',

    async renderChunk(code: string) {
      if (opts.minify || opts.jsc?.minify?.mangle || opts.jsc?.minify?.compress) {
        return swcMinify(code, {
          ...(opts?.jsc?.minify || {}),
          module: true
        })
      }

      return Promise.resolve(null)
    },

    async resolveId(source: string, importer: string) {
      // ignore IDs with null character, these belong to other plugins
      if (source.includes('\x00')) {
        return null
      }

      if (source === '/refresh.js') {
        return { id: source, external: true }
      }

      // If the importer (the module that is importing the source) should not be handled by this plugin,
      // we skip the resolution to avoid the issue
      if (!filter(importer)) {
        return null
      }

      if (importer && source.startsWith('.')) {
        const resolved = resolve(importer ? dirname(importer) : process.cwd(), source)
        let file = await resolveFile(resolved, { extensions, include })

        if (file) {
          return file
        }

        if (!file && (await fileExists(resolved)) && (await stat(resolved)).isDirectory()) {
          file = await resolveFile(resolved, { extensions, include }, true)

          if (file) {
            return file
          }
        }
      }

      return null
    },

    async transform(code: string, id: string) {
      if (!filter(id)) {
        return null
      }

      const extension = extname(id)

      if (!extensions?.includes(extension)) {
        return null
      }

      // TODO: parse code to handle import.meta.glob feature

      const swcConfig: Options = getSwcConfig({
        id,
        isDev,
        pluginOption: opts,
        extension,
        tsconfigPath: opts.tsconfigPath
      })
      const output = await swcTransform(code, swcConfig)

      return {
        ...output,
        code: id.startsWith(opts.context) && isDev ? wrapHMR(output.code) : output.code
      }
    }
  }
}
