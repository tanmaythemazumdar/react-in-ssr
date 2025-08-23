import { createServer } from 'node:http'

import { App } from '@tinyhttp/app'
import sirv  from 'sirv'

import rspack from '@rspack/core'

import webpackDevMiddleware, { Compiler } from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import { loadConfig } from '@/config/tini.config'
import { getClientConfigForDevServer } from '@/config/client.config'
import { TiniOptions } from '..'

const devMiddlewareConfig = {
  publicPath: '/',
  writeToDisk(filePath: string) {
    return /\webpack-assets.json?$/.test(filePath)
  },
  stats: {
    all: false,
    env: true,
    errors: true,
    errorDetails: true,
    timings: true,
  },
}

const hotMiddlewareConfig = {
  log: (message: string): void => console.log('HMR LOGGER: ', message),
  heartbeat: 2000,
}

export const dev = async () => {
  process.on('uncaughtException', e => {
    console.error('uncaughtException', e)
  })
  process.on('unhandledRejection', e => {
    console.info('unhandledRejection:', e)
  })

  const app = new App()
  const config: TiniOptions = await loadConfig()

  // Create HTTP server instance
  // @ts-expect-error type issue
  const server = createServer(app.handler.bind(app))

  app.use(sirv(config.root, { dev: true, single: false }))

  const clientConfig = await getClientConfigForDevServer()

  const clientCompiler = rspack(clientConfig)
  const devMiddleware = webpackDevMiddleware(clientCompiler as unknown as Compiler, devMiddlewareConfig)
  const hotMiddleware = webpackHotMiddleware(clientCompiler as unknown as Compiler, hotMiddlewareConfig)

  // @ts-expect-error type issue
  app.use(devMiddleware)
  // @ts-expect-error type issue
  app.use(hotMiddleware)

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!', data: config })
  })
  // app.use(
  //   createDemandEntryMiddleware()
  // )

  server.listen(3000, () => {
    console.log('Running in development server')
  })
}
