import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, checkDisabledElement} from './utils'

export function toBeDisabled(element) {
  checkHtmlElement(element, toBeDisabled, this)

  const isDisabled = checkDisabledElement(element)

  return {
    pass: isDisabled,
    message: () => {
      const is = isDisabled ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeDisabled`, 'element', ''),
        '',
        `Received element ${is} disabled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
