import {checkHtmlElement, deprecate} from './utils'

export function toBeEmpty(element) {
  deprecate(
    'toBeEmpty',
    'Please use instead toBeEmptyDOMElement for finding empty nodes in the DOM.',
  )
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
