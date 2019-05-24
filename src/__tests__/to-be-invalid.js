import {JSDOM} from 'jsdom'
import {render} from './helpers/test-utils'

/*
 * This function is being used to test if `.toBeInvalid` and `.toBeValid`
 * are correctly triggered by the DOM Node method `.checkValidity()`, part
 * of the Web API.
 *
 * For this check, we are using the `jsdom` library to return a DOM Node
 * sending the good information to our test.
 *
 * We are using this library because without it `.checkValidity()` returns
 * always `true` when using `yarn test` in a terminal.
 *
 * Please consult the PR 110 to get more information:
 * https://github.com/testing-library/jest-dom/pull/110
 *
 * @link https://github.com/testing-library/jest-dom/pull/110
 * @link https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
 * @link https://github.com/jsdom/jsdom
 */
function getDOMInput(htmlString) {
  const dom = new JSDOM(htmlString)

  return dom.window.document.querySelector('input')
}

const invalidInputNode = getDOMInput(
  `<input pattern="[a-z]{1,3}" value="test+">`,
)

test('.toBeInvalid', () => {
  const {queryByTestId} = render(`
    <div>
      <input data-testid="no-aria-invalid">
      <input data-testid="aria-invalid" aria-invalid>
      <input data-testid="aria-invalid-value" aria-invalid="true">
      <input data-testid="aria-invalid-false" aria-invalid="false">
    </div>
    `)

  expect(queryByTestId('no-aria-invalid')).not.toBeInvalid()
  expect(queryByTestId('aria-invalid')).toBeInvalid()
  expect(queryByTestId('aria-invalid-value')).toBeInvalid()
  expect(queryByTestId('aria-invalid-false')).not.toBeInvalid()
  expect(invalidInputNode).toBeInvalid()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('no-aria-invalid')).toBeInvalid(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-invalid')).not.toBeInvalid(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-invalid-value')).not.toBeInvalid(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-invalid-false')).toBeInvalid(),
  ).toThrowError()
  expect(() => expect(invalidInputNode).not.toBeInvalid()).toThrowError()
})

test('.toBeValid', () => {
  const {queryByTestId} = render(`
    <div>
      <input data-testid="no-aria-invalid">
      <input data-testid="aria-invalid" aria-invalid>
      <input data-testid="aria-invalid-value" aria-invalid="true">
      <input data-testid="aria-invalid-false" aria-invalid="false">
    </div>
    `)

  expect(queryByTestId('no-aria-invalid')).toBeValid()
  expect(queryByTestId('aria-invalid')).not.toBeValid()
  expect(queryByTestId('aria-invalid-value')).not.toBeValid()
  expect(queryByTestId('aria-invalid-false')).toBeValid()
  expect(invalidInputNode).not.toBeValid()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('no-aria-invalid')).not.toBeValid(),
  ).toThrowError()
  expect(() => expect(queryByTestId('aria-invalid')).toBeValid()).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-invalid-value')).toBeValid(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-invalid-false')).not.toBeValid(),
  ).toThrowError()
  expect(() => expect(invalidInputNode).toBeValid()).toThrowError()
})
