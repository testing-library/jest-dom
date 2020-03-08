import {matcherHint, printReceived, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

/* eslint-disable valid-jsdoc */
/**
 * @description Assert whether an element has focus or not.
 * @example
 *  <div>
 *    <input type="text" data-testid="element-to-focus" />
 *  </div>
 *
 *  const input = getByTestId('element-to-focus')
 *  input.focus()
 *  expect(input).toHaveFocus()
 *  input.blur()
 *  expect(input).not.toHaveFocus()
 * @see [github.com/testing-library/jest-dom#tohavefocus](https:github.com/testing-library/jest-dom#tohavefocus)
 */
/* eslint-enable valid-jsdoc */
export function toHaveFocus(element) {
  checkHtmlElement(element, toHaveFocus, this)

  return {
    pass: element.ownerDocument.activeElement === element,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toHaveFocus`, 'element', ''),
        '',
        'Expected',
        `  ${printExpected(element)}`,
        'Received:',
        `  ${printReceived(element.ownerDocument.activeElement)}`,
      ].join('\n')
    },
  }
}
