import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeEmpty<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeEmpty, this)

  return {
    pass: element.innerHTML === '',
    message: () => {
      return [
        matcherHint(`${context.isNot ? '.not' : ''}.toBeEmpty`, 'element', ''),
        '',
        'Received:',
        `  ${printReceived(element.innerHTML)}`,
      ].join('\n')
    },
  }
}
