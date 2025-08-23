import { join, resolve } from 'node:path'

export const CWD = process.cwd()
export const DIST = join(CWD, '.tini')

export const ENV = {
	DEVELOPMENT: 'development',
	PRODUCTION: 'production'
}

export const NOOP = () => {}

export const DEFAULT_HOST = '0.0.0.0'
export const DEFAULT_PORT = 3000
export const DEFAULT_COMPRESS = true

export const TINI_CONFIG = resolve(CWD, 'tini.config.js')
export const SRC = resolve(CWD, 'src')
export const TS_CONFIG = resolve(CWD, 'tsconfig.json')

export const NODE_ENV = process.env.NODE_ENV || ENV.PRODUCTION
export const EXTS = ['js', 'jsx', 'ts', 'tsx']

export const CLIENT = {
  'client': join(__dirname, './lib/client', 'client.js'),
  'hmr': join(__dirname, './lib/client', 'hmr.js'),
  'refresh': join(__dirname, './lib/client', 'refresh.js')
}
