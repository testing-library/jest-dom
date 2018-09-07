import {matcherHint} from 'jest-matcher-utils'
import {getNodeText} from 'dom-testing-library'
import {checkHtmlElement, getMessage, matches} from './utils'

export function toHaveTextContent(htmlElement, checkWith) {
  checkHtmlElement(htmlElement, toHaveTextContent, this)
  const textContent = getNodeText(htmlElement).replace(/\s+/g, ' ')

  return {
    pass: matches(textContent, htmlElement, checkWith),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveTextContent`,
          'element',
          '',
        ),
        `Expected element ${to} have text content`,
        checkWith,
        'Received',
        textContent,
      )
    },
  }
}
