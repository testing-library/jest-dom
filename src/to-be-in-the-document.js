import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, checkDocumentKey} from './utils'

export function toBeInTheDocument(element) {
  checkHtmlElement(element, toBeInTheDocument, this)
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
        'Received:',
        `  ${printReceived(
          element.hasChildNodes() ? element.cloneNode(false) : element,
        )}`,
      ].join('\n')
    },
  }
}
