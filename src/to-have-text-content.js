import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage, matches, normalize} from './utils'

export function toHaveTextContent(
  htmlElement,
  checkWith,
  options = {normalizeWhitespace: true},
) {
  checkHtmlElement(htmlElement, toHaveTextContent, this)

  const textContent = options.normalizeWhitespace
    ? normalize(htmlElement.textContent)
    : htmlElement.textContent.replace(/\u00a0/g, ' ') // Replace &nbsp; with normal spaces

  const checkingWithEmptyString = textContent !== '' && checkWith === ''

  return {
    pass: !checkingWithEmptyString && matches(textContent, checkWith),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveTextContent`,
          'element',
          '',
        ),
        checkingWithEmptyString
          ? `Checking with empty string will always match, use .toBeEmpty() instead`
          : `Expected element ${to} have text content`,
        checkWith,
        'Received',
        textContent,
      )
    },
  }
}
