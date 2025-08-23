#!/usr/bin/env node

import sade from 'sade'

import { dev } from './command/dev'
import pkg from '../package.json'
import type { DevCliOptions } from './types'
import { DEFAULT_COMPRESS, DEFAULT_HOST, DEFAULT_PORT, ENV } from './constants'

const catchException = (err: Error) => {
	console.error(err)
	process.exit(1)
}

const run = (p: Promise<any>) => {
	p.catch(catchException)
}

const prog = sade(pkg.name)

prog.version(pkg.version)

prog
  .command('dev', 'Start a development server', { default: true })
  .option('--host, -h <host>', 'port to start dev server (default: 0.0.0.0)')
	.option('--port, -p', 'HTTP port to listen on (default: $PORT or 8080)')
	.action((opts: DevCliOptions) => {
		opts.compress = DEFAULT_COMPRESS
		opts.env = ENV.DEVELOPMENT as 'development'
		opts.port = opts.port ?? Number(process.env.PORT) ?? DEFAULT_PORT
		opts.host = opts.host ?? DEFAULT_HOST

		run(dev(opts))
	})

prog.parse(process.argv)
