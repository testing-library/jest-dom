const path = require('path')
const baseConfig = require('../jest.config')

module.exports = {
  ...baseConfig,
  rootDir: path.resolve(__dirname, '..'),
  displayName: 'node',
  testEnvironment: 'node',
  // Remove projects and watchPlugins config for sub-projects
  projects: undefined,
  watchPlugins: undefined,
}
