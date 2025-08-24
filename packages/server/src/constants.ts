import { resolve } from 'node:path'

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
