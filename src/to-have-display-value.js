import {matcherHint} from 'jest-matcher-utils'

import {checkHtmlElement, getMessage} from './utils'

export function toHaveDisplayValue(htmlElement, expectedValue) {
  checkHtmlElement(htmlElement, toHaveDisplayValue, this)

  if (htmlElement.tagName.toLowerCase() !== 'select') {
    throw new Error(
      '.toHaveDisplayValue() currently supports select elements only, try to use .toHaveValue() or toBeChecked() instead.',
    )
  }

  const value = Array.from(htmlElement)
    .filter(option => option.selected)
    .map(option => option.textContent)
    .toString()

  return {
    pass: value === expectedValue.toString(),
    message: () =>
      getMessage(
        matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveDisplayValue`,
          'element',
          '',
        ),
        `Expected element ${this.isNot ? 'not ' : ''}to have display value`,
        expectedValue,
        'Received',
        value,
      ),
  }
}
