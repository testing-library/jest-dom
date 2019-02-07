import {render} from './helpers/test-utils'

test('.toBeEnabled', () => {
  const {queryByTestId} = render(`
    <div>
      <button disabled={true} data-testid="button-element">x</button>
      <textarea disabled={true} data-testid="textarea-element"></textarea>
      <input type="checkbox" disabled={true} data-testid="input-element" />

      <fieldset disabled={true} data-testid="fieldset-element">
        <button data-testid="fieldset-child-element">x</button>
      </fieldset>

      <div disabled={true} data-testid="div-element">
        <button data-testid="div-child-element">x</button>
      </div>

      <fieldset disabled={true}>
        <div>
          <button data-testid="nested-form-element">x</button>

          <select data-testid="deep-select-element">
            <optgroup data-testid="deep-optgroup-element">
              <option data-testid="deep-option-element">x</option>
            </optgroup>
          </select>
        </div>
      </fieldset>

      <a href="http://github.com" disabled={true} data-testid="a-element">x</a>
    </div>
    `)

  expect(() => {
    expect(queryByTestId('button-element')).toBeEnabled()
  }).toThrowError()
  expect(queryByTestId('button-element')).not.toBeEnabled()
  expect(() => {
    expect(queryByTestId('textarea-element')).toBeEnabled()
  }).toThrowError()
  expect(() => {
    expect(queryByTestId('input-element')).toBeEnabled()
  }).toThrowError()

  expect(() => {
    expect(queryByTestId('fieldset-element')).toBeEnabled()
  }).toThrowError()
  expect(() => {
    expect(queryByTestId('fieldset-child-element')).toBeEnabled()
  }).toThrowError()

  expect(queryByTestId('div-element')).toBeEnabled()
  expect(queryByTestId('div-child-element')).toBeEnabled()

  expect(() => {
    expect(queryByTestId('nested-form-element')).toBeEnabled()
  }).toThrowError()
  expect(() => {
    expect(queryByTestId('deep-select-element')).toBeEnabled()
  }).toThrowError()
  expect(() => {
    expect(queryByTestId('deep-optgroup-element')).toBeEnabled()
  }).toThrowError()
  expect(() => {
    expect(queryByTestId('deep-option-element')).toBeEnabled()
  }).toThrowError()

  expect(queryByTestId('a-element')).toBeEnabled()
  expect(() =>
    expect(queryByTestId('a-element')).not.toBeEnabled(),
  ).toThrowError()
})

test('.toBeEnabled fieldset>legend', () => {
  const {queryByTestId} = render(`
    <div>
      <fieldset disabled={true}>
        <button data-testid="inherited-element">x</button>
      </fieldset>

      <fieldset disabled={true}>
        <legend>
          <button data-testid="inside-legend-element">x</button>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <legend>
          <div>
            <button data-testid="nested-inside-legend-element">x</button>
          </div>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <div></div>
        <legend>
          <button data-testid="first-legend-element">x</button>
        </legend>
        <legend>
          <button data-testid="second-legend-element">x</button>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <fieldset>
          <legend>
            <button data-testid="outer-fieldset-element">x</button>
          </legend>
        </fieldset>
      </fieldset>
    </div>
    `)

  expect(() => {
    expect(queryByTestId('inherited-element')).toBeEnabled()
  }).toThrowError()
  expect(queryByTestId('inside-legend-element')).toBeEnabled()
  expect(queryByTestId('nested-inside-legend-element')).toBeEnabled()

  expect(queryByTestId('first-legend-element')).toBeEnabled()
  expect(() => {
    expect(queryByTestId('second-legend-element')).toBeEnabled()
  }).toThrowError()

  expect(() => {
    expect(queryByTestId('outer-fieldset-element')).toBeEnabled()
  }).toThrowError()
})
