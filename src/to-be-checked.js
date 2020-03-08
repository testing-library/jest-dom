import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

/* eslint-disable valid-jsdoc */
/**
 * @description Assert whether the given element is checked. it accepts an `input` of type `checkbox` or `radio` and elements with a `role` of `radio` with a valid `aria-checked` attribute of "true" or "false".
 * @example
 *  <input
 *    type="checkbox"
 *    checked
 *    data-testid="input-checkbox" />
 *  <input
 *    type="radio"
 *    value="foo"
 *    data-testid="input-radio" />
 *
 *  const inputCheckbox = getByTestId('input-checkbox')
 *  const inputRadio = getByTestId('input-radio')
 *  expect(inputCheckbox).toBeChecked()
 *  expect(inputRadio).not.toBeChecked()
 * @see [github.com/testing-library/jest-dom#tobechecked](https:github.com/testing-library/jest-dom#tobechecked)
 */
/* eslint-enable valid-jsdoc */
export function toBeChecked(element) {
  checkHtmlElement(element, toBeChecked, this)

  const isValidInput = () => {
    return (
      element.tagName.toLowerCase() === 'input' &&
      ['checkbox', 'radio'].includes(element.type)
    )
  }

  const isValidAriaElement = () => {
    return (
      ['checkbox', 'radio'].includes(element.getAttribute('role')) &&
      ['true', 'false'].includes(element.getAttribute('aria-checked'))
    )
  }

  if (!isValidInput() && !isValidAriaElement()) {
    return {
      pass: false,
      message: () =>
        'only inputs with type="checkbox" or type="radio" or elements with role="checkbox" or role="radio" and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead',
    }
  }

  const isChecked = () => {
    if (isValidInput()) return element.checked
    return element.getAttribute('aria-checked') === 'true'
  }

  return {
    pass: isChecked(),
    message: () => {
      const is = isChecked() ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'element', ''),
        '',
        `Received element ${is} checked:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
