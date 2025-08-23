import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Configuration, Mode } from '@rspack/core'

import rspack from '@rspack/core'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'
import AssetsPlugin from 'assets-webpack-plugin'

import { CWD, DEV, DIST_PATH, ENV, INDEX } from '@/utils/constants'
import { checkTypescript } from '@/utils/check-ts'
import { jsRules, cssRules } from './base.config'

const defaultConfig: Configuration = {
  mode: ENV as Mode,
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
    new rspack.ProgressPlugin({ prefix: 'client' }),
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
      chunks: 'all',
    }
  }
}

function getEntryPointForSPA(isTypescript: boolean): Record<string, Array<string>> {
  const jsEntryPoint: Array<string> = [resolve(CWD, 'src/index.js'), resolve(CWD, 'src/index.jsx')]
  const tsEntryPoint: Array<string> = [resolve(CWD, 'src/index.ts'), resolve(CWD, 'src/index.tsx')]

  // NOTE: If no entry point is found, should we throw an error?
  if (isTypescript) {
    const files = tsEntryPoint.find(file => existsSync(file))

    return { main: files ? [files] : tsEntryPoint }
  }

  const files = jsEntryPoint.find(file => existsSync(file))

  return { main: files ? [files] : jsEntryPoint }
}

export async function getClientConfig(): Promise<Configuration> {
  const isTypescript = await checkTypescript()

  jsRules.use.options.jsc.parser.syntax = Boolean(isTypescript) ? 'typescript' : 'ecmascript'

  if (Boolean(isTypescript)) {
    jsRules.test = /\.(tsx|ts)$/
  }

  defaultConfig.module?.rules?.push(jsRules)
  defaultConfig.entry = getEntryPointForSPA(Boolean(isTypescript))

  return defaultConfig
}

const hotMiddlewareScript = `${require.resolve(
  'webpack-hot-middleware/client',
)}?path=/__webpack_hmr&timeout=20000&reload=true&noInfo=true`

export async function getClientConfigForDevServer() {
  const config = await getClientConfig()

  config.plugins?.push(new rspack.HotModuleReplacementPlugin())
  config.plugins?.push(new ReactRefreshPlugin())
  config.plugins?.push(new rspack.HtmlRspackPlugin({ template: 'src/index.html' }))

  Object.keys(config.entry ?? {}).forEach(function (name) {
    // @ts-ignore
    config.entry[name].unshift(hotMiddlewareScript)
  })

  return config
}

export { defaultConfig as clientConfig }
