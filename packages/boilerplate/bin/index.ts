#!/usr/bin/env node

console.clear()

import { parseArgs } from '@/utils/args'

async function main(args: string[]): Promise<void> {
  const parsedArgs = parseArgs(args)

  if (parsedArgs.dev) {
    const { dev } = await import('@/cmd/dev')
    dev()
  } else {
    console.log('Running in production server')
  }
}

main(process.argv.slice(2))
