import {checkHtmlElement} from './utils'

export function toContainHTML(container, htmlText) {
  checkHtmlElement(container, toContainHTML, this)

  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toContainHTML`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${this.utils.printReceived(container.cloneNode(true))}`,
      ].join('\n')
    },
  }
}
