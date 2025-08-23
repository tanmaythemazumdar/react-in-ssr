import { watch } from 'node:fs'
import { createServer } from 'node:http'
import { resolve } from 'node:path'

import { App } from '@tinyhttp/app'
import { cookieParser } from '@tinyhttp/cookie-parser'
import { logger } from '@tinyhttp/logger'
import { lruSend } from 'lru-send'
import { json, urlencoded } from 'milliparsec'

import compression from 'compression'
import { black, bold, cyan, gray, green } from 'kolorist'
import sirv from 'sirv'
import { WebSocketServer } from 'ws'

import { TiniOptions } from '@/types'
import { getCompressionConfig } from './compression'
import { getServerAddresses } from './net-utils'

function onListen(
  addr: { port: number },
  options: { host: string, https?: boolean }
): () => void {
  return () => {
    const addresses = getServerAddresses(addr, options)

    const local = `Local:   ${cyan(addresses[0])}`
    const network = `Network: ${addresses[1]}`

    console.clear()
    console.log(`\n  👩‍🚀 ${green('MULBERRY v0.1.0')}\n`)
    console.log(`${bold(green('➜'))} ${bold(black(local))}`)
    console.log(`${bold(green('➜'))} ${bold(black(network))}`)
  }
}

export async function startServer(options: TiniOptions) {
  const { devServer, output, root } = options
  const { compress, host, hot, https, port } = devServer

  const app = new App()

  // @ts-expect-error type issue
  const server = createServer(app.handler.bind(app))
  let wss: WebSocketServer

  app.use(sirv(output.path, { dev: true, single: false }))
  app.use(logger({
    timestamp: { format: 'DD/MM/YYYY HH:mm:ss:SSS' }
  }))
  app.use(json())
  app.use(urlencoded())
  // @ts-expect-error type issue
  app.use(lruSend())
  app.use(cookieParser())

  if (compress) {
    const compressionConfig = getCompressionConfig()
    // @ts-expect-error type issue
    app.use(compression(compressionConfig))
  }

  if (hot) {
    wss = new WebSocketServer({ server, path: '/_hmr' })

    wss.on('connection', (ws) => {
      console.log('Client connected')

      ws.on('message', (data) => {
        console.log('received:', data.toString())
      })

      ws.on('close', () => {
        console.log('Client disconnected')
      })

      // Send initial message
      ws.send(JSON.stringify({ type: 'info', message: 'Connected to HMR server'}))
    })

    watch(root, { recursive: true }, async (_e, fileName) => {
      const filePath = resolve(root, fileName as string)
      const normalizedPath = (fileName as string).replace(/\\/g, '/').replace(root, '').replace(/\.[j|t]sx?/, '.js')

      console.log(gray(`Rebuilding ${normalizedPath}`))

      // getBundler().bundle(filePath).then(() => {
      //   wss.clients.forEach((client) => {
      //     client.send(JSON.stringify({
      //       changes: [normalizedPath],
      //       file: normalizedPath
      //       timestamp: Date.now(),
      //       type: 'update'
      //     }))
      //   })
      // })
    })
  }

  // @ts-expect-error type issue
  server.listen(port, host, onListen({ port }, { host, https }))

  // Add method to stop the server
  (app as unknown).stop = () => {
    if (server) {
      (wss as WebSocketServer)?.close?.()
      server.close()
    }
  }

  // Add method to restart the server
  (app as unknown as { restart: () => Promise<void> }).restart = async () => {
    (app as unknown as { stop: () => void }).stop()

    server.listen(port, host, onListen({ port }, { host, https }))
  }

  return app
}
