#!/usr/bin/env node

import sade from 'sade'

import pkg from '../package.json'
import type { DevCliOptions } from '@/types'
import { DEFAULT_COMPRESS, DEFAULT_HOST, DEFAULT_PORT, ENV } from '@/constants'

const prog = sade(pkg.name)

prog.version(pkg.version)

prog
  .command('dev', 'Start a development server', { default: true })
  .option('--host, -h <host>', 'hostname to start dev server (default: 0.0.0.0)')
  .option('--port, -p <port>', 'port to listen dev server (default: 1906)')
  .action(async (opts: DevCliOptions) => {
    opts.compress = DEFAULT_COMPRESS
    opts.env = ENV.DEVELOPMENT as 'development'
		opts.port = opts.port ?? Number(process.env.PORT) ?? DEFAULT_PORT
		opts.host = opts.host ?? DEFAULT_HOST

    const { dev } = await import('@/command/dev')

    run(dev(opts))
  })

prog.parse(process.argv)

const catchException = (err: Error) => {
	console.error(err)
	process.exit(1)
}

const run = (p: Promise<any>) => {
	p.catch(catchException)
}

process.on('uncaughtException', e => {
  console.error('uncaughtException', e)
})
process.on('unhandledRejection', e => {
  console.info('unhandledRejection:', e)
})
