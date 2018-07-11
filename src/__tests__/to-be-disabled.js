import {render} from './helpers/test-utils'

test('.toBeDisabled', () => {
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

  expect(queryByTestId('button-element')).toBeDisabled()
  expect(() =>
    expect(queryByTestId('button-element')).not.toBeDisabled(),
  ).toThrowError()
  expect(queryByTestId('textarea-element')).toBeDisabled()
  expect(queryByTestId('input-element')).toBeDisabled()

  expect(queryByTestId('fieldset-element')).toBeDisabled()
  expect(queryByTestId('fieldset-child-element')).toBeDisabled()

  expect(queryByTestId('div-element')).not.toBeDisabled()
  expect(queryByTestId('div-child-element')).not.toBeDisabled()

  expect(queryByTestId('nested-form-element')).toBeDisabled()
  expect(queryByTestId('deep-select-element')).toBeDisabled()
  expect(queryByTestId('deep-optgroup-element')).toBeDisabled()
  expect(queryByTestId('deep-option-element')).toBeDisabled()

  expect(queryByTestId('a-element')).not.toBeDisabled()
  expect(() => expect(queryByTestId('a-element')).toBeDisabled()).toThrowError()
})

test('.toBeDisabled fieldset>legend', () => {
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

  expect(queryByTestId('inherited-element')).toBeDisabled()
  expect(queryByTestId('inside-legend-element')).not.toBeDisabled()
  expect(queryByTestId('nested-inside-legend-element')).not.toBeDisabled()

  expect(queryByTestId('first-legend-element')).not.toBeDisabled()
  expect(queryByTestId('second-legend-element')).toBeDisabled()

  expect(queryByTestId('outer-fieldset-element')).toBeDisabled()
})
