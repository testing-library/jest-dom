import {getMessage, HtmlElementTypeError, matches, normalize} from './utils'

export function toHaveTextContent(
  htmlElement,
  checkWith,
  options = {normalizeWhitespace: true},
) {
  const window = htmlElement.ownerDocument.defaultView

  if (!(htmlElement instanceof window.Node)) {
    throw new HtmlElementTypeError(toHaveTextContent, this)
  }

  const textContent = options.normalizeWhitespace
    ? normalize(htmlElement.textContent)
    : htmlElement.textContent.replace(/\u00a0/g, ' ') // Replace &nbsp; with normal spaces

  const checkingWithEmptyString = textContent !== '' && checkWith === ''

  return {
    pass: !checkingWithEmptyString && matches(textContent, checkWith),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveTextContent`,
          'element',
          '',
        ),
        checkingWithEmptyString
          ? `Checking with empty string will always match, use .toBeEmptyDOMElement() instead`
          : `Expected element ${to} have text content`,
        checkWith,
        'Received',
        textContent,
      )
    },
  }
}
