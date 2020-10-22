import {render} from './helpers/test-utils'

describe('.toBeDisabled', () => {
  test('handles element with disabled attribute and element with disabled parent', () => {
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
          <a href="http://github.com" data-testid="deep-a-element">x</a>
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
    expect(queryByTestId('deep-a-element')).not.toBeDisabled()
    expect(() =>
      expect(queryByTestId('a-element')).toBeDisabled(),
    ).toThrowError()
    expect(() =>
      expect(queryByTestId('deep-a-element')).toBeDisabled(),
    ).toThrowError()
  })

  test('handles element with aria-disabled attribute', () => {
    const {queryByTestId} = render(`
      <div aria-disabled="true" data-testid="aria-div-disabled"></div>
      <div aria-disabled="false" data-testid="aria-div-enabled"></div>
    `)
    expect(queryByTestId(`aria-div-disabled`)).toBeDisabled()
    expect(queryByTestId(`aria-div-enabled`)).not.toBeDisabled()
  })

  test('throws when element with aria-disabled attribute is disabled but expected not to be', () => {
    const {queryByTestId} = render(`
      <div aria-disabled="true" data-testid="aria-div-disabled"></div>
    `)
    expect(() =>
      expect(queryByTestId(`aria-div-disabled`)).not.toBeDisabled(),
    ).toThrowError()
  })

  test('throws when element with aria-disabled role is not disabled but expected to be', () => {
    const {queryByTestId} = render(`
        <div aria-disabled="false" data-testid="aria-div-enabled"></div>
    `)
    expect(() =>
      expect(queryByTestId(`aria-div-enabled`)).toBeDisabled(),
    ).toThrowError()
  })

  test('handles inheritance of the disabled state from a parent with aria-disabled attribute', () => {
    const {queryByTestId} = render(`
      <div>
        <fieldset aria-disabled="true" data-testid="fieldset-element">
          <button data-testid="fieldset-child-element">x</button>
        </fieldset>

        <div aria-disabled="true" data-testid="div-element">
          <button data-testid="div-child-element">x</button>
        </div>

        <div aria-disabled="false" data-testid="div-enabled-element">
          <button data-testid="div-enabled-child-element">x</button>
        </div>

        <div aria-disabled="true" data-testid="div-element-2">
          <div data-testid="non-focusable-child-element">x</button>
        </div>

        <div aria-disabled="true">
          <div>
            <button data-testid="nested-form-element">x</button>

            <select data-testid="deep-select-element">
              <optgroup data-testid="deep-optgroup-element">
                <option data-testid="deep-option-element">x</option>
              </optgroup>
            </select>
          </div>
          <a href="http://github.com" data-testid="deep-a-element">x</a>
        </div>

        <a href="http://github.com" disabled={true} data-testid="a-element">x</a>
      </div>
      `)

    expect(queryByTestId('fieldset-element')).not.toBeDisabled()
    expect(queryByTestId('fieldset-child-element')).not.toBeDisabled()
    expect(queryByTestId('div-element')).toBeDisabled()
    expect(queryByTestId('div-child-element')).toBeDisabled()
    expect(queryByTestId('div-enabled-element')).not.toBeDisabled()
    expect(queryByTestId('div-enabled-child-element')).not.toBeDisabled()
    expect(queryByTestId('div-element-2')).toBeDisabled()
    expect(queryByTestId('non-focusable-child-element')).not.toBeDisabled()
    expect(queryByTestId('nested-form-element')).toBeDisabled()
    expect(queryByTestId('deep-select-element')).toBeDisabled()
    expect(queryByTestId('deep-optgroup-element')).toBeDisabled()
    expect(queryByTestId('deep-option-element')).toBeDisabled()

    expect(queryByTestId('a-element')).not.toBeDisabled()
    expect(queryByTestId('deep-a-element')).not.toBeDisabled()
    expect(() =>
      expect(queryByTestId('a-element')).toBeDisabled(),
    ).toThrowError()
    expect(() =>
      expect(queryByTestId('deep-a-element')).toBeDisabled(),
    ).toThrowError()
  })
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

describe('.toBeEnabled', () => {
  test('handles element with disabled attribute and element with disabled parent', () => {
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
          <a href="http://github.com" data-testid="deep-a-element">x</a>
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
    expect(queryByTestId('deep-a-element')).toBeEnabled()
    expect(() =>
      expect(queryByTestId('deep-a-element')).not.toBeEnabled(),
    ).toThrowError()
  })

  test('handles element with aria-disabled attribute', () => {
    const {queryByTestId} = render(`
      <div aria-disabled="true" data-testid="aria-div-disabled"></div>
      <div aria-disabled="false" data-testid="aria-div-enabled"></div>
    `)
    expect(queryByTestId(`aria-div-disabled`)).not.toBeEnabled()
    expect(queryByTestId(`aria-div-enabled`)).toBeEnabled()
  })

  test('throws when element with aria-disabled attribute is enabled but expected not to be', () => {
    const {queryByTestId} = render(`
      <div aria-disabled="false" data-testid="aria-div-enabled"></div>
    `)
    expect(() =>
      expect(queryByTestId(`aria-div-enabled`)).not.toBeEnabled(),
    ).toThrowError()
  })

  test('throws when element with aria-disabled role is not enabled but expected to be', () => {
    const {queryByTestId} = render(`
        <div aria-disabled="true" data-testid="aria-div-disabled"></div>
    `)
    expect(() =>
      expect(queryByTestId(`aria-div-disabled`)).toBeEnabled(),
    ).toThrowError()
  })

  test('handles inheritance of the disabled state from a parent with aria-disabled attribute', () => {
    const {queryByTestId} = render(`
      <div>
        <fieldset aria-disabled="true" data-testid="fieldset-element">
          <button data-testid="fieldset-child-element">x</button>
        </fieldset>

        <div aria-disabled="true" data-testid="div-element">
          <button data-testid="div-child-element">x</button>
        </div>

        <div aria-disabled="false" data-testid="div-enabled-element">
          <button data-testid="div-enabled-child-element">x</button>
        </div>

        <div aria-disabled="true" data-testid="div-element-2">
          <div data-testid="non-focusable-child-element">x</button>
        </div>

        <div aria-disabled="true">
          <div>
            <button data-testid="nested-form-element">x</button>

            <select data-testid="deep-select-element">
              <optgroup data-testid="deep-optgroup-element">
                <option data-testid="deep-option-element">x</option>
              </optgroup>
            </select>
          </div>
          <a href="http://github.com" data-testid="deep-a-element">x</a>
        </div>

        <a href="http://github.com" disabled={true} data-testid="a-element">x</a>
      </div>
      `)

    expect(queryByTestId('fieldset-element')).toBeEnabled()
    expect(queryByTestId('fieldset-child-element')).toBeEnabled()
    expect(queryByTestId('div-element')).not.toBeEnabled()
    expect(queryByTestId('div-child-element')).not.toBeEnabled()
    expect(queryByTestId('div-enabled-element')).toBeEnabled()
    expect(queryByTestId('div-enabled-child-element')).toBeEnabled()
    expect(queryByTestId('div-element-2')).not.toBeEnabled()
    expect(queryByTestId('non-focusable-child-element')).toBeEnabled()
    expect(queryByTestId('nested-form-element')).not.toBeEnabled()
    expect(queryByTestId('deep-select-element')).not.toBeEnabled()
    expect(queryByTestId('deep-optgroup-element')).not.toBeEnabled()
    expect(queryByTestId('deep-option-element')).not.toBeEnabled()

    expect(queryByTestId('a-element')).toBeEnabled()
    expect(queryByTestId('deep-a-element')).toBeEnabled()
    expect(() =>
      expect(queryByTestId('a-element')).not.toBeEnabled(),
    ).toThrowError()
    expect(() =>
      expect(queryByTestId('deep-a-element')).not.toBeEnabled(),
    ).toThrowError()
  })
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
