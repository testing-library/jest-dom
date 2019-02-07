import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, checkDisabledElement} from './utils'

export function toBeEnabled(element) {
  checkHtmlElement(element, toBeEnabled, this)

  const isEnabled = !checkDisabledElement(element)

  return {
    pass: isEnabled,
    message: () => {
      const is = isEnabled ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEnabled`, 'element', ''),
        '',
        `Received element ${is} enabled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
