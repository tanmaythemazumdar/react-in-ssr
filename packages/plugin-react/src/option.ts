import { dirname, isAbsolute, resolve } from 'node:path'

import type { PluginContext } from 'rollup'
import { getTsconfig, parseTsconfig, type TsConfigJson } from 'get-tsconfig'

const cache = new Map()

export const getOptions = (ctx: PluginContext, cwd: string, tsconfigPath: string): TsConfigJson.CompilerOptions => {
  const cacheKey = `${cwd}:${tsconfigPath || ''}`

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) ?? {}
  }

  if (tsconfigPath && isAbsolute(tsconfigPath)) {
    const compilerOptions = parseTsconfig(tsconfigPath).compilerOptions

    const tsconfigDir = dirname(tsconfigPath)
    if (compilerOptions?.paths != null || compilerOptions?.baseUrl != null) {
      compilerOptions.baseUrl =
        compilerOptions.baseUrl == null ? tsconfigDir : resolve(tsconfigDir, compilerOptions.baseUrl)
    }

    cache.set(cacheKey, compilerOptions)

    return compilerOptions as TsConfigJson.CompilerOptions
  }

  let result = getTsconfig(cwd, tsconfigPath ?? 'tsconfig.json')

  // Only fallback to `jsconfig.json` when tsconfig can not be resolved AND custom tsconfig filename is not provided
  if (!result && !tsconfigPath) {
    ctx.warn({
      message: "Can't find tsconfig.json, trying jsconfig.json now",
      pluginCode: 'SWC_TSCONFIG_NOT_EXISTS'
    })
    result = getTsconfig(cwd, 'jsconfig.json')
  }

  const compilerOptions = result?.config.compilerOptions ?? {}
  if ((compilerOptions.paths != null || compilerOptions.baseUrl != null) && result?.path) {
    const tsconfigDir = dirname(result.path)
    compilerOptions.baseUrl =
      compilerOptions.baseUrl == null ? tsconfigDir : resolve(tsconfigDir, compilerOptions.baseUrl)
  }

  cache.set(cacheKey, compilerOptions)
  return compilerOptions
}
