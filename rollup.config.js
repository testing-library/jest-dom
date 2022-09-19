const entries = ['src/index.js', 'src/matchers.js']

export default [
  {
    input: entries,
    output: {
      dir: 'dist',
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name]-[hash].mjs',
      format: 'esm',
    },
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      format: 'cjs',
    },
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
  },
]
