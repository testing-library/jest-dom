import {render} from './helpers/test-utils'

test('.toBeSelected', () => {
  const {queryByTestId} = render(`
    <div>
        <div data-testid="selected" aria-selected="true"></div>
        <div data-testid="not-selected" aria-selected="false"></div>
        <div data-testid="not-selected-defined"></div>
    </div>`)

  const selected = queryByTestId('selected')
  const notSelected = queryByTestId('not-selected')
  const notSelectedDefined = queryByTestId('not-selected-defined')
  const nonExistantElement = queryByTestId('not-exists')
  const fakeElement = {thisIsNot: 'an html element'}

  expect(selected).toBeSelected()
  expect(notSelected).not.toBeSelected()
  expect(notSelectedDefined).not.toBeSelected()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(selected).not.toBeSelected()).toThrowError()

  expect(() => expect(notSelected).toBeSelected()).toThrowError()

  expect(() => expect(notSelectedDefined).toBeSelected()).toThrowError()

  expect(() => expect(fakeElement).toBeSelected()).toThrowError()

  expect(() => {
    expect(nonExistantElement).toBeSelected()
  }).toThrowError()
})
