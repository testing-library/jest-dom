const path = require('path')
const config = require('kcd-scripts/jest')

const {watchPlugins, ...configWithoutWatchPlugins} = config

module.exports = {
  ...configWithoutWatchPlugins,
  rootDir: path.resolve(__dirname, '..'),
  displayName: 'jsdom',
  testEnvironment: 'jsdom',
}
