import {matcherHint} from 'jest-matcher-utils'
import {matches, checkHtmlElement, getMessage} from './utils'

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

  const values = getValues(tagName, htmlElement)
  const expectedValues = getExpectedValues(expectedValue)
  const numberOfMatchesWithValues = getNumberOfMatchesBetweenArrays(
    values,
    expectedValues,
  )

  const matchedWithAllValues = numberOfMatchesWithValues === values.length
  const matchedWithAllExpectedValues =
    numberOfMatchesWithValues === expectedValues.length

  return {
    pass: matchedWithAllValues && matchedWithAllExpectedValues,
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
        values,
      ),
  }
}

function getValues(tagName, htmlElement) {
  return tagName === 'select'
    ? Array.from(htmlElement)
        .filter(option => option.selected)
        .map(option => option.textContent)
    : [htmlElement.value]
}

function getExpectedValues(expectedValue) {
  return expectedValue instanceof Array ? expectedValue : [expectedValue]
}

function getNumberOfMatchesBetweenArrays(arrayBase, array) {
  return array.filter(
    expected => arrayBase.filter(value => matches(value, expected)).length,
  ).length
}
