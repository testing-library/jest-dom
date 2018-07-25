import {render} from './helpers/test-utils'

/* eslint-disable max-statements */
test('.toContainHTML', () => {
  const {queryByTestId} = render(`
    <span data-testid="grandparent">
      <span data-testid="parent">
        <span data-testid="child"></span>
      </span>
      <svg data-testid="svg-element"></svg>
    </span>
    `)

  const grandparent = queryByTestId('grandparent')
  const parent = queryByTestId('parent')
  const child = queryByTestId('child')
  const nonExistantElement = queryByTestId('not-exists')
  const fakeElement = {thisIsNot: 'an html element'}
  const stringChildElement = '<span data-testid="child"></span>'
  const incorrectStringHtml = '<span data-testid="child"></div>'
  const nonExistantString = '<span> Does not exists </span>'
  const svgElement = queryByTestId('svg-element')

  expect(grandparent).toContainHTML(stringChildElement)
  expect(parent).toContainHTML(stringChildElement)
  expect(child).toContainHTML(stringChildElement)
  expect(grandparent).not.toContainHTML(nonExistantString)
  expect(parent).not.toContainHTML(nonExistantString)
  expect(child).not.toContainHTML(nonExistantString)
  expect(child).not.toContainHTML(nonExistantString)
  expect(grandparent).not.toContainHTML(incorrectStringHtml)
  expect(parent).not.toContainHTML(incorrectStringHtml)
  expect(child).not.toContainHTML(incorrectStringHtml)
  expect(child).not.toContainHTML(incorrectStringHtml)

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(nonExistantElement).not.toContainHTML(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).not.toContainHTML(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(stringChildElement).not.toContainHTML(fakeElement),
  ).toThrowError()
  expect(() =>
    expect(svgElement).toContainHTML(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(grandparent).not.toContainHTML(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(parent).not.toContainHTML(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(child).not.toContainHTML(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(child).not.toContainHTML(stringChildElement),
  ).toThrowError()
  expect(() => expect(child).toContainHTML(nonExistantString)).toThrowError()
  expect(() => expect(parent).toContainHTML(nonExistantString)).toThrowError()
  expect(() =>
    expect(grandparent).toContainHTML(nonExistantString),
  ).toThrowError()
  expect(() => expect(child).toContainHTML(nonExistantElement)).toThrowError()
  expect(() => expect(parent).toContainHTML(nonExistantElement)).toThrowError()
  expect(() =>
    expect(grandparent).toContainHTML(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainHTML(incorrectStringHtml),
  ).toThrowError()
  expect(() =>
    expect(grandparent).toContainHTML(incorrectStringHtml),
  ).toThrowError()
  expect(() => expect(child).toContainHTML(incorrectStringHtml)).toThrowError()
  expect(() => expect(parent).toContainHTML(incorrectStringHtml)).toThrowError()
})
