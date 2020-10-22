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

  expect(() =>
    expect(queryByTestId('div-element')).not.toBeDisabled(),
  ).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
  expect(queryByTestId('div-child-element')).not.toBeDisabled()

  expect(queryByTestId('nested-form-element')).toBeDisabled()
  expect(queryByTestId('deep-select-element')).toBeDisabled()
  expect(queryByTestId('deep-optgroup-element')).toBeDisabled()
  expect(queryByTestId('deep-option-element')).toBeDisabled()

  expect(() => expect(queryByTestId('a-element')).toBeDisabled()).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
  expect(() =>
    expect(queryByTestId('deep-a-element')).toBeDisabled(),
  ).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
})

const roles = [
  'checkbox',
  'radio',
  'switch',
  'button',
  'combobox',
  'select',
  'option',
  'textbox',
  'input',
]

describe('.toBeDisabled on element with ARIA role', () => {
  test('handles element with supported role', () => {
    roles.forEach(role => {
      const {queryByTestId} = render(`
          <div role="${role}" aria-disabled="true" data-testid="aria-${role}-disabled"></div>
          <div role="${role}" aria-disabled="false" data-testid="aria-${role}-enabled"></div>
      `)
      expect(queryByTestId(`aria-${role}-disabled`)).toBeDisabled()
      expect(queryByTestId(`aria-${role}-enabled`)).not.toBeDisabled()
    })
  })

  test('throws when element with supported role is disabled but expected not to be', () => {
    roles.forEach(role => {
      const {queryByTestId} = render(`
          <div role="${role}" aria-disabled="true" data-testid="aria-${role}-disabled"></div>
      `)
      expect(() =>
        expect(queryByTestId(`aria-${role}-disabled`)).not.toBeDisabled(),
      ).toThrowError()
    })
  })

  test('throws when element with supported role is not disabled but expected to be', () => {
    roles.forEach(role => {
      const {queryByTestId} = render(`
          <div role="${role}" aria-disabled="false" data-testid="aria-${role}-enabled"></div>
      `)
      expect(() =>
        expect(queryByTestId(`aria-${role}-enabled`)).toBeDisabled(),
      ).toThrowError()
    })
  })

  test('handles inheritance of the disabled state from a parent with supported role', () => {
    const {queryByTestId} = render(`
      <div>
        <fieldset disabled={true} data-testid="fieldset-element">
          <div role="button" data-testid="fieldset-child-element">x</div>
        </fieldset>

        <div role="select" aria-disabled="true" data-testid="div-element">
          <div role="option" data-testid="div-child-element">x</div>
        </div>

        <div role="select" aria-disabled="false" data-testid="div-element-enabled">
          <div role="option" data-testid="div-child-element-enabled">x</div>
        </div>

        <div role="group" aria-disabled="true">
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

        <a href="http://github.com" aria-disabled="true" data-testid="a-element">x</a>
      </div>
      `)

    expect(queryByTestId('fieldset-element')).toBeDisabled()
    expect(queryByTestId('fieldset-child-element')).toBeDisabled()
    expect(queryByTestId('div-element')).toBeDisabled()
    expect(queryByTestId('div-child-element')).toBeDisabled()
    expect(queryByTestId('div-element-enabled')).not.toBeDisabled()
    expect(queryByTestId('div-child-element-enabled')).not.toBeDisabled()
    expect(queryByTestId('nested-form-element')).toBeDisabled()
    expect(queryByTestId('deep-select-element')).toBeDisabled()
    expect(queryByTestId('deep-optgroup-element')).toBeDisabled()
    expect(queryByTestId('deep-option-element')).toBeDisabled()

    expect(() =>
      expect(queryByTestId('a-element')).toBeDisabled(),
    ).toThrowError(
      /only focusable form elements or elements with role=.* can be used/,
    )
    expect(() =>
      expect(queryByTestId('deep-a-element')).toBeDisabled(),
    ).toThrowError(
      /only focusable form elements or elements with role=.* can be used/,
    )
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

  expect(() => expect(queryByTestId('div-element')).toBeEnabled()).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
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

  expect(() => expect(queryByTestId('a-element')).toBeEnabled()).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
  expect(() =>
    expect(queryByTestId('a-element')).not.toBeEnabled(),
  ).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )

  expect(() =>
    expect(queryByTestId('deep-a-element')).toBeEnabled(),
  ).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
  expect(() =>
    expect(queryByTestId('deep-a-element')).not.toBeEnabled(),
  ).toThrowError(
    /only focusable form elements or elements with role=.* can be used/,
  )
})

describe('.toBeEnabled on element with ARIA role', () => {
  test('handles element with supported role', () => {
    roles.forEach(role => {
      const {queryByTestId} = render(`
          <div role="${role}" aria-disabled="true" data-testid="aria-${role}-disabled"></div>
          <div role="${role}" aria-disabled="false" data-testid="aria-${role}-enabled"></div>
      `)
      expect(queryByTestId(`aria-${role}-disabled`)).not.toBeEnabled()
      expect(queryByTestId(`aria-${role}-enabled`)).toBeEnabled()
    })
  })

  test('throws when element with supported role is enabled but expected not to be', () => {
    roles.forEach(role => {
      const {queryByTestId} = render(`
          <div role="${role}" aria-disabled="false" data-testid="aria-${role}-enabled"></div>
      `)
      expect(() =>
        expect(queryByTestId(`aria-${role}-enabled`)).not.toBeEnabled(),
      ).toThrowError()
    })
  })

  test('throws when element with supported role is not enabled but expected to be', () => {
    roles.forEach(role => {
      const {queryByTestId} = render(`
          <div role="${role}" aria-disabled="true" data-testid="aria-${role}-disabled"></div>
      `)
      expect(() =>
        expect(queryByTestId(`aria-${role}-disabled`)).toBeEnabled(),
      ).toThrowError()
    })
  })

  test('handles inheritance of the disabled state from a parent with supported role', () => {
    const {queryByTestId} = render(`
      <div>
        <fieldset disabled={true} data-testid="fieldset-element">
          <div role="button" data-testid="fieldset-child-element">x</div>
        </fieldset>

        <div role="select" aria-disabled="true" data-testid="div-element">
          <div role="option" data-testid="div-child-element">x</div>
        </div>

        <div role="select" aria-disabled="false" data-testid="div-element-enabled">
          <div role="option" data-testid="div-child-element-enabled">x</div>
        </div>

        <div role="group" aria-disabled="true">
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

        <a href="http://github.com" aria-disabled="true" data-testid="a-element">x</a>
      </div>
      `)

    expect(queryByTestId('fieldset-element')).not.toBeEnabled()
    expect(queryByTestId('fieldset-child-element')).not.toBeEnabled()
    expect(queryByTestId('div-element')).not.toBeEnabled()
    expect(queryByTestId('div-child-element')).not.toBeEnabled()
    expect(queryByTestId('div-element-enabled')).toBeEnabled()
    expect(queryByTestId('div-child-element-enabled')).toBeEnabled()
    expect(queryByTestId('nested-form-element')).not.toBeEnabled()
    expect(queryByTestId('deep-select-element')).not.toBeEnabled()
    expect(queryByTestId('deep-optgroup-element')).not.toBeEnabled()
    expect(queryByTestId('deep-option-element')).not.toBeEnabled()

    expect(() => expect(queryByTestId('a-element')).toBeEnabled()).toThrowError(
      /only focusable form elements or elements with role=.* can be used/,
    )
    expect(() =>
      expect(queryByTestId('deep-a-element')).toBeEnabled(),
    ).toThrowError(
      /only focusable form elements or elements with role=.* can be used/,
    )
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
