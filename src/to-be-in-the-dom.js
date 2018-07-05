import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeInTheDOM(element, container) {
  if (element) {
    checkHtmlElement(element, toBeInTheDOM, this)
  }

  if (container) {
    checkHtmlElement(container, toBeInTheDOM, this)
  }

  return {
    pass: container ? container.contains(element) : !!element,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeInTheDOM`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(element ? element.cloneNode(false) : element)}`,
      ].join('\n')
    },
  }
}
