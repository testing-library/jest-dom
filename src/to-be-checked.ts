import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, isInputElement} from './utils'

export function toBeChecked<C>(this: C) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeChecked, this)

  const isValidInput = () => {
    return (
      isInputElement(element) && ['checkbox', 'radio'].includes(element.type)
    )
  }

  const isValidAriaElement = () => {
    return (
      ['checkbox', 'radio', 'switch'].includes(element.getAttribute('role')!) &&
      ['true', 'false'].includes(element.getAttribute('aria-checked')!)
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
    if (isValidInput()) return (element as HTMLInputElement).checked
    return element.getAttribute('aria-checked') === 'true'
  }

  return {
    pass: isChecked(),
    message: () => {
      const is = isChecked() ? 'is' : 'is not'
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeChecked`,
          'element',
          '',
        ),
        '',
        `Received element ${is} checked:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
