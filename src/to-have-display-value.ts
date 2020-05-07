import {matcherHint} from 'jest-matcher-utils'

import {
  checkHtmlElement,
  getMessage,
  isInputElement,
  isSelectElement,
} from './utils'

export function toHaveDisplayValue<T>(
  this: T,
  _expectedValue: string | string[],
) {
  const context = (this as unknown) as jest.MatcherContext
  const htmlElement = arguments[0] as HTMLElement
  const expectedValue = arguments[1] as string

  checkHtmlElement(htmlElement, toHaveDisplayValue, this)
  const tagName = htmlElement.tagName.toLowerCase()

  if (!['select', 'input', 'textarea'].includes(tagName)) {
    throw new Error(
      '.toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead.',
    )
  }

  if (
    isInputElement(htmlElement) &&
    ['radio', 'checkbox'].includes(htmlElement.type)
  ) {
    throw new Error(
      `.toHaveDisplayValue() currently does not support input[type="${htmlElement.type}"], try with another matcher instead.`,
    )
  }

  const value = isSelectElement(htmlElement)
    ? Array.from(htmlElement)
        .filter(option => (option as HTMLOptionElement).selected)
        .map(option => option.textContent)
        .toString()
    : (htmlElement as {value?: string}).value

  return {
    pass: value === expectedValue.toString(),
    message: () =>
      getMessage(
        matcherHint(
          `${context.isNot ? '.not' : ''}.toHaveDisplayValue`,
          'element',
          '',
        ),
        `Expected element ${context.isNot ? 'not ' : ''}to have display value`,
        expectedValue,
        'Received',
        value,
      ),
  }
}
