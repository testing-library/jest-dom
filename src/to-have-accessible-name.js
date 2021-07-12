import {computeAccessibleName} from 'dom-accessibility-api'
import {checkHtmlElement, getMessage} from './utils'

export function toHaveAccessibleName(htmlElement, expectedAccessibleName) {
  checkHtmlElement(htmlElement, toHaveAccessibleName, this)
  const actualAccessibleName = computeAccessibleName(htmlElement)
  const missingExpectedValue = arguments.length === 1

  let pass = false
  if (missingExpectedValue) {
    // When called without an expected value we only want to validate that the element has an
    // accessible name, whatever it may be.
    pass = actualAccessibleName !== ''
  } else {
    pass =
      expectedAccessibleName instanceof RegExp
        ? expectedAccessibleName.test(actualAccessibleName)
        : this.equals(actualAccessibleName, expectedAccessibleName)
  }

  return {
    pass,

    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.${toHaveAccessibleName.name}`,
          'element',
          '',
        ),
        `Expected element ${to} have accessible name`,
        expectedAccessibleName,
        'Received',
        actualAccessibleName,
      )
    },
  }
}
