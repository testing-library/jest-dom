import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.exports['.'].import,
        format: 'esm',
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
      },
    ],
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
  },
  {
    input: 'src/matchers.js',
    output: [
      {
        file: pkg.exports['./matchers'].import,
        format: 'esm',
      },
      {
        file: pkg.exports['./matchers'].require,
        format: 'cjs',
      },
    ],
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
  },
]
