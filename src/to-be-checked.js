import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getSingleElementValue} from './utils'

export function toBeChecked(element) {
  checkHtmlElement(element, toBeChecked, this)

  if (
    element.tagName.toLowerCase() !== 'input' ||
    element.type !== 'checkbox'
  ) {
    return {
      pass: false,
      message: () =>
        'only inputs with type=checkbox can be used with .toBeChecked(). Use .toHaveFormValues() instead',
    }
  }

  const isChecked = getSingleElementValue(element)

  return {
    pass: isChecked,
    message: () => {
      const is = isChecked ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'element', ''),
        '',
        `Received element ${is} checked:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
