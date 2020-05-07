import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage, matches, normalize} from './utils'

type Options = {
  normalizeWhitespace?: boolean
}

export function toHaveTextContent<T>(
  this: T,
  _matcher: string | RegExp | number,
  _options?: Options,
) {
  const context = (this as unknown) as jest.MatcherContext
  const htmlElement = arguments[0] as HTMLElement
  const matcher = arguments[1] as string | RegExp | number
  const options = (arguments[2] || {normalizeWhitespace: true}) as Options

  checkHtmlElement(htmlElement, toHaveTextContent, this)

  const textContent = options.normalizeWhitespace
    ? normalize(htmlElement.textContent!)
    : htmlElement.textContent!.replace(/\u00a0/g, ' ') // Replace &nbsp; with normal spaces

  const checkingWithEmptyString = textContent !== '' && matcher === ''

  return {
    pass: !checkingWithEmptyString && matches(textContent, matcher),
    message: () => {
      const to = context.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(
          `${context.isNot ? '.not' : ''}.toHaveTextContent`,
          'element',
          '',
        ),
        checkingWithEmptyString
          ? `Checking with empty string will always match, use .toBeEmpty() instead`
          : `Expected element ${to} have text content`,
        matcher,
        'Received',
        textContent,
      )
    },
  }
}
