import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeInTheDocument(element) {
  if (element !== null || !this.isNot) {
    checkHtmlElement(element, toBeInTheDocument, this)
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
        } ${stringify(element.cloneNode(false))}
        `),
      ].join('\n')
    },
  }
}
