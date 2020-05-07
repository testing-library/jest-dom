import {
  matcherHint,
  stringify,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeInTheDocument<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement

  if (element !== null || !context.isNot) {
    checkHtmlElement(element, toBeInTheDocument, this)
  }

  const pass =
    element === null ? false : element.ownerDocument!.contains(element)

  const errorFound = () => {
    return `expected document not to contain element, found ${stringify(
      element.cloneNode(true),
    )} instead`
  }
  const errorNotFound = () => {
    return `element could not be found in the document`
  }

  return {
    pass,
    message: () => {
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeInTheDocument`,
          'element',
          '',
        ),
        '',
        receivedColor(context.isNot ? errorFound() : errorNotFound()),
      ].join('\n')
    },
  }
}
