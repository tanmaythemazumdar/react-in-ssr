import { existsSync, mkdir } from 'node:fs'

import chokidar from 'chokidar'

import { DIST_PATH, NOOP } from '../constants'
import { DevCliOptions } from '../types'
import { startServer } from '../server'
import { getOptions } from '../options'

const checkBuildPath = () => {
  const isPathExist = existsSync(DIST_PATH)

  if (!isPathExist) {
    mkdir(DIST_PATH, { recursive: false }, NOOP)
  }
}

export const dev = async (opts: DevCliOptions) => {
  checkBuildPath()

  const watchFiles: string[] = []
  const options = await getOptions(opts, watchFiles)

  const server = await startServer(options)

  const watcher = chokidar.watch(watchFiles, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true
  })

  watcher.on('change', async (path: string) => {
    console.log(`File ${path} has been changed. Restarting dev server.`)

    await server.restart()
  })
}
