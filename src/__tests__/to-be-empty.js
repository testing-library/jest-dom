import {render} from './helpers/test-utils'

test('.toBeEmpty', () => {
  const {queryByTestId} = render(`
    <span data-testid="not-empty">
        <span data-testid="empty"></span>
        <svg data-testid="svg-empty"></svg>
    </span>`)

  const empty = queryByTestId('empty')
  const notEmpty = queryByTestId('not-empty')
  const svgEmpty = queryByTestId('svg-empty')
  const nonExistantElement = queryByTestId('not-exists')
  const fakeElement = {thisIsNot: 'an html element'}

  expect(empty).toBeEmpty()
  expect(svgEmpty).toBeEmpty()
  expect(notEmpty).not.toBeEmpty()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(empty).not.toBeEmpty()).toThrowError()

  expect(() => expect(svgEmpty).not.toBeEmpty()).toThrowError()

  expect(() => expect(notEmpty).toBeEmpty()).toThrowError()

  expect(() => expect(fakeElement).toBeEmpty()).toThrowError()

  expect(() => {
    expect(nonExistantElement).toBeEmpty()
  }).toThrowError()
})
