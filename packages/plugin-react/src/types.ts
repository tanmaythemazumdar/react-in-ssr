import { JscConfig } from '@swc/core'

export type EXT_REGEX = RegExp | string | string[]

export type Options = {
  exclude?: EXT_REGEX
  include?: EXT_REGEX
}

export type ReactPluginOptions = {
  context: string
  exclude: EXT_REGEX
  extensions: string[]
  hot: boolean
  include: EXT_REGEX
  isDev: boolean
  jsc?: JscConfig
  minify?: boolean
  tsconfigPath?: string
}
