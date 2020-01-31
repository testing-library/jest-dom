import {render} from './helpers/test-utils'

describe('.toBeChecked', () => {
  test('handles checkbox input', () => {
    const {queryByTestId} = render(`
        <input type="checkbox" checked data-testid="input-checkbox-checked" />
        <input type="checkbox" data-testid="input-checkbox-unchecked" />
    `)

    expect(queryByTestId('input-checkbox-checked')).toBeChecked()
    expect(queryByTestId('input-checkbox-unchecked')).not.toBeChecked()
  })

  test('handles radio input', () => {
    const {queryByTestId} = render(`
        <input type="radio" checked value="foo" data-testid="input-radio-checked" />
        <input type="radio" value="foo" data-testid="input-radio-unchecked" />
    `)

    expect(queryByTestId('input-radio-checked')).toBeChecked()
    expect(queryByTestId('input-radio-unchecked')).not.toBeChecked()
  })

  test('handles element with role="checkbox"', () => {
    const {queryByTestId} = render(`
        <div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
        <div role="checkbox" aria-checked="false" data-testid="aria-checkbox-unchecked" />
    `)

    expect(queryByTestId('aria-checkbox-checked')).toBeChecked()
    expect(queryByTestId('aria-checkbox-unchecked')).not.toBeChecked()
  })

  test('handles element with role="radio"', () => {
    const {queryByTestId} = render(`
        <div role="radio" aria-checked="true" data-testid="aria-radio-checked" />
        <div role="radio" aria-checked="false" data-testid="aria-radio-unchecked" />
    `)

    expect(queryByTestId('aria-radio-checked')).toBeChecked()
    expect(queryByTestId('aria-radio-unchecked')).not.toBeChecked()
  })

  test('throws when checkbox input is checked but expected not to be', () => {
    const {queryByTestId} = render(
      `<input type="checkbox" checked data-testid="input-checked" />`,
    )

    expect(() =>
      expect(queryByTestId('input-checked')).not.toBeChecked(),
    ).toThrowError()
  })

  test('throws when input checkbox is not checked but expected to be', () => {
    const {queryByTestId} = render(
      `<input type="checkbox" data-testid="input-empty" />`,
    )

    expect(() =>
      expect(queryByTestId('input-empty')).toBeChecked(),
    ).toThrowError()
  })

  test('throws when element with role="checkbox" is checked but expected not to be', () => {
    const {queryByTestId} = render(
      `<div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />`,
    )

    expect(() =>
      expect(queryByTestId('aria-checkbox-checked')).not.toBeChecked(),
    ).toThrowError()
  })

  test('throws when element with role="checkbox" is not checked but expected to be', () => {
    const {queryByTestId} = render(
      `<div role="checkbox" aria-checked="false" data-testid="aria-checkbox-unchecked" />`,
    )

    expect(() =>
      expect(queryByTestId('aria-checkbox-unchecked')).toBeChecked(),
    ).toThrowError()
  })

  test('throws when radio input is checked but expected not to be', () => {
    const {queryByTestId} = render(
      `<input type="radio" checked data-testid="input-radio-checked" />`,
    )

    expect(() =>
      expect(queryByTestId('input-radio-checked')).not.toBeChecked(),
    ).toThrowError()
  })

  test('throws when input radio is not checked but expected to be', () => {
    const {queryByTestId} = render(
      `<input type="radio" data-testid="input-radio-unchecked" />`,
    )

    expect(() =>
      expect(queryByTestId('input-radio-unchecked')).toBeChecked(),
    ).toThrowError()
  })

  test('throws when element with role="radio" is checked but expected not to be', () => {
    const {queryByTestId} = render(
      `<div role="radio" aria-checked="true" data-testid="aria-radio-checked" />`,
    )

    expect(() =>
      expect(queryByTestId('aria-radio-checked')).not.toBeChecked(),
    ).toThrowError()
  })

  test('throws when element with role="radio" is not checked but expected to be', () => {
    const {queryByTestId} = render(
      `<div role="radio" aria-checked="false" data-testid="aria-radio-unchecked" />`,
    )

    expect(() =>
      expect(queryByTestId('aria-checkbox-unchecked')).toBeChecked(),
    ).toThrowError()
  })

  test('throws when element with role="checkbox" has an invalid aria-checked attribute', () => {
    const {queryByTestId} = render(
      `<div role="checkbox" aria-checked="something" data-testid="aria-checkbox-invalid" />`,
    )

    expect(() =>
      expect(queryByTestId('aria-checkbox-invalid')).toBeChecked(),
    ).toThrowError(
      'only inputs with type="checkbox" or type="radio" or elements with role="checkbox" or role="radio" and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead',
    )
  })

  test('throws when element with role="radio" has an invalid aria-checked attribute', () => {
    const {queryByTestId} = render(
      `<div role="radio" aria-checked="something" data-testid="aria-radio-invalid" />`,
    )

    expect(() =>
      expect(queryByTestId('aria-radio-invalid')).toBeChecked(),
    ).toThrowError(
      'only inputs with type="checkbox" or type="radio" or elements with role="checkbox" or role="radio" and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead',
    )
  })

  test('throws when the element is not an input', () => {
    const {queryByTestId} = render(`<select data-testid="select"></select>`)
    expect(() => expect(queryByTestId('select')).toBeChecked()).toThrowError(
      'only inputs with type="checkbox" or type="radio" or elements with role="checkbox" or role="radio" and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead',
    )
  })
})
