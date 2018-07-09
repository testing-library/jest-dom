import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toHaveFocus(element) {
  checkHtmlElement(element, toHaveFocus, this)

  return {
    pass: document.activeElement === element,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toHaveFocus`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(document.activeElement)}`,
      ].join('\n')
    },
  }
}
