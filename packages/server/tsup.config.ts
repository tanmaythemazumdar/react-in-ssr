import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  dts: true,
  entry: ['src/cli.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.json',
  outDir: 'dist',
  target: 'node22'
})
