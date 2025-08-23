import { resolve } from 'path'
import { access, constants } from 'fs/promises'

import { CWD } from './constants'

export async function checkTypescript(): Promise<string | undefined> {
  const tsConfig = resolve(CWD, 'tsconfig.json')

  try {
    await access(tsConfig, constants.R_OK | constants.W_OK)
    return tsConfig
  } catch {
    return undefined
  }
}
