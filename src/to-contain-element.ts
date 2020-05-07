import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toContainElement<T>(
  this: T,
  _element: Element | null | undefined,
) {
  const context = (this as unknown) as jest.MatcherContext
  const container = arguments[0] as HTMLElement
  const element = arguments[1] as HTMLElement

  checkHtmlElement(container, toContainElement, this)

  if (element !== null) {
    checkHtmlElement(element, toContainElement, this)
  }

  return {
    pass: container.contains(element),
    message: () => {
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toContainElement`,
          'element',
          'element',
        ),
        '',
        receivedColor(`${stringify(container.cloneNode(false))} ${
          context.isNot ? 'contains:' : 'does not contain:'
        } ${stringify(element ? element.cloneNode(false) : element)}
        `),
      ].join('\n')
    },
  }
}
