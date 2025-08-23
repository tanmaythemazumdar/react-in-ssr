import type { Configuration, Mode } from '@rspack/core'

import rspack from '@rspack/core'
import AssetsPlugin from 'assets-webpack-plugin'

import { DEV, DIST_PATH, ENV } from '@/utils/constants'
import { checkTypescript } from '@/utils/check-ts'
import { jsRules, cssRules } from './base.config'

const defaultConfig: Configuration = {
  mode: ENV as Mode,
  entry: './src/index.tsx',
  devtool: DEV ? 'eval-cheap-module-source-map' : 'source-map',
  output: {
    chunkFilename: 'assets/js/[name].chunk.js',
    filename: 'assets/js/[name].js',
    path: DIST_PATH,
    publicPath: '/',
  },
  module: {
    rules: [...cssRules],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mjs', '.wasm', '.ts', '.tsx'],
  },
  plugins: [
    new AssetsPlugin({
      filename: 'assets.json',
      path: DIST_PATH,
    }),
    new rspack.ProgressPlugin({ prefix: 'server' }),
    new rspack.CssExtractRspackPlugin({}),
    new rspack.DefinePlugin({
      'typeof window': JSON.stringify('object'),
    }),

    DEV && new rspack.SourceMapDevToolPlugin({
      filename: 'sourcemaps/[file].map',
    })
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}

export async function getServerConfig(): Promise<Configuration> {
  const isTypescript = await checkTypescript()

  jsRules.use.options.jsc.parser.syntax = isTypescript ? 'typescript' : 'ecmascript'

  if (isTypescript) {
    jsRules.test = /\.(tsx|ts)$/
  }

  defaultConfig.module?.rules?.push(jsRules)
  defaultConfig.entry = isTypescript ? './src/index.tsx' : './src/index.jsx'

  return defaultConfig
}

export { defaultConfig as serverConfig }
