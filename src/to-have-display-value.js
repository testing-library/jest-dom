import {matcherHint} from 'jest-matcher-utils'
import {matches,checkHtmlElement, getMessage} from './utils'



export function toHaveDisplayValue(htmlElement, expectedValue) {
  checkHtmlElement(htmlElement, toHaveDisplayValue, this)
  const tagName = htmlElement.tagName.toLowerCase()

  if (!['select', 'input', 'textarea'].includes(tagName)) {
    throw new Error(
      '.toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead.',
    )
  }

  if (tagName === 'input' && ['radio', 'checkbox'].includes(htmlElement.type)) {
    throw new Error(
      `.toHaveDisplayValue() currently does not support input[type="${htmlElement.type}"], try with another matcher instead.`,
    )
  }

  const value =
    tagName === 'select'
      ? Array.from(htmlElement)
          .filter(option => option.selected)
          .map(option => option.textContent)
      : [htmlElement.value]

  const expectedValueArray = expectedValue instanceof Array ? expectedValue : [expectedValue]
  const matchess = expectedValueArray.filter(expected => value.filter(valueFilter => matches(valueFilter, expected)).length).length

  return {
    pass: matchess === value.length && matchess === expectedValueArray.length,
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
