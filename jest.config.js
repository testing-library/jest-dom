const config = require('kcd-scripts/jest')

module.exports = {
  ...config,
  projects: [
    require.resolve('jest-watch-select-projects'),
    require.resolve('./tests/jest.config.dom'),
    require.resolve('./tests/jest.config.node'),
  ],
}
