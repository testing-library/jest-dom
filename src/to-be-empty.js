import {matcherHint, printReceived} from 'jest-matcher-utils'
import {getHtmlElement} from './utils'

export function toBeEmpty(element) {
  element = getHtmlElement(element, toBeEmpty, this)

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
