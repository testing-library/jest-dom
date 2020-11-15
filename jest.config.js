const config = require('kcd-scripts/jest')

module.exports = {
  ...config,
  watchPlugins: [
    ...config.watchPlugins,
    require.resolve('jest-watch-select-projects'),
  ],
  projects: [
    require.resolve('./tests/jest.config.dom'),
    require.resolve('./tests/jest.config.node'),
  ],
}
