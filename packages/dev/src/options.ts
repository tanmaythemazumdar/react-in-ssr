import { existsSync } from 'node:fs'

import { COMPRESS, DIST_PATH, ENV, HOST, PORT, SRC_PATH, TINI_CONFIG } from './constants'
import { readEnvFile } from './lib/environment'
import { DevCliOptions, TiniOptions } from './types'

export const getOptions = async (options: DevCliOptions, watchFiles: string[]): Promise<TiniOptions> => {
  const env = await readEnvFile(watchFiles)
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const mode = process.env.NODE_ENV === ENV.DEVELOPMENT ? ENV.DEVELOPMENT : ENV.PRODUCTION
  const opts = {
    alias: {
      '@/': SRC_PATH
    },
    devServer: {
      compress: options.compress || COMPRESS,
      port: options.port || PORT,
      host: options.host || HOST,
      https: false,
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
    mode,
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
