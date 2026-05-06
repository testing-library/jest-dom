const ignores = [
  '/node_modules/',
  '/__fixtures__/',
  '/fixtures/',
  '/__tests__/helpers/',
  '/__tests__/utils/',
  '__mocks__',
]

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  modulePaths: ['<rootDir>/src', 'shared', '<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.+(js|jsx|ts|tsx)'],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.js$'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
    require.resolve('jest-watch-select-projects'),
  ],
  snapshotSerializers: [
    require.resolve('jest-serializer-path'),
    require.resolve('jest-snapshot-serializer-raw/always'),
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-env.js'],
  projects: [
    require.resolve('./tests/jest.config.dom'),
    require.resolve('./tests/jest.config.node'),
  ],
}
