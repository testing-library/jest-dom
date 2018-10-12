import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

function checkHtmlText(element, htmlText, ...args) {
  const DOMParser = element.ownerDocument.defaultView.DOMParser
  const htmlElement =
    typeof htmlText === 'string'
      ? new DOMParser().parseFromString(htmlText, 'text/html').body.firstChild
      : null
  checkHtmlElement(htmlElement, ...args)
}

export function toContainHTML(container, htmlText) {
  checkHtmlElement(container, toContainHTML, this)
  checkHtmlText(container, htmlText, toContainHTML, this)

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
