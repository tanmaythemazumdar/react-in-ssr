import { Server } from 'http'
import { WebSocketServer } from 'ws'

export const initSocket = (server: Server): WebSocketServer => {
  const wss = new WebSocketServer({ server: server, path: '/_hmr' })

  wss.on('connection', ws => {
    console.log('Client connected')

    ws.on('message', data => {
      console.log('received:', data.toString())
    })

    ws.on('close', () => {
      console.log('Client disconnected')
    })

    // Send initial message
    ws.send(JSON.stringify({ type: 'info', message: 'Connected to HMR server' }))
  })

  return wss
}
