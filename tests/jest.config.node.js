const path = require('path')
const config = require('kcd-scripts/jest')

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  displayName: 'node',
  testEnvironment: 'node',
  ...config,
  setupFilesAfterEnv: ['<rootDir>/tests/setup-env.ts'],
  transform: {
    '.ts': 'ts-jest',
  },
}
