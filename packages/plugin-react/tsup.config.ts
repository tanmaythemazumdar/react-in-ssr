import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: false,
  clean: true,
  tsconfig: 'tsconfig.json',
  outDir: 'dist',
  target: 'node22'
})
