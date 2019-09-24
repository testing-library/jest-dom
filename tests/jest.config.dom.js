const path = require('path')
const config = require('kcd-scripts/jest')

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  displayName: 'jsdom',
  ...config,
  testEnvironment: 'jsdom',
}
