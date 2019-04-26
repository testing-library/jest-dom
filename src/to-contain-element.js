import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {getHtmlElement} from './utils'

export function toContainElement(container, element) {
  container = getHtmlElement(container, toContainElement, this)

  if (element !== null) {
    element = getHtmlElement(element, toContainElement, this)
  }

  return {
    pass: container.contains(element),
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toContainElement`,
          'element',
          'element',
        ),
        '',
        receivedColor(`${stringify(container.cloneNode(false))} ${
          this.isNot ? 'contains:' : 'does not contain:'
        } ${stringify(element ? element.cloneNode(false) : element)}
        `),
      ].join('\n')
    },
  }
}
