import { join, resolve } from 'node:path'

export const CWD = process.cwd()

export const PORT = 9000
export const HOST = '0.0.0.0'
export const COMPRESS = true
export const HOT = true

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
}

export const NOOP = () => {}
export const DIST_PATH = resolve(CWD, '.tini')

export const PUBLIC_PATH = resolve(CWD, 'public')
export const TINI_CONFIG = resolve(CWD, 'tini.config.js')
export const SRC_PATH = resolve(CWD, 'src')
export const TS_CONFIG = resolve(CWD, 'tsconfig.json')
// eslint-disable-next-line turbo/no-undeclared-env-vars
export const NODE_ENV = process.env.NODE_ENV || ENV.PRODUCTION
export const IS_PROD = NODE_ENV === ENV.PRODUCTION
export const EXTS = ['.js', '.jsx', '.ts', '.tsx']

export const PAGE_DIR = resolve(SRC_PATH, 'pages')
export const ROOT = resolve(SRC_PATH, 'root.tsx')
export const ENTRY_CLIENT = join(SRC_PATH, 'entry.client.tsx')
export const ENTRY_SERVER = join(SRC_PATH, 'entry.server.tsx')

export const CLIENT_LIB = {
  client: join(__dirname, './lib/client', 'client.js'),
  hmr: join(__dirname, './lib/client', 'hmr.js'),
  refresh: join(__dirname, './lib/client', 'refresh.js')
}
