import {render} from './helpers/test-utils'

test('.toBeRequired', () => {
  const {queryByTestId} = render(`
    <div>
      <input data-testid="required-input" required>
      <input data-testid="aria-required-input" aria-required="true">
      <input data-testid="conflicted-input" required aria-required="false">
      <input data-testid="not-required-input" aria-required="false">
      <input data-testid="basic-input">
    </div>
    `)

  expect(queryByTestId('required-input')).toBeRequired()
  expect(queryByTestId('aria-required-input')).toBeRequired()
  expect(queryByTestId('conflicted-input')).toBeRequired()
  expect(queryByTestId('not-required-input')).not.toBeRequired()
  expect(queryByTestId('basic-input')).not.toBeRequired()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('required-input')).not.toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-required-input')).not.toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('conflicted-input')).not.toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('not-required-input')).toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('basic-input')).toBeRequired(),
  ).toThrowError()
})

test('.toBeOptional', () => {
  const {queryByTestId} = render(`
    <div>
      <input data-testid="required-input" required>
      <input data-testid="aria-required-input" aria-required="true">
      <input data-testid="conflicted-input" required aria-required="false">
      <input data-testid="not-required-input" aria-required="false">
      <input data-testid="basic-input">
    </div>
    `)

  expect(queryByTestId('required-input')).not.toBeOptional()
  expect(queryByTestId('aria-required-input')).not.toBeOptional()
  expect(queryByTestId('conflicted-input')).not.toBeOptional()
  expect(queryByTestId('not-required-input')).toBeOptional()
  expect(queryByTestId('basic-input')).toBeOptional()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('required-input')).toBeOptional(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('aria-required-input')).toBeOptional(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('conflicted-input')).toBeOptional(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('not-required-input')).not.toBeOptional(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('basic-input')).not.toBeOptional(),
  ).toThrowError()
})
