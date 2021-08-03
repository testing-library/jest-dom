import {computeAccessibleDescription} from 'dom-accessibility-api'
import {checkHtmlElement, getMessage} from './utils'

export function toHaveAccessibleDescription(
  htmlElement,
  expectedAccessibleDescription,
) {
  checkHtmlElement(htmlElement, toHaveAccessibleDescription, this)
  const actualAccessibleDescription = computeAccessibleDescription(htmlElement)
  const missingExpectedValue = arguments.length === 1

  let pass = false
  if (missingExpectedValue) {
    // When called without an expected value we only want to validate that the element has an
    // accessible description, whatever it may be.
    pass = actualAccessibleDescription !== ''
  } else {
    pass =
      expectedAccessibleDescription instanceof RegExp
        ? expectedAccessibleDescription.test(actualAccessibleDescription)
        : this.equals(
            actualAccessibleDescription,
            expectedAccessibleDescription,
          )
  }

  return {
    pass,

    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.${toHaveAccessibleDescription.name}`,
          'element',
          '',
        ),
        `Expected element ${to} have accessible description`,
        expectedAccessibleDescription,
        'Received',
        actualAccessibleDescription,
      )
    },
  }
}
