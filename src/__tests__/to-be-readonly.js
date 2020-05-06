import {render} from './helpers/test-utils'

test('handles textarea', () => {
  const {queryByTestId} = render(`
    <textarea readonly data-testid="textarea-element-readonly"></textarea>
    <textarea  data-testid="textarea-element"></textarea>
  `)

  expect(queryByTestId('textarea-element-readonly')).toBeReadonly()
  expect(queryByTestId('textarea-element')).not.toBeReadonly()
})

test('handles text input', () => {
  const {queryByTestId} = render(`
    <input type="text" readonly data-testid="text-input-readonly" />
    <input type="text" data-testid="text-input" />
  `)

  expect(queryByTestId('text-input-readonly')).toBeReadonly()
  expect(queryByTestId('text-input')).not.toBeReadonly()
})

test('handles search input', () => {
  const {queryByTestId} = render(`
    <input type="search" readonly data-testid="search-input-readonly" />
    <input type="search" data-testid="search-input" />
  `)

  expect(queryByTestId('search-input-readonly')).toBeReadonly()
  expect(queryByTestId('search-input')).not.toBeReadonly()
})

test('handles url input', () => {
  const {queryByTestId} = render(`
    <input type="url" readonly data-testid="url-input-readonly" />
    <input type="url" data-testid="url-input" />
  `)

  expect(queryByTestId('url-input-readonly')).toBeReadonly()
  expect(queryByTestId('url-input')).not.toBeReadonly()
})

test('handles email input', () => {
  const {queryByTestId} = render(`
    <input type="email" readonly data-testid="email-input-readonly" />
    <input type="email" data-testid="email-input" />
  `)

  expect(queryByTestId('email-input-readonly')).toBeReadonly()
  expect(queryByTestId('email-input')).not.toBeReadonly()
})

test('handles password input', () => {
  const {queryByTestId} = render(`
    <input type="password" readonly data-testid="password-input-readonly" />
    <input type="password" data-testid="password-input" />
  `)

  expect(queryByTestId('password-input-readonly')).toBeReadonly()
  expect(queryByTestId('password-input')).not.toBeReadonly()
})

test('handles date input', () => {
  const {queryByTestId} = render(`
    <input type="date" readonly data-testid="date-input-readonly" />
    <input type="date" data-testid="date-input" />
  `)

  expect(queryByTestId('date-input-readonly')).toBeReadonly()
  expect(queryByTestId('date-input')).not.toBeReadonly()
})

test('handles month input', () => {
  const {queryByTestId} = render(`
    <input type="month" readonly data-testid="month-input-readonly" />
    <input type="month" data-testid="month-input" />
  `)

  expect(queryByTestId('month-input-readonly')).toBeReadonly()
  expect(queryByTestId('month-input')).not.toBeReadonly()
})

test('handles week input', () => {
  const {queryByTestId} = render(`
    <input type="week" readonly data-testid="week-input-readonly" />
    <input type="week" data-testid="week-input" />
  `)

  expect(queryByTestId('week-input-readonly')).toBeReadonly()
  expect(queryByTestId('week-input')).not.toBeReadonly()
})

test('handles time input', () => {
  const {queryByTestId} = render(`
    <input type="time" readonly data-testid="time-input-readonly" />
    <input type="time" data-testid="time-input" />
  `)

  expect(queryByTestId('time-input-readonly')).toBeReadonly()
  expect(queryByTestId('time-input')).not.toBeReadonly()
})

test('handles datetime-local input', () => {
  const {queryByTestId} = render(`
    <input type="datetime-local" readonly data-testid="datetime-local-input-readonly" />
    <input type="datetime-local" data-testid="datetime-local-input" />
  `)

  expect(queryByTestId('datetime-local-input-readonly')).toBeReadonly()
  expect(queryByTestId('datetime-local-input')).not.toBeReadonly()
})

test('handles number input', () => {
  const {queryByTestId} = render(`
    <input type="number" readonly data-testid="number-input-readonly" />
    <input type="number" data-testid="number-input" />
  `)

  expect(queryByTestId('number-input-readonly')).toBeReadonly()
  expect(queryByTestId('number-input')).not.toBeReadonly()
})

test('handles supported aria roles', () => {
  const {queryByTestId} = render(`
    <table role="grid">
      <thead>
        <tr>
          <th role="columnheader" aria-readonly="true" data-testid="supported-role-aria">The table header</th>
          <th role="columnheader" data-testid="supported-role">The table header</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>The table body</td>
          <td>The table body</td>
        </tr>
      </tbody>
    </table>
  `)

  expect(queryByTestId('supported-role-aria')).toBeReadonly()
  expect(queryByTestId('supported-role')).not.toBeReadonly()
})

test('handles an unsupported elements', () => {
  const {queryByTestId} = render(`
    <div readonly data-testid="unsupported-element-type" />
  `)

  expect(() =>
    expect(queryByTestId('unsupported-element-type')).toBeRequired(),
  ).toThrowError()
})

test('handles an unsupported input type', () => {
  const {queryByTestId} = render(`
    <input type="image" readonly data-testid="unsupported-input-type" />
  `)

  expect(() =>
    expect(queryByTestId('unsupported-input-type')).toBeRequired(),
  ).toThrowError()
})
