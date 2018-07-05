import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeEmpty(element) {
  checkHtmlElement(element, toBeEmpty, this)

  return {
    pass: element.innerHTML === '',
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEmpty`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(element.innerHTML)}`,
      ].join('\n')
    },
  }
}
