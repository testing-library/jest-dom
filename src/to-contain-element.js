import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toContainElement(container, element) {
  checkHtmlElement(container, toContainElement, this)
  checkHtmlElement(element, toContainElement, this)

  return {
    pass: container.contains(element),
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toContainElement`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${printReceived(container.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
