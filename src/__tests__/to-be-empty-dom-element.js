import {render} from './helpers/test-utils'

test('.toBeEmptyDOMElement', () => {
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

  expect(empty).toBeEmptyDOMElement()
  expect(svgEmpty).toBeEmptyDOMElement()
  expect(notEmpty).not.toBeEmptyDOMElement()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(empty).not.toBeEmptyDOMElement()).toThrowError()

  expect(() => expect(svgEmpty).not.toBeEmptyDOMElement()).toThrowError()

  expect(() => expect(notEmpty).toBeEmptyDOMElement()).toThrowError()

  expect(() => expect(fakeElement).toBeEmptyDOMElement()).toThrowError()

  expect(() => {
    expect(nonExistantElement).toBeEmptyDOMElement()
  }).toThrowError()
})
