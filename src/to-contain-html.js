import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toContainHtml(container, htmlText) {
  const stringToHtml = item =>
    new DOMParser().parseFromString(item, 'text/html').body.firstChild
  const htmlElement =
    typeof htmlText === 'string' ? stringToHtml(htmlText) : null

  checkHtmlElement(container, toContainHtml, this)
  checkHtmlElement(htmlElement, toContainHtml, this)

  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainHtml`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(container.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
