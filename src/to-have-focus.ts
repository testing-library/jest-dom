import {matcherHint, printReceived, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toHaveFocus<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toHaveFocus, this)

  const activeElement = element.ownerDocument!.activeElement!
  return {
    pass: activeElement === element,
    message: () => {
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toHaveFocus`,
          'element',
          '',
        ),
        '',
        'Expected',
        `  ${printExpected(element)}`,
        'Received:',
        `  ${printReceived(activeElement)}`,
      ].join('\n')
    },
  }
}
