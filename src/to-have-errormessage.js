import {matcherHint, printExpected, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage, normalize} from './utils'

// See algoritm: https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description
export function toHaveErrorMessage(htmlElement, checkWith) {
  checkHtmlElement(htmlElement, toHaveErrorMessage, this)

  const expectsErrorMessage = checkWith !== undefined

  const errormessageIDRaw = htmlElement.getAttribute('aria-errormessage') || ''
  const errormessageIDs = errormessageIDRaw.split(/\s+/).filter(Boolean)
  let errormessage = ''
  if (errormessageIDs.length > 0) {
    const document = htmlElement.ownerDocument
    const errormessageEls = errormessageIDs
      .map(errormessageID => document.getElementById(errormessageID))
      .filter(Boolean)
    errormessage = normalize(
      errormessageEls.map(el => el.textContent).join(' '),
    )
  }

  return {
    pass: expectsErrorMessage
      ? checkWith instanceof RegExp
        ? checkWith.test(errormessage)
        : this.equals(errormessage, checkWith)
      : Boolean(errormessage),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveErrorMessage`,
          'element',
          '',
        ),
        `Expected the element ${to} have errormessage`,
        printExpected(checkWith),
        'Received',
        printReceived(errormessage),
      )
    },
  }
}
