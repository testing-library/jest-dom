const path = require('path')
const config = require('kcd-scripts/jest')

module.exports = {
  ...config,
  rootDir: path.resolve(__dirname, '..'),
  displayName: 'jsdom',
  testEnvironment: 'jsdom',
}
