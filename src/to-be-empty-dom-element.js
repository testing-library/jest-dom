import {checkHtmlElement} from './utils'

export function toBeEmptyDOMElement(element) {
  checkHtmlElement(element, toBeEmptyDOMElement, this)

  return {
    pass: element.innerHTML === '',
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeEmptyDOMElement`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${this.utils.printReceived(element.innerHTML)}`,
      ].join('\n')
    },
  }
}
