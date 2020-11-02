import {checkHtmlElement} from './utils'

export function toHaveFocus(element) {
  checkHtmlElement(element, toHaveFocus, this)

  return {
    pass: element.ownerDocument.activeElement === element,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveFocus`,
          'element',
          '',
        ),
        '',
        'Expected element with focus:',
        `  ${this.utils.printExpected(element)}`,
        'Received element without focus:',
        `  ${this.utils.printReceived(element.ownerDocument.activeElement)}`,
      ].join('\n')
    },
  }
}
