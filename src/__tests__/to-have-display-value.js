import {render} from './helpers/test-utils'

test('it should work as expected', () => {
  const {queryByTestId} = render(`
    <select id="fruits" data-testid="select">
      <option value="">Select a fruit...</option>
      <option value="ananas">Ananas</option>
      <option value="banana">Banana</option>
      <option value="avocado">Avocado</option>
    </select>
  `)

  expect(queryByTestId('select')).toHaveDisplayValue('Select a fruit...')
  expect(queryByTestId('select')).not.toHaveDisplayValue('Banana')
  expect(() =>
    expect(queryByTestId('select')).not.toHaveDisplayValue('Select a fruit...'),
  ).toThrow()
  expect(() =>
    expect(queryByTestId('select')).toHaveDisplayValue('Ananas'),
  ).toThrow()
})

test('it should work with select multiple', () => {
  const {queryByTestId} = render(`
    <select id="fruits" data-testid="select" multiple>
      <option value="">Select a fruit...</option>
      <option value="ananas" selected>Ananas</option>
      <option value="banana">Banana</option>
      <option value="avocado" selected>Avocado</option>
    </select>
  `)

  expect(queryByTestId('select')).toHaveDisplayValue(['Ananas', 'Avocado'])
  expect(() =>
    expect(queryByTestId('select')).not.toHaveDisplayValue([
      'Ananas',
      'Avocado',
    ]),
  ).toThrow()

  expect(queryByTestId('select')).not.toHaveDisplayValue('Ananas')
  expect(() =>
    expect(queryByTestId('select')).toHaveDisplayValue('Ananas'),
  ).toThrow()
})

test('it should throw if element is not valid', () => {
  const {queryByTestId} = render(`
    <input type="text" data-testid="input" value="Banana" />
  `)

  let errorMessage
  try {
    expect(queryByTestId('input')).toHaveDisplayValue('Banana')
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toMatchInlineSnapshot(
    `".toHaveDisplayValue() currently supports select elements only, try to use .toHaveValue() or .toBeChecked() instead."`,
  )
})
