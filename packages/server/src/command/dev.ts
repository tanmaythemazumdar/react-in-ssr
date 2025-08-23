import { existsSync, mkdir } from 'node:fs'

import type { DevCliOptions, TiniOptions } from '@/types'
import { DEFAULT_COMPRESS, DEFAULT_HOST, DEFAULT_PORT, DIST, ENV, NOOP, SRC, TINI_CONFIG } from '@/constants'
import { readEnvFile } from '@/lib/environment'
import { startServer } from '@/lib/server'

const checkBuildPath = () => {
  const isPathExist = existsSync(DIST)

  if (!isPathExist) {
    mkdir(DIST, { recursive: false }, NOOP)
  }
}

const getOptions = async (options: DevCliOptions, watchFiles: string[]): Promise<TiniOptions> => {
  const env = await readEnvFile(watchFiles)
  const opts = {
    alias: {
      '@/': SRC
    },
    devServer: {
      compress: options.compress || DEFAULT_COMPRESS,
      port: options.port || DEFAULT_PORT,
      host: options.host || DEFAULT_HOST,
      https: false,
      historyApiFallback: true,
      hot: true,
      proxy: {
        // Example
        // '/api': {
        //   target: 'http://localhost:3001',
        //   changeOrigin: true,
        //   secure: false
        // }
      },
      client: {
        overlay: true,
        progress: true,
        logging: 'info'
      }
    },
    env,
    mode: process.env.NODE_ENV === ENV.DEVELOPMENT ? ENV.DEVELOPMENT : ENV.PRODUCTION,
    output: {
      path: DIST,
      filename: '[name].js'
    },
    root: SRC,
    ssr: false
  }

  if (existsSync(TINI_CONFIG)) {
    watchFiles.push(TINI_CONFIG)

    const mod = await import(TINI_CONFIG)
    Object.assign(opts, mod.default)
  }

  return opts
}

export const dev = async (opts: DevCliOptions) => {
  checkBuildPath()

  const watchFiles: string[] = []
  const options = await getOptions(opts, watchFiles)
  console.log(JSON.stringify(options, null, 4))
  const server = await startServer(options)
}
