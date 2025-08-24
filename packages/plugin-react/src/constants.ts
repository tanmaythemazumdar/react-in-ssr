export const PLUGIN_NAME = 'react'

export const INCLUDE_REGEXP = /\.(?:[cm]?[jt]sx?|svg)$/
export const EXCLUDE = ['node_modules']

export const ACCEPTED_EXTENSIONS = ['.ts', '.tsx', '.mjs', '.js', '.cjs', '.jsx', '.svg']

export const defaultPluginOptions = {
  context: '',
  exclude: EXCLUDE,
  extensions: ACCEPTED_EXTENSIONS,
  hot: false,
  include: INCLUDE_REGEXP,
  isDev: false,
  tsconfigPath: './tsconfig.json'
}
