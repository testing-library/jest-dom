import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

export function toBeInTheDOM(received) {
  if (received) {
    checkHtmlElement(received)
  }
  return {
    pass: !!received,
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(`${this.isNot ? '.not' : ''}.toBeInTheDOM`, 'element', ''),
        'Expected',
        `element ${to} be present`,
        'Received',
        received,
      )
    },
  }
}
