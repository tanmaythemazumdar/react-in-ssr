import { DEFAULT_HOST, DEFAULT_PORT, DIST_PATH, ROOT } from '@/utils/constants'

export type Proxy = {
  target: string
  changeOrigin: boolean
  secure: boolean
}

export type Mode = 'spa' | 'ssr'

export type TiniOptions = {
  alias: Record<string, string>
  devServer: {
    compress: boolean
    port: number
    host: string
    historyApiFallback: boolean
    hot: boolean
    https: boolean
    proxy: Record<string, Proxy>
    client: {
      overlay: boolean
      progress: boolean
      logging: string
    }
  }
  env: Record<string, string>
  mode: Mode
  output: {
    path: string
    filename: string
  }
  root: string
  ssr: boolean
}

const defaultConfig: TiniOptions = {
  alias: {
    '@/': `${ROOT}/*`
  },
  devServer: {
    compress: true,
    port: DEFAULT_PORT,
    host: DEFAULT_HOST,
    historyApiFallback: true,
    hot: true,
    https: false,
    proxy: {},
    client: {
      overlay: true,
      progress: true,
      logging: 'info'
    }
  },
  env: {},
  mode: 'spa',
  output: {
    path: DIST_PATH,
    filename: '[name].js'
  },
  root: ROOT,
  ssr: false
}

export function defineConfig(config: Partial<TiniOptions>): TiniOptions {
  // TODO: use deepMerge for safe merging

  return { ...defaultConfig, ...config }
}
