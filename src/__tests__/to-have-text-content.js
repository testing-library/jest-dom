import {render} from './helpers/test-utils'

describe('.toHaveTextContent', () => {
  test('handles positive test cases', () => {
    const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

    expect(queryByTestId('count-value')).toHaveTextContent('2')
    expect(queryByTestId('count-value')).toHaveTextContent(2)
    expect(queryByTestId('count-value')).toHaveTextContent(/2/)
    expect(queryByTestId('count-value')).not.toHaveTextContent('21')
  })

  test('handles negative test cases', () => {
    const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

    expect(() =>
      expect(queryByTestId('count-value2')).toHaveTextContent('2'),
    ).toThrowError()

    expect(() =>
      expect(queryByTestId('count-value')).toHaveTextContent('3'),
    ).toThrowError()
    expect(() =>
      expect(queryByTestId('count-value')).not.toHaveTextContent('2'),
    ).toThrowError()
  })

  test('normalizes whitespace', () => {
    const {container} = render(`
      <span>
        Step
          1
            of
              4
      </span>
    `)

    expect(container.querySelector('span')).toHaveTextContent('Step 1 of 4', {
      normalizeSpaces: true,
    })
  })
})
