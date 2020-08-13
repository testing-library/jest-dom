import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeEmptyDOMElement(element) {
  checkHtmlElement(element, toBeEmptyDOMElement, this)

  return {
    pass: element.innerHTML === '',
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toBeEmptyDOMElement`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${printReceived(element.innerHTML)}`,
      ].join('\n')
    },
  }
}
