import {render} from './helpers/test-utils'

test('.toHaveTextContent', () => {
  const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

  expect(queryByTestId('count-value')).toHaveTextContent('2')
  expect(queryByTestId('count-value')).toHaveTextContent(2)
  expect(queryByTestId('count-value')).toHaveTextContent(/2/)
  expect(queryByTestId('count-value')).not.toHaveTextContent('21')
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
