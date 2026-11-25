import packageJson from '../../package.json'

test('declares the aria-query type dependency used by public types', () => {
  expect(packageJson.dependencies['@types/aria-query']).toBeDefined()
})
