const del = require('rollup-plugin-delete')
const commonjs = require('@rollup/plugin-commonjs')

const entries = [
  './src/index.js',
  './src/jest-globals.js',
  './src/matchers.js',
  './src/vitest.js',
]

module.exports = [
  {
    input: entries,
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name]-[hash].mjs',
        format: 'esm',
      },
      {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        format: 'cjs',
      },
    ],
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
    plugins: [del({targets: 'dist/*'}), commonjs()],
  },
]
