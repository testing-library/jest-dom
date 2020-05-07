import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, deprecate} from './utils'

export function toBeInTheDOM<T>(
  this: T,
  _container?: Element | null,
): jest.CustomMatcherResult {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  const container = arguments[1] as HTMLElement

  deprecate(
    'toBeInTheDOM',
    'Please use toBeInTheDocument for searching the entire document and toContainElement for searching a specific container.',
  )

  if (element) {
    checkHtmlElement(element, toBeInTheDOM, this)
  }

  if (container) {
    checkHtmlElement(container, toBeInTheDOM, this)
  }

  return {
    pass: container ? container.contains(element) : !!element,
    message: () => {
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeInTheDOM`,
          'element',
          '',
        ),
        '',
        'Received:',
        `  ${printReceived(element ? element.cloneNode(false) : element)}`,
      ].join('\n')
    },
  }
}
