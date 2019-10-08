import {render} from './helpers/test-utils'

describe('.toBeChecked', () => {
  test('handles checkbox input', () => {
    const {queryByTestId} = render(`
        <input type="checkbox" checked data-testid="input-checked" />
        <input type="checkbox" data-testid="input-empty" />
    `)

    expect(queryByTestId('input-checked')).toBeChecked()
    expect(queryByTestId('input-empty')).not.toBeChecked()
  })

  test('throws when checkbox is checked but expected not to be', () => {
    const {queryByTestId} = render(
      `<input type="checkbox" checked data-testid="input-checked" />`,
    )

    expect(() =>
      expect(queryByTestId('input-checked')).not.toBeChecked(),
    ).toThrowError()
  })

  test('throws when checkbox is not checked but expected to be', () => {
    const {queryByTestId} = render(
      `<input type="checkbox" data-testid="input-empty" />`,
    )

    expect(() =>
      expect(queryByTestId('input-empty')).toBeChecked(),
    ).toThrowError()
  })

  test('throws when the element is not an input', () => {
    const {queryByTestId} = render(`<select data-testid="select"></select>`)
    expect(() => expect(queryByTestId('select')).toBeChecked()).toThrowError(
      'only inputs with type=checkbox can be used with .toBeChecked(). Use .toHaveFormValues() instead',
    )
  })

  test('throws when the element is not a checkbox input', () => {
    const {queryByTestId} = render(
      `<input type="radio" checked data-testid="radio" />`,
    )

    expect(() => expect(queryByTestId('radio')).toBeChecked()).toThrowError(
      `only inputs with type=checkbox can be used with .toBeChecked(). Use .toHaveFormValues() instead`,
    )
  })
})
