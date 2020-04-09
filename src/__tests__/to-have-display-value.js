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

  queryByTestId('select').value = 'banana'
  expect(queryByTestId('select')).toHaveDisplayValue('Banana')
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

  Array.from(queryByTestId('select').options).forEach(option => {
    option.selected = ['ananas', 'banana'].includes(option.value)
  })

  expect(queryByTestId('select')).toHaveDisplayValue(['Ananas', 'Banana'])
})

test('it should work with input elements', () => {
  const {queryByTestId} = render(`
    <input type="text" data-testid="input" value="Luca" />
  `)

  expect(queryByTestId('input')).toHaveDisplayValue('Luca')

  queryByTestId('input').value = 'Piero'
  expect(queryByTestId('input')).toHaveDisplayValue('Piero')
})

test('it should work with textarea elements', () => {
  const {queryByTestId} = render(
    '<textarea data-testid="textarea-example">An example description here.</textarea>',
  )

  expect(queryByTestId('textarea-example')).toHaveDisplayValue(
    'An example description here.',
  )

  queryByTestId('textarea-example').value = 'Another example'
  expect(queryByTestId('textarea-example')).toHaveDisplayValue(
    'Another example',
  )
})

test('it should throw if element is not valid', () => {
  const {queryByTestId} = render(`
    <div data-testid="div">Banana</div>
    <input type="radio" data-testid="radio" value="Something" />
    <input type="checkbox" data-testid="checkbox" />
  `)

  let errorMessage
  try {
    expect(queryByTestId('div')).toHaveDisplayValue('Banana')
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toMatchInlineSnapshot(
    `".toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead."`,
  )

  try {
    expect(queryByTestId('radio')).toHaveDisplayValue('Something')
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toMatchInlineSnapshot(
    `".toHaveDisplayValue() currently does not support input[type=\\"radio\\"], try with another matcher instead."`,
  )

  try {
    expect(queryByTestId('checkbox')).toHaveDisplayValue(true)
  } catch (err) {
    errorMessage = err.message
  }

  expect(errorMessage).toMatchInlineSnapshot(
    `".toHaveDisplayValue() currently does not support input[type=\\"checkbox\\"], try with another matcher instead."`,
  )
})
