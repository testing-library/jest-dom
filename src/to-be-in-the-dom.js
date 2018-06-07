import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeInTheDOM(received) {
  if (received) {
    checkHtmlElement(received, toBeInTheDOM, this)
  }
  return {
    pass: !!received,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeInTheDOM`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(received ? received.cloneNode(false) : received)}`,
      ].join('\n')
    },
  }
}
