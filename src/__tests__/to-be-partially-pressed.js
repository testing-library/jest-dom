import {render} from './helpers/test-utils'

describe('.toBePartiallyPressed', () => {
  test('handles button element', () => {
    const {queryByTestId} = render(`
      <button data-testid="button-partially-pressed" aria-pressed="mixed" />
      <button data-testid="button-not-pressed" aria-pressed="true" />
      <button data-testid="button-pressed" aria-pressed="false" />
      <button data-testid="button" />
    `)

    expect(queryByTestId('button-partially-pressed')).toBePartiallyPressed()
    expect(queryByTestId('button-not-pressed')).not.toBePartiallyPressed()
    expect(queryByTestId('button-pressed')).not.toBePartiallyPressed()
    expect(queryByTestId('button')).not.toBePartiallyPressed()
  })

  test('handles element with role="button"', () => {
    const {queryByTestId} = render(`
      <span role="button" aria-pressed="mixed" data-testid="button-partially-pressed" />
      <span role="button" aria-pressed="true" data-testid="button-not-pressed" />
      <span role="button" aria-pressed="false" data-testid="button-pressed" />
      <span role="button" data-testid="button" />
    `)

    expect(queryByTestId('button-partially-pressed')).toBePartiallyPressed()
    expect(queryByTestId('button-not-pressed')).not.toBePartiallyPressed()
    expect(queryByTestId('button-pressed')).not.toBePartiallyPressed()
    expect(queryByTestId('button')).not.toBePartiallyPressed()
  })

  test('handles input with button type', () => {
    const {queryByTestId} = render(`
      <input type="button" aria-pressed="mixed" data-testid="button-partially-pressed" />
      <input type="button" aria-pressed="true" data-testid="button-not-pressed" />
      <input type="button" aria-pressed="false" data-testid="button-pressed" />
      <input type="button" data-testid="button" />
    `)

    expect(queryByTestId('button-partially-pressed')).toBePartiallyPressed()
    expect(queryByTestId('button-not-pressed')).not.toBePartiallyPressed()
    expect(queryByTestId('button-pressed')).not.toBePartiallyPressed()
    expect(queryByTestId('button')).not.toBePartiallyPressed()
  })

  test('throw an error when pressable element is not partially pressed but expected to be', () => {
    const {queryByTestId} = render(`
      <button data-testid="button" aria-pressed="true" />
    `)

    expect(() => expect(queryByTestId('button')).toBePartiallyPressed())
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toBePartiallyPressed()</>
      
      Expected element to have:
      <green>  aria-pressed="mixed"</>
      Received:
      <red>  aria-pressed="true"</>
    `)
  })

  test('throw an error when pressable element is partially pressed but expected not to be', () => {
    const {queryByTestId} = render(`
      <button data-testid="button" aria-pressed="mixed" />
    `)

    expect(() => expect(queryByTestId('button')).not.toBePartiallyPressed())
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toBePartiallyPressed()</>

      Expected element not to have:
      <green>  aria-pressed="mixed"</>
      Received:
      <red>  aria-pressed="mixed"</>
    `)
  })

  test('throw an error when pressable element has invalid aria-pressed attribute', () => {
    const {queryByTestId} = render(`
      <button data-testid="button" aria-pressed="invalid" />
    `)

    expect(() =>
      expect(queryByTestId('button')).toBePartiallyPressed(),
    ).toThrowErrorMatchingInlineSnapshot(
      `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePartiallyPressed()`,
    )
  })

  test('throws when element is not a button', () => {
    const {queryByTestId} = render(`
      <div data-testid="div" aria-pressed="mixed" />
    `)

    expect(() =>
      expect(queryByTestId('div')).toBePartiallyPressed(),
    ).toThrowErrorMatchingInlineSnapshot(
      `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePartiallyPressed()`,
    )
  })

  test('throws when element do not have aria-pressed attribute', () => {
    const {queryByTestId} = render(`<span data-testid="span" />`)

    expect(() =>
      expect(queryByTestId('span')).toBePartiallyPressed(),
    ).toThrowErrorMatchingInlineSnapshot(
      `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePartiallyPressed()`,
    )
  })
})
