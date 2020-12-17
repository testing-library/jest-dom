import {checkHtmlElement} from './utils'

export function toBeEmptyDOMElement(element) {
  checkHtmlElement(element, toBeEmptyDOMElement, this)

  return {
    pass: isEmptyAfterRemovingComments(element),
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

function isEmptyAfterRemovingComments(element){
  const innerHTMLWithoutComments = element.innerHTML.replace(/(<!--(.|\s)*-->)/g, '');
  return innerHTMLWithoutComments === '';
}