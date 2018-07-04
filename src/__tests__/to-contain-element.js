import '../extend-expect'
import {plugins} from 'pretty-format'
import {render} from './helpers/test-utils'

expect.addSnapshotSerializer(plugins.ConvertAnsi)

test('.toContainElement', () => {
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

  expect(grandparent).toContainElement(parent)
  expect(grandparent).toContainElement(child)
  expect(parent).toContainElement(child)
  expect(parent).not.toContainElement(grandparent)
  expect(child).not.toContainElement(parent)
  expect(child).not.toContainElement(grandparent)

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(nonExistantElement).not.toContainElement(child),
  ).toThrowError()
  expect(() => expect(parent).toContainElement(grandparent)).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainElement(grandparent),
  ).toThrowError()
  expect(() =>
    expect(grandparent).toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(nonExistantElement).toContainElement(fakeElement),
  ).toThrowError()
  expect(() =>
    expect(fakeElement).toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() =>
    expect(fakeElement).not.toContainElement(nonExistantElement),
  ).toThrowError()
  expect(() => expect(fakeElement).toContainElement(grandparent)).toThrowError()
  expect(() => expect(grandparent).toContainElement(fakeElement)).toThrowError()
  expect(() => expect(fakeElement).toContainElement(fakeElement)).toThrowError()
  expect(() => expect(grandparent).not.toContainElement(child)).toThrowError()
})
