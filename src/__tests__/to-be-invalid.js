import {JSDOM} from 'jsdom'
import {render} from './helpers/test-utils'

test('.toBeInvalid', () => {
  const {queryByTestId} = render(`
    <div>
      <input data-testid="no-aria-invalid">
      <input data-testid="aria-invalid" aria-invalid>
      <input data-testid="aria-invalid-value" aria-invalid="true">
      <input data-testid="aria-invalid-false" aria-invalid="false">
    </div>
    `)

  const dom = new JSDOM(`<input pattern="[a-z]{1,3}" value="test+">`)

  expect(queryByTestId('no-aria-invalid')).not.toBeInvalid()
  expect(queryByTestId('aria-invalid')).toBeInvalid()
  expect(queryByTestId('aria-invalid-value')).toBeInvalid()
  expect(queryByTestId('aria-invalid-false')).not.toBeInvalid()
  expect(dom.window.document.querySelector('input')).toBeInvalid()

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
  expect(() =>
    expect(dom.window.document.querySelector('input')).not.toBeInvalid(),
  ).toThrowError()
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

  const dom = new JSDOM(`<input pattern="[a-z]{1,3}" value="test+">`)

  expect(queryByTestId('no-aria-invalid')).toBeValid()
  expect(queryByTestId('aria-invalid')).not.toBeValid()
  expect(queryByTestId('aria-invalid-value')).not.toBeValid()
  expect(queryByTestId('aria-invalid-false')).toBeValid()
  expect(dom.window.document.querySelector('input')).not.toBeValid()

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
  expect(() =>
    expect(dom.window.document.querySelector('input')).toBeValid(),
  ).toThrowError()
})
