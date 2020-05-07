import {matcherHint} from 'jest-matcher-utils'
import isEqualWith from 'lodash/isEqualWith'
import {
  checkHtmlElement,
  compareArraysAsSet,
  getMessage,
  getSingleElementValue,
  isInputElement,
} from './utils'

type ExpectedValue = string | number | string[] | null

export function toHaveValue<T>(this: T, _expectedValue?: ExpectedValue) {
  const context = (this as unknown) as jest.MatcherContext
  const htmlElement = arguments[0] as HTMLElement
  const expectedValue = arguments[1] as ExpectedValue
  checkHtmlElement(htmlElement, toHaveValue, context)

  if (
    isInputElement(htmlElement) &&
    ['checkbox', 'radio'].includes(htmlElement.type)
  ) {
    throw new Error(
      'input with type=checkbox or type=radio cannot be used with .toHaveValue(). Use .toBeChecked() for type=checkbox or .toHaveFormValues() instead',
    )
  }

  const receivedValue = getSingleElementValue(htmlElement)
  const expectsValue = expectedValue !== undefined

  let expectedTypedValue = expectedValue
  let receivedTypedValue = receivedValue
  if (expectedValue == receivedValue && expectedValue !== receivedValue) {
    expectedTypedValue = `${expectedValue} (${typeof expectedValue})`
    receivedTypedValue = `${receivedValue} (${typeof receivedValue})`
  }

  return {
    pass: expectsValue
      ? isEqualWith(receivedValue, expectedValue, compareArraysAsSet)
      : Boolean(receivedValue),
    message: () => {
      const to = context.isNot ? 'not to' : 'to'
      const matcher = matcherHint(
        `${context.isNot ? '.not' : ''}.toHaveValue`,
        'element',
        expectedValue as string,
      )
      return getMessage(
        matcher,
        `Expected the element ${to} have value`,
        expectsValue ? expectedTypedValue : '(any)',
        'Received',
        receivedTypedValue,
      )
    },
  }
}
