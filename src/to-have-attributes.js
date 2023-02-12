import {size} from 'lodash'
import {checkHtmlElement} from './utils'

export function toHaveAttributes(htmlElement, expectedAttributes) {
  checkHtmlElement(htmlElement, toHaveAttributes, this)
  const hasExpectedAttributes =
    typeof expectedAttributes === 'object' && !!size(expectedAttributes)

  const receivedAttributes = {}
  let isValid = hasExpectedAttributes

  if (hasExpectedAttributes) {
    Object.entries(expectedAttributes).forEach(
      ([expectedAttribute, expectedValue]) => {
        const hasAttribute = htmlElement.hasAttribute(expectedAttribute)
        const receivedValue = htmlElement.getAttribute(expectedAttribute)
        const areValuesEqual = this.equals(receivedValue, expectedValue)

        if (!this.isNot) {
          if (!areValuesEqual) {
            isValid = false
          }

          if (hasAttribute) {
            receivedAttributes[expectedAttribute] = receivedValue
          }
        } else if (areValuesEqual) {
          isValid = false
          if (hasAttribute) {
            receivedAttributes[expectedAttribute] = receivedValue
          }
        }
      },
    )
  }

  const pass = hasExpectedAttributes && isValid

  return {
    pass: this.isNot ? !pass : pass,
    message: () => {
      const matcher = hasExpectedAttributes
        ? this.utils.matcherHint(
            `${this.isNot ? '.not' : ''}.toHaveAttributes`,
            'received',
            'expected',
          )
        : undefined

      const message = hasExpectedAttributes
        ? this.utils.diff(expectedAttributes, receivedAttributes, {
            includeChangeCounts: true,
          })
        : // eslint-disable-next-line @babel/new-cap
          this.utils.RECEIVED_COLOR(
            `.toHaveAttributes() expects object with at least one property, received ${this.utils.stringify(
              expectedAttributes,
            )}`,
          )

      const to = this.isNot ? 'not to' : 'to'

      return [
        matcher,
        `Expected the element ${to} have attributes`,
        message,
      ].join('\n\n')
    },
  }
}
