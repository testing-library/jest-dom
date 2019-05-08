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
