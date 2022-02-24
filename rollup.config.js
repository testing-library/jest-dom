import path from 'path'
import pkg from './package.json'

export default [
  {
    input: {
      index: 'src/index.js',
      matchers: 'src/matchers.js',
    },
    output: [
      {
        dir: path.dirname(pkg.exports['./matchers'].import),
        format: 'esm',
      },
      {
        dir: path.dirname(pkg.exports['./matchers'].require),
        format: 'cjs',
      },
    ],
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
  },
]
