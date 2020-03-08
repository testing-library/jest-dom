import {matcherHint} from 'jest-matcher-utils'
import isEqualWith from 'lodash/isEqualWith'
import {
  checkHtmlElement,
  compareArraysAsSet,
  getMessage,
  getSingleElementValue,
} from './utils'

/* eslint-disable valid-jsdoc */
/**
 * @description Check whether the given form element has the specified value. Accepts `<input>`, `<select>`, and `<textarea>` elements with the exception of `<input type="checkbox">` and `<input type="radiobox">`, which can be matched only using [toBeChecked](https:github.com/testing-library/jest-dom#tobechecked) or [toHaveFormValues](https:github.com/testing-library/jest-dom#tohaveformvalues).
 * @example
 *  <input
 *    type="number"
 *    value="5"
 *    data-testid="input-number" />
 *
 *  const numberInput = getByTestId('input-number')
 *  expect(numberInput).toHaveValue(5)
 * @see [github.com/testing-library/jest-dom#tohavevalue](https:github.com/testing-library/jest-dom#tohavevalue)
 */
/* eslint-enable valid-jsdoc */
export function toHaveValue(htmlElement, expectedValue) {
  checkHtmlElement(htmlElement, toHaveValue, this)

  if (
    htmlElement.tagName.toLowerCase() === 'input' &&
    ['checkbox', 'radio'].includes(htmlElement.type)
  ) {
    throw new Error(
      'input with type=checkbox or type=radio cannot be used with .toHaveValue(). Use .toBeChecked() for type=checkbox or .toHaveFormValues() instead',
    )
  }

  const receivedValue = getSingleElementValue(htmlElement)
  const expectsValue = expectedValue !== undefined
  return {
    pass: expectsValue
      ? isEqualWith(receivedValue, expectedValue, compareArraysAsSet)
      : Boolean(receivedValue),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveValue`,
        'element',
        expectedValue,
      )
      return getMessage(
        matcher,
        `Expected the element ${to} have value`,
        expectsValue ? expectedValue : '(any)',
        'Received',
        receivedValue,
      )
    },
  }
}
