import {render} from './helpers/test-utils'

/* eslint-disable max-statements */
test('.toContainHtml', () => {
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
  const svgElement = queryByTestId('svg-element')

  expect(grandparent).toContainHtml(stringChildElement)
  expect(parent).toContainHtml(stringChildElement)
  expect(child).toContainHtml(stringChildElement)

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(nonExistantElement).not.toContainHtml(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).not.toContainHtml(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(stringChildElement).not.toContainHtml(fakeElement),
  ).toThrowError()
  expect(() =>
    expect(svgElement).toContainHtml(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(grandparent).not.toContainHtml(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(parent).not.toContainHtml(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(child).not.toContainHtml(stringChildElement),
  ).toThrowError()
})
