import {matcherHint, printExpected, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage, normalize} from './utils'

// See algoritm: https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description
export function toHaveDescription(htmlElement, checkWith) {
  checkHtmlElement(htmlElement, toHaveDescription, this)

  const expectsDescription = checkWith !== undefined

  const descriptionIDRaw = htmlElement.getAttribute('aria-describedby') || ''
  const descriptionIDs = descriptionIDRaw.split(/\s+/).filter(Boolean)
  let description = ''
  if (descriptionIDs.length > 0) {
    const document = htmlElement.ownerDocument
    const descriptionEls = descriptionIDs
      .map(descriptionID => document.getElementById(descriptionID))
      .filter(Boolean)
    description = normalize(descriptionEls.map(el => el.textContent).join(' '))
  }

  return {
    pass: expectsDescription
      ? checkWith instanceof RegExp
        ? checkWith.test(description)
        : this.equals(description, checkWith)
      : Boolean(description),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveDescription`,
          'element',
          '',
        ),
        `Expected the element ${to} have description`,
        printExpected(checkWith),
        'Received',
        printReceived(description),
      )
    },
  }
}
