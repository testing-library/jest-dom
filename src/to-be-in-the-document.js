import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {getHtmlElement} from './utils'

export function toBeInTheDocument(element) {
  if (element !== null || !this.isNot) {
    element = getHtmlElement(element, toBeInTheDocument, this)
  }

  const pass =
    element === null ? false : element.ownerDocument.contains(element)

  return {
    pass,
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toBeInTheDocument`,
          'element',
          '',
        ),
        '',
        receivedColor(`${stringify(element.ownerDocument.cloneNode(false))} ${
          this.isNot ? 'contains:' : 'does not contain:'
        } ${stringify(element ? element.cloneNode(false) : element)}
        `),
      ].join('\n')
    },
  }
}
