const path = require('path')
const baseConfig = require('../jest.config')

module.exports = {
  ...baseConfig,
  rootDir: path.resolve(__dirname, '..'),
  displayName: 'jsdom',
  testEnvironment: 'jsdom',
  // Remove projects and watchPlugins config for sub-projects
  projects: undefined,
  watchPlugins: undefined,
}
