import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toContainHTML<T>(this: T, _htmlText: string) {
  const context = (this as unknown) as jest.MatcherContext
  const container = arguments[0] as HTMLElement
  const htmlText = arguments[1] as string
  checkHtmlElement(container, toContainHTML, this)

  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toContainHTML`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${printReceived(container.cloneNode(true))}`,
      ].join('\n')
    },
  }
}
