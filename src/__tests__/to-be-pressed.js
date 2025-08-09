import {render} from './helpers/test-utils'

describe('.toBePressed', () => {
  test('handles button element', () => {
    const {queryByTestId} = render(`
      <button data-testid="button-pressed" aria-pressed="true" />
      <button data-testid="button-not-pressed" aria-pressed="false" />
    `)

    expect(queryByTestId('button-pressed')).toBePressed()
    expect(queryByTestId('button-not-pressed')).not.toBePressed()
  })

  test('handles element with role="button"', () => {
    const {queryByTestId} = render(`
      <span role="button" aria-pressed="true" data-testid="button-pressed" />
      <span role="button" aria-pressed="false" data-testid="button-not-pressed" />
    `)

    expect(queryByTestId('button-pressed')).toBePressed()
    expect(queryByTestId('button-not-pressed')).not.toBePressed()
  })

  test('handles input with button type', () => {
    const {queryByTestId} = render(`
      <input type="button" aria-pressed="true" data-testid="button-pressed" />
      <input type="button" aria-pressed="false" data-testid="button-not-pressed" />
    `)

    expect(queryByTestId('button-pressed')).toBePressed()
    expect(queryByTestId('button-not-pressed')).not.toBePressed()
  })

  test('throw an error when pressable element is not pressed but expected to be', () => {
    const {queryByTestId} = render(`
      <button data-testid="button" aria-pressed="false" />
    `)

    expect(() => expect(queryByTestId('button')).toBePressed())
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toBePressed()</>

      Expected element to have:
      <green>  aria-pressed="true"</>
      Received:
      <red>  aria-pressed="false"</>
    `)
  })

  test('throw an error when pressable element is pressed but expected not to be', () => {
    const {queryByTestId} = render(`
      <button data-testid="button" aria-pressed="true" />
    `)

    expect(() => expect(queryByTestId('button')).not.toBePressed())
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toBePressed()</>

      Expected element to have:
      <green>  aria-pressed="false"</>
      Received:
      <red>  aria-pressed="true"</>
    `)
  })

  test('throw an error when pressable element has invalid aria-pressed attribute', () => {
    const {queryByTestId} = render(`
      <button data-testid="button" aria-pressed="invalid" />
    `)

    expect(() =>
      expect(queryByTestId('button')).toBePressed(),
    ).toThrowErrorMatchingInlineSnapshot(
      `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePressed()`,
    )
  })

  test('throws when element do not have aria-pressed attribute', () => {
    const {queryByTestId} = render(`<span data-testid="span" />`)

    expect(() =>
      expect(queryByTestId('span')).toBePressed(),
    ).toThrowErrorMatchingInlineSnapshot(
      `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePressed()`,
    )
  })
})
