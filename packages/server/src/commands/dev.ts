import { existsSync, mkdir } from 'node:fs'

import { COMPRESS, DIST_PATH, ENV, HOST, NOOP, PORT, SRC_PATH, TINI_CONFIG } from '../constants'
import { DevCliOptions, TiniOptions } from '../types'
import { readEnvFile } from '../lib/environment'
import { startServer } from '../server'

const checkBuildPath = () => {
  const isPathExist = existsSync(DIST_PATH)

  if (!isPathExist) {
    mkdir(DIST_PATH, { recursive: false }, NOOP)
  }
}

const getOptions = async (options: DevCliOptions, watchFiles: string[]): Promise<TiniOptions> => {
  const env = await readEnvFile(watchFiles)
  const opts = {
    alias: {
      '@/': SRC_PATH
    },
    devServer: {
      compress: options.compress || COMPRESS,
      port: options.port || PORT,
      host: options.host || HOST,
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
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    mode: process.env.NODE_ENV === ENV.DEVELOPMENT ? ENV.DEVELOPMENT : ENV.PRODUCTION,
    output: {
      path: DIST_PATH,
      filename: '[name].js'
    },
    root: SRC_PATH,
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

  await startServer(options)
}
