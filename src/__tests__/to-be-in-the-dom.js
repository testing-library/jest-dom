import {render} from './helpers/test-utils'

test('.toBeInTheDOM', () => {
  // @deprecated intentionally hiding warnings for test clarity
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  const {queryByTestId} = render(`
    <span data-testid="count-container">
      <span data-testid="count-value"></span>
      <svg data-testid="svg-element"></svg>
    </span>`)

  const containerElement = queryByTestId('count-container')
  const valueElement = queryByTestId('count-value')
  const nonExistantElement = queryByTestId('not-exists')
  const svgElement = queryByTestId('svg-element')
  const fakeElement = {thisIsNot: 'an html element'}

  // Testing toBeInTheDOM without container
  expect(valueElement).toBeInTheDOM()
  expect(svgElement).toBeInTheDOM()
  expect(nonExistantElement).not.toBeInTheDOM()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(valueElement).not.toBeInTheDOM()).toThrowError()

  expect(() => expect(svgElement).not.toBeInTheDOM()).toThrowError()

  expect(() => expect(nonExistantElement).toBeInTheDOM()).toThrowError()

  expect(() => expect(fakeElement).toBeInTheDOM()).toThrowError()

  // Testing toBeInTheDOM with container
  expect(valueElement).toBeInTheDOM(containerElement)
  expect(svgElement).toBeInTheDOM(containerElement)
  expect(containerElement).not.toBeInTheDOM(valueElement)

  expect(() =>
    expect(valueElement).not.toBeInTheDOM(containerElement),
  ).toThrowError()

  expect(() =>
    expect(svgElement).not.toBeInTheDOM(containerElement),
  ).toThrowError()

  expect(() =>
    expect(nonExistantElement).toBeInTheDOM(containerElement),
  ).toThrowError()

  expect(() =>
    expect(fakeElement).toBeInTheDOM(containerElement),
  ).toThrowError()

  expect(() => {
    expect(valueElement).toBeInTheDOM(fakeElement)
  }).toThrowError()

  spy.mockRestore()
})
