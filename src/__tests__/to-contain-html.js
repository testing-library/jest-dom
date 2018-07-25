import {render} from './helpers/test-utils'

/* eslint-disable max-statements */
test('.toContainHtml', () => {
  const {queryByTestId} = render(`
    <span data-testid="grandparent">
      <span data-testid="parent">
        <span data-testid="child"></span>
      </span>
    </span>
    `)

  const grandparent = queryByTestId('grandparent')
  const parent = queryByTestId('parent')
  const child = queryByTestId('child')
  const nonExistantElement = queryByTestId('not-exists')
  const fakeElement = {thisIsNot: 'an html element'}
  const stringChildElement = '<span data-testid="child"></span>'

  expect(grandparent).toContainHtml(stringChildElement)
  expect(parent).toContainHtml(stringChildElement)
  expect(child).toContainHtml(stringChildElement)

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(nonExistantElement).not.toContainHtml(stringChildElement),
  ).toThrowError()
  expect(() =>
    expect(fakeElement).toContainHtml(nonExistantElement),
  ).toThrowError()
})
