import {render} from './helpers/test-utils'

test('.toBeRequired', () => {
  const {queryByTestId} = render(`
    <div>
      <input data-testid="required-input" required>
      <input data-testid="aria-required-input" aria-required="true">
      <input data-testid="conflicted-input" required aria-required="false">
      <input data-testid="not-required-input" aria-required="false">
      <input data-testid="basic-input">
      <input data-testid="unsupported-type" type="image" required>
      <select data-testid="select" required></select>
      <textarea data-testid="textarea" required></textarea>
      <div data-testid="supported-role" role="tree" required></div>
      <div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
    </div>
    `)

  expect(queryByTestId('required-input')).toBeRequired()
  expect(queryByTestId('aria-required-input')).toBeRequired()
  expect(queryByTestId('conflicted-input')).toBeRequired()
  expect(queryByTestId('not-required-input')).not.toBeRequired()
  expect(queryByTestId('basic-input')).not.toBeRequired()
  expect(queryByTestId('unsupported-type')).not.toBeRequired()
  expect(queryByTestId('select')).toBeRequired()
  expect(queryByTestId('textarea')).toBeRequired()
  expect(queryByTestId('supported-role')).not.toBeRequired()
  expect(queryByTestId('supported-role-aria')).toBeRequired()

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
  expect(() =>
    expect(queryByTestId('unsupported-type')).toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('select')).not.toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('textarea')).not.toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('supported-role')).toBeRequired(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('supported-role-aria')).not.toBeRequired(),
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
      <input data-testid="unsupported-type" type="image" required>
      <select data-testid="select" required></select>
      <textarea data-testid="textarea" required></textarea>
      <div data-testid="supported-role" role="tree" required></div>
      <div data-testid="supported-role-aria" role="tree" aria-required="true"></div>
    </div>
    `)

  expect(queryByTestId('required-input')).not.toBeOptional()
  expect(queryByTestId('aria-required-input')).not.toBeOptional()
  expect(queryByTestId('conflicted-input')).not.toBeOptional()
  expect(queryByTestId('not-required-input')).toBeOptional()
  expect(queryByTestId('basic-input')).toBeOptional()
  expect(queryByTestId('unsupported-type')).toBeOptional()
  expect(queryByTestId('select')).not.toBeOptional()
  expect(queryByTestId('textarea')).not.toBeOptional()
  expect(queryByTestId('supported-role')).toBeOptional()
  expect(queryByTestId('supported-role-aria')).not.toBeOptional()

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
  expect(() =>
    expect(queryByTestId('unsupported-type')).not.toBeOptional(),
  ).toThrowError()
  expect(() => expect(queryByTestId('select')).toBeOptional()).toThrowError()
  expect(() => expect(queryByTestId('textarea')).toBeOptional()).toThrowError()
  expect(() =>
    expect(queryByTestId('supported-role')).not.toBeOptional(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('supported-role-aria')).toBeOptional(),
  ).toThrowError()
})
