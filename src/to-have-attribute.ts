import {matcherHint, stringify, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function printAttribute(name: string, value: string | undefined | null) {
  return value === undefined ? name : `${name}=${stringify(value)}`
}

function getAttributeComment(name: string, value: string | undefined) {
  return value === undefined
    ? `element.hasAttribute(${stringify(name)})`
    : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`
}

export function toHaveAttribute<T>(
  this: T,
  _name: string,
  _expectedValue?: string,
) {
  const context = (this as unknown) as jest.MatcherContext
  const htmlElement = arguments[0] as HTMLElement
  const name = arguments[1] as string
  const expectedValue = arguments[2] as string

  checkHtmlElement(htmlElement, toHaveAttribute, this)
  const isExpectedValuePresent = expectedValue !== undefined
  const hasAttribute = htmlElement.hasAttribute(name)
  const receivedValue = htmlElement.getAttribute(name)
  return {
    pass: isExpectedValuePresent
      ? hasAttribute && context.equals(receivedValue, expectedValue)
      : hasAttribute,
    message: () => {
      const to = context.isNot ? 'not to' : 'to'
      const receivedAttribute = hasAttribute
        ? printAttribute(name, receivedValue)
        : null
      const matcher = matcherHint(
        `${context.isNot ? '.not' : ''}.toHaveAttribute`,
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
