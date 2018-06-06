import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage, matches} from './utils'

export function toHaveTextContent(htmlElement, checkWith) {
  checkHtmlElement(htmlElement, toHaveTextContent, this)
  const textContent = htmlElement.textContent
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
