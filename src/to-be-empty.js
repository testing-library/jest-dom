import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

/* eslint-disable valid-jsdoc */
/**
 * @description Assert whether an element has content or not.
 * @example
 *  <span data-testid="not-empty">
 *    <span data-testid="empty"></span>
 *  </span>
 *
 * expect(getByTestId('empty')).toBeEmpty()
 * expect(getByTestId('not-empty')).not.toBeEmpty()
 * @see [github.com/testing-library/jest-dom#tobeempty](https:github.com/testing-library/jest-dom#tobeempty)
 */
/* eslint-enable valid-jsdoc */
export function toBeEmpty(element) {
  checkHtmlElement(element, toBeEmpty, this)

  return {
    pass: element.innerHTML === '',
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEmpty`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(element.innerHTML)}`,
      ].join('\n')
    },
  }
}
