import {checkHtmlElement} from './utils'

export function toBeEmpty(element) {
  checkHtmlElement(element, toBeEmpty, this)

  return {
    pass: element.innerHTML === '',
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeEmpty`,
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
