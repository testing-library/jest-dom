import {matcherHint, printExpected, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage, normalize} from './utils'

type Matcher = string | RegExp

// See algoritm: https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description
export function toHaveDescription<T>(this: T, _matcher?: Matcher) {
  const context = (this as unknown) as jest.MatcherContext

  const htmlElement = arguments[0] as HTMLElement
  const matcher = arguments[1] as Matcher
  checkHtmlElement(htmlElement, toHaveDescription, this)

  const expectsDescription = matcher !== undefined

  const descriptionIDRaw = htmlElement.getAttribute('aria-describedby') || ''
  const descriptionIDs = descriptionIDRaw.split(/\s+/).filter(Boolean)
  let description = ''
  if (descriptionIDs.length > 0) {
    const document = htmlElement.ownerDocument
    const descriptionEls = descriptionIDs
      .map(descriptionID => document!.getElementById(descriptionID))
      .filter(Boolean)

    description = normalize(descriptionEls.map(el => el!.textContent).join(' '))
  }

  return {
    pass: expectsDescription
      ? matcher instanceof RegExp
        ? matcher.test(description)
        : context.equals(description, matcher)
      : Boolean(description),
    message: () => {
      const to = context.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(
          `${context.isNot ? '.not' : ''}.toHaveDescription`,
          'element',
          '',
        ),
        `Expected the element ${to} have description`,
        printExpected(matcher),
        'Received',
        printReceived(description),
      )
    },
  }
}
