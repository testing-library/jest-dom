import {checkHtmlElement} from './utils'

export function toContainOnlyComments(element) {
  checkHtmlElement(element, toContainOnlyComments, this)

  return {
    pass: containsComments(element) && isEmptyAfterRemovingComments(element),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toContainOnlyComment`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${this.utils.printReceived(element.cloneNode(true))}`,
      ].join('\n')
    },
  }
}

function isEmptyAfterRemovingComments(element){
  const innerHTMLWithoutComments = element.innerHTML.replace(/(<!--(.|\s)*-->)/g, '');
  const innerHTMLWithoutCommentsAndTrim = innerHTMLWithoutComments.trim();
  return innerHTMLWithoutCommentsAndTrim === '';
}

function containsComments(element){
  return element.innerHTML.match(/(<!--(.|\s)*-->)/g) !== null;
}