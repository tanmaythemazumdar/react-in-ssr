import { resolve } from 'node:path'

export const CWD = process.cwd()
export const DIST = '.tini'

export const DIST_PATH = resolve(CWD, DIST)
export const APP_PATH = resolve(CWD, `${DIST}/server`)
export const ENTRY = resolve(CWD, DIST, 'entry')
export const SERVER_ENTRY_PATH = resolve(ENTRY, './server.ts')
export const CLIENT_ENTRY_PATH = resolve(ENTRY, 'client')
export const CLIENT_WRAPPER = resolve(CWD, './client-entry.tsx')
export const CLIENT_OUTPUT_PATH = resolve(CWD, `${DIST}/client`)
export const ASSETS_PATH = resolve(CLIENT_OUTPUT_PATH, 'webpack-assets.json')
export const ROOT = resolve(CWD, 'src')
export const INDEX = resolve(CWD, 'src/index.html')

// Dev server config
export const DEFAULT_PORT = 3000
export const DEFAULT_HOST = 'localhost'
export const DEFAULT_URL = `http://${DEFAULT_HOST}:${DEFAULT_PORT}`

export const ENV = process.env.NODE_ENV || 'production'
export const DEV = process.env.NODE_ENV === 'development'
export const PROD = process.env.NODE_ENV === 'production'

export const TS_CONFIG = resolve(CWD, 'tsconfig.json')
