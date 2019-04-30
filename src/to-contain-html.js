import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toContainHTML(container, htmlText) {
  checkHtmlElement(container, toContainHTML, this)

  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainHTML`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(container.cloneNode(true))}`,
      ].join('\n')
    },
  }
}
