import { existsSync, promises as fs } from 'node:fs'
import { resolve } from 'node:path'

import { CWD, NODE_ENV } from '../constants'

const NEWLINE_ALL = /\n/

/**
 * Parse env file format.
 * Example
 *   FOO="bar"
 *   Bob=
 *   BOOF='baz'
 *   BAR=123
 *   BOING="bar\\nboof\\n"
 * @param {string} content
 * @returns {Record<string, string>}
 */
function parseEnvFile(content: string): Record<string, string> {
  const lines = content.split(NEWLINE_ALL)
  const env: Record<string, string> = {}

  for (const line of lines) {
    const ln = line.trim()
    const equal = ln.indexOf('=')

    if (ln.startsWith('#') || equal === -1) {
      continue
    }

    const key = ln.slice(0, equal).trim()
    let value = ln.slice(equal + 1).trim()

    if (['"', "'"].includes(value[0] as string) && value.endsWith(value[0] as string)) {
      value = value.slice(1, -1)
    }

    if (!value) {
      continue
    }

    env[key] = value
  }

  return env
}

/**
 * Load additional environment variables from .env files.
 * @param {string[]} [watchFiles]
 * @returns {Promise<Record<string, string>>}
 */
export async function readEnvFile(watchFiles: string[] = []): Promise<Record<string, string>> {
  const path = resolve(CWD, `.env.${NODE_ENV}`)
  let env: Record<string, string> = {}

  if (existsSync(path)) {
    try {
      const content = await fs.readFile(path, { encoding: 'utf-8' })

      if (watchFiles) {
        watchFiles.push(path)
      }

      env = parseEnvFile(content)
    } catch (e) {
      console.log(e)
    }
  }

  return env
}
