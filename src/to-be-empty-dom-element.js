import {checkHtmlElement} from './utils'

export function toBeEmptyDOMElement(element) {
  checkHtmlElement(element, toBeEmptyDOMElement, this)

  return {
    pass: isEmptyElement(element),
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

function isEmptyElement(element){
  const nonCommentChildNodes = [...element.childNodes].filter(node => node.nodeType !== 8);
  return nonCommentChildNodes.length === 0;
}