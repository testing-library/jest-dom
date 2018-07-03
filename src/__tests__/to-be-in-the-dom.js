import '../extend-expect'
import {plugins} from 'pretty-format'
import {render} from './helpers/test-utils'

expect.addSnapshotSerializer(plugins.ConvertAnsi)

test('.toBeInTheDOM', () => {
  const {queryByTestId} = render(`
  <span data-testid="count-container">
    <span data-testid="count-value"></span> 
  </span>`)

  const containerElement = queryByTestId('count-container')
  const valueElement = queryByTestId('count-value')
  const nonExistantElement = queryByTestId('not-exists')
  const fakeElement = {thisIsNot: 'an html element'}

  // Testing toBeInTheDOM without container
  expect(valueElement).toBeInTheDOM()
  expect(nonExistantElement).not.toBeInTheDOM()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(valueElement).not.toBeInTheDOM()).toThrowError()

  expect(() => expect(nonExistantElement).toBeInTheDOM()).toThrowError()

  expect(() => expect(fakeElement).toBeInTheDOM()).toThrowError()

  // Testing toBeInTheDOM with container
  expect(valueElement).toBeInTheDOM(containerElement)
  expect(containerElement).not.toBeInTheDOM(valueElement)

  expect(() =>
    expect(valueElement).not.toBeInTheDOM(containerElement),
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
})
