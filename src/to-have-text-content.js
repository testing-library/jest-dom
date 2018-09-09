import {matcherHint} from 'jest-matcher-utils'
import {getNodeText} from 'dom-testing-library'
import {checkHtmlElement, getMessage, matches} from './utils'

export function toHaveTextContent(
  htmlElement,
  checkWith,
  options = {normalizeWhitespace: true},
) {
  checkHtmlElement(htmlElement, toHaveTextContent, this)

  const textContent = options.normalizeWhitespace
    ? getNodeText(htmlElement)
        .replace(/\s+/g, ' ')
        .trim()
    : getNodeText(htmlElement).replace(/\u00a0/g, ' ') // Replace &nbsp; with normal spaces

  return {
    pass: matches(textContent, checkWith),
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
