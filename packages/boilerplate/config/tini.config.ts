import fs from 'node:fs'
import { resolve } from 'node:path'

import { CWD } from '@/utils/constants'
import { TiniOptions } from '..'

const CONFIG_PATHS = [
  resolve(CWD, 'tini.config.js'),
  resolve(CWD, 'tini.config.mjs'),
  resolve(CWD, 'tini.config.ts'),
  resolve(CWD, 'tini.config.mts'),
]

export const loadConfig = async (): Promise<TiniOptions> => {
  let config = {}

  for (const configPath of CONFIG_PATHS) {
    if (fs.existsSync(configPath)) {
      const customConfig = await import(configPath)
      config = customConfig.default || customConfig
      break
    }
  }

  return config as TiniOptions
}
