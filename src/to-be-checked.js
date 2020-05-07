import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeChecked(element) {
  checkHtmlElement(element, toBeChecked, this)

  const isValidInput = () => {
    return (
      element.tagName.toLowerCase() === 'input' &&
      ['checkbox', 'radio'].includes(element.type)
    )
  }

  const isValidAriaElement = () => {
    return (
      ['checkbox', 'radio', 'switch'].includes(element.getAttribute('role')) &&
      ['true', 'false'].includes(element.getAttribute('aria-checked'))
    )
  }

  if (!isValidInput() && !isValidAriaElement()) {
    return {
      pass: false,
      message: () =>
        'only inputs with type="checkbox" or type="radio" or elements with role="checkbox", role="radio" or role="switch" and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead',
    }
  }

  const isChecked = () => {
    if (isValidInput()) return element.checked
    return element.getAttribute('aria-checked') === 'true'
  }

  return {
    pass: isChecked(),
    message: () => {
      const is = isChecked() ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'element', ''),
        '',
        `Received element ${is} checked:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
