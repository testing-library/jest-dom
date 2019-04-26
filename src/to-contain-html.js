import {matcherHint, printReceived} from 'jest-matcher-utils'
import {getHtmlElement} from './utils'

export function toContainHTML(container, htmlText) {
  container = getHtmlElement(container, toContainHTML, this)

  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainHTML`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(container.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
