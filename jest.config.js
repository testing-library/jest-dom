const jestConfig = require('kcd-scripts/jest')

module.exports = Object.assign(jestConfig, {
  testEnvironment: 'jest-environment-node',
  testURL: 'http://localhost/',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
})
