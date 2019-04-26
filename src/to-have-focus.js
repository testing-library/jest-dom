import {matcherHint, printReceived, printExpected} from 'jest-matcher-utils'
import {getHtmlElement} from './utils'

export function toHaveFocus(element) {
  element = getHtmlElement(element, toHaveFocus, this)

  return {
    pass: element.ownerDocument.activeElement === element,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toHaveFocus`, 'element', ''),
        '',
        'Expected',
        `  ${printExpected(element)}`,
        'Received:',
        `  ${printReceived(element.ownerDocument.activeElement)}`,
      ].join('\n')
    },
  }
}
