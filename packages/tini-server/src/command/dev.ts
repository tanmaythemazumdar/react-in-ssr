import fs from 'node:fs'

import type { DevCliOptions } from '@/types'
import { getOptions } from '@/lib/options'
import { DIST, NOOP } from '@/constants'

function checkDistPath() {
  const isDistPathExist = fs.existsSync(DIST)

  if (!isDistPathExist) {
    fs.mkdir(DIST, { recursive: false }, NOOP)
  }
}

export async function dev(options: DevCliOptions) {
  const watchFiles: string[] = []
  const option = getOptions(options, watchFiles)

  checkDistPath()
}
