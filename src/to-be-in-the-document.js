import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {checkHtmlElement, checkDocumentKey} from './utils'

export function toBeInTheDocument(element) {
  if (element !== null) {
    checkHtmlElement(element, toBeInTheDocument, this)
  }

  checkDocumentKey(global.document, 'documentElement', toBeInTheDocument)

  return {
    pass: document.documentElement.contains(element),
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toBeInTheDocument`,
          'element',
          '',
        ),
        '',
        receivedColor(`${stringify(
          document.documentElement.cloneNode(false),
        )} ${this.isNot ? 'contains:' : 'does not contain:'} ${stringify(
          element ? element.cloneNode(false) : element,
        )}
        `),
      ].join('\n')
    },
  }
}
