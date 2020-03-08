import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

/* eslint-disable valid-jsdoc */
/**
 * @description Allows you to assert whether an element contains another element as a descendant or not.
 * @example
 *  <span data-testid="ancestor">
 *    <span data-testid="descendant"></span>
 *  </span>
 *
 *  const ancestor = getByTestId('ancestor')
 *  const descendant = getByTestId('descendant')
 *  const nonExistantElement = getByTestId('does-not-exist')
 *  expect(ancestor).toContainElement(descendant)
 *  expect(descendant).not.toContainElement(ancestor)
 *  expect(ancestor).not.toContainElement(nonExistantElement)
 * @see [github.com/testing-library/jest-dom#tocontainelement](https:github.com/testing-library/jest-dom#tocontainelement)
 */
/* eslint-enable valid-jsdoc */
export function toContainElement(container, element) {
  checkHtmlElement(container, toContainElement, this)

  if (element !== null) {
    checkHtmlElement(element, toContainElement, this)
  }

  return {
    pass: container.contains(element),
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toContainElement`,
          'element',
          'element',
        ),
        '',
        receivedColor(`${stringify(container.cloneNode(false))} ${
          this.isNot ? 'contains:' : 'does not contain:'
        } ${stringify(element ? element.cloneNode(false) : element)}
        `),
      ].join('\n')
    },
  }
}
