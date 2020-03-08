import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

/* eslint-disable valid-jsdoc */
/**
 * @description Assert whether a string representing a HTML element is contained in another element.
 * @example
 *  <span data-testid="parent">
 *    <span data-testid="child"></span>
 *  </span>
 *
 *  const parent = getByTestId('parent')
 *  expect(parent).toContainerHTML(<span data-testid="child"></span>)
 * @see [github.com/testing-library/jest-dom#tocontainhtml](https:github.com/testing-library/jest-dom#tocontainhtml)
 */
/* eslint-enable valid-jsdoc */
export function toContainHTML(container, htmlText) {
  checkHtmlElement(container, toContainHTML, this)

  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainHTML`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(container.cloneNode(true))}`,
      ].join('\n')
    },
  }
}
