import {checkHtmlElement, getMessage, normalize, deprecate} from './utils'

// See algoritm: https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description
export function toHaveDescription(htmlElement, checkWith) {
  deprecate(
    'toHaveDescription',
    'Please use toHaveAccessibleDescription.',
  )

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
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveDescription`,
          'element',
          '',
        ),
        `Expected the element ${to} have description`,
        this.utils.printExpected(checkWith),
        'Received',
        this.utils.printReceived(description),
      )
    },
  }
}
