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

/**
 * Identifies if a element doesn't contain child elements excluded comments
 * ℹ Node.COMMENT_NODE can't be used because of the following issue 
 * https://github.com/jsdom/jsdom/issues/2220
 *
 * @param {*} element an HtmlElement or SVGElement
 * @return {*} true if the element only contains comments or none
 */
function isEmptyElement(element){
  const nonCommentChildNodes = [...element.childNodes].filter(node => node.nodeType !== 8);
  return nonCommentChildNodes.length === 0;
}