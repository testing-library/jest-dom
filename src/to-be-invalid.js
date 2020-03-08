import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

const FORM_TAGS = ['form', 'input', 'select', 'textarea']

function isElementHavingAriaInvalid(element) {
  return (
    element.hasAttribute('aria-invalid') &&
    element.getAttribute('aria-invalid') !== 'false'
  )
}

function isElementInvalid(element) {
  return !element.checkValidity()
}

/* eslint-disable valid-jsdoc */
/**
 * @description check if a form element, or the entire `form`, is currently invalid.
 *
 * An `input`, `select`, `textarea`, or `form` element is invalid if it has an `aria-invalid` attribute with no value or a value of "true", or if the result of `checkValidity()` is false.
 * @example
 *  <input data-testid="no-aria-invalid" />
 *
 *  <form data-testid="invalid-form">
 *    <input required />
 *  </form>
 *
 * expect(getByTestId('no-aria-invalid')).not.toBeInvalid()
 * expect(getByTestId('invalid-form')).toBeInvalid()
 * @see [github.com/testing-library/jest-dom#tobeinvalid](https:github.com/testing-library/jest-dom#tobeinvalid)
 */
/* eslint-enable valid-jsdoc */
export function toBeInvalid(element) {
  checkHtmlElement(element, toBeInvalid, this)

  const isInvalid =
    isElementHavingAriaInvalid(element) || isElementInvalid(element)

  return {
    pass: isInvalid,
    message: () => {
      const is = isInvalid ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeInvalid`, 'element', ''),
        '',
        `Received element ${is} currently invalid:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

/* eslint-disable valid-jsdoc */
/**
 * @description Allows you to check if a form element is currently required.
 *
 * An `input`, `select`, `textarea`, or `form` element is invalid if it has an `aria-invalid` attribute with no value or a value of "false", or if the result of `checkValidity()` is true.
 * @example
 *  <input data-testid="aria-invalid" aria-invalid />
 *
 *  <form data-testid="valid-form">
 *    <input />
 *  </form>
 *
 * expect(getByTestId('no-aria-invalid')).not.toBeValid()
 * expect(getByTestId('invalid-form')).toBeInvalid()
 * @see [github.com/testing-library/jest-dom#tobevalid](https:github.com/testing-library/jest-dom#tobevalid)
 */
/* eslint-enable valid-jsdoc */
export function toBeValid(element) {
  checkHtmlElement(element, toBeValid, this)

  const isValid =
    !isElementHavingAriaInvalid(element) &&
    FORM_TAGS.includes(getTag(element)) &&
    !isElementInvalid(element)

  return {
    pass: isValid,
    message: () => {
      const is = isValid ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeValid`, 'element', ''),
        '',
        `Received element ${is} currently valid:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
