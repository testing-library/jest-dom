import {matcherHint, stringify, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function printAttribute(name, value) {
  return value === undefined ? name : `${name}=${stringify(value)}`
}

function getAttributeComment(name, value) {
  return value === undefined
    ? `element.hasAttribute(${stringify(name)})`
    : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`
}

/* eslint-disable valid-jsdoc */
/**
 * @description Allows you to check if a given element has an attribute or not. You can also optionally check that the attribute has a specific expected value or partial match using [expect.stringContaining](https://jestjs.io/docs/en/expect.html#expectnotstringcontainingstring)/[expect.stringMatching](https://jestjs.io/docs/en/expect.html#expectstringmatchingstring-regexp).
 * @example
 *  <button
 *    data-testid="ok-button"
 *    type="submit"
 *    disabled
 *  >
 *    ok
 *  </button>
 *
 *  expect(button).toHaveAttribute('disabled')
 *  expect(button).toHaveAttribute('type', 'submit')
 *  expect(button).not.toHaveAttribute('type', 'button')
 * @see [github.com/testing-library/jest-dom#tohaveattribute](https:github.com/testing-library/jest-dom#tohaveattribute)
 */
/* eslint-enable valid-jsdoc */
export function toHaveAttribute(htmlElement, name, expectedValue) {
  checkHtmlElement(htmlElement, toHaveAttribute, this)
  const isExpectedValuePresent = expectedValue !== undefined
  const hasAttribute = htmlElement.hasAttribute(name)
  const receivedValue = htmlElement.getAttribute(name)
  return {
    pass: isExpectedValuePresent
      ? hasAttribute && this.equals(receivedValue, expectedValue)
      : hasAttribute,
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const receivedAttribute = hasAttribute
        ? printAttribute(name, receivedValue)
        : null
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveAttribute`,
        'element',
        printExpected(name),
        {
          secondArgument: isExpectedValuePresent
            ? printExpected(expectedValue)
            : undefined,
          comment: getAttributeComment(name, expectedValue),
        },
      )
      return getMessage(
        matcher,
        `Expected the element ${to} have attribute`,
        printAttribute(name, expectedValue),
        'Received',
        receivedAttribute,
      )
    },
  }
}
