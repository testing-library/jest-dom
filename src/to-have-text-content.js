import {matcherHint} from 'jest-matcher-utils'
import {getNodeText} from 'dom-testing-library'
import {checkHtmlElement, getMessage, matches} from './utils'

export function toHaveTextContent(
  htmlElement,
  checkWith,
  options = {normalizeSpaces: false},
) {
  checkHtmlElement(htmlElement, toHaveTextContent, this)

  const textContent = options.normalizeSpaces
    ? getNodeText(htmlElement).replace(/\s+/g, ' ')
    : getNodeText(htmlElement)

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
