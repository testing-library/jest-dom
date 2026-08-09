import {checkHtmlElement} from './utils'

const ARIA_ACTIVEDESCENDANT = 'aria-activedescendant'

function getExpectedActiveDescendant(
  expectedActiveDescendant,
  matcher,
  context,
) {
  if (typeof expectedActiveDescendant === 'string') {
    return {id: expectedActiveDescendant}
  }

  checkHtmlElement(expectedActiveDescendant, matcher, context)
  return {element: expectedActiveDescendant}
}

function getActiveDescendantId(element) {
  return element.getAttribute(ARIA_ACTIVEDESCENDANT)
}

function getActiveDescendant(element) {
  const activeDescendantId = getActiveDescendantId(element)

  if (!activeDescendantId) {
    return null
  }

  return element.ariaActiveDescendantElement
    ? element.ariaActiveDescendantElement
    : element.ownerDocument.getElementById(activeDescendantId)
}

function hasActiveDescendant(element, expectedActiveDescendant) {
  const activeElement = element.ownerDocument.activeElement

  if (activeElement !== element) {
    return false
  }

  const activeDescendant = getActiveDescendant(element)

  if (expectedActiveDescendant === undefined) {
    return activeDescendant !== null
  }

  return expectedActiveDescendant.element
    ? activeDescendant === expectedActiveDescendant.element
    : activeDescendant?.id === expectedActiveDescendant.id
}

export function toHaveActiveDescendant(element, expectedActiveDescendant) {
  checkHtmlElement(element, toHaveActiveDescendant, this)

  const hasExpectedActiveDescendant = expectedActiveDescendant !== undefined
  const expectedActiveDescendantResult = hasExpectedActiveDescendant
    ? getExpectedActiveDescendant(
        expectedActiveDescendant,
        toHaveActiveDescendant,
        this,
      )
    : undefined
  const activeElement = element.ownerDocument.activeElement
  const activeDescendantId = getActiveDescendantId(element)
  const activeDescendant = getActiveDescendant(element)

  return {
    pass: hasActiveDescendant(element, expectedActiveDescendantResult),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveActiveDescendant`,
          'element',
          hasExpectedActiveDescendant ? 'element | string' : '',
        ),
        '',
        ...(this.isNot
          ? [
              'Expected element not to have active descendant:',
              `  ${this.utils.printExpected(
                hasExpectedActiveDescendant
                  ? expectedActiveDescendant
                  : activeDescendantId,
              )}`,
            ]
          : [
              'Expected element to have active descendant:',
              `  ${this.utils.printExpected(
                hasExpectedActiveDescendant
                  ? expectedActiveDescendant
                  : 'any element',
              )}`,
            ]),
        'Received element:',
        `  ${this.utils.printReceived(element)}`,
        'Received focused element:',
        `  ${this.utils.printReceived(activeElement)}`,
        'Received active descendant id:',
        `  ${this.utils.printReceived(activeDescendantId)}`,
        'Received active descendant element:',
        `  ${this.utils.printReceived(activeDescendant)}`,
      ].join('\n')
    },
  }
}

export function toHaveVirtualFocus(element) {
  checkHtmlElement(element, toHaveVirtualFocus, this)

  const activeElement = element.ownerDocument.activeElement
  const activeDescendantId = activeElement
    ? getActiveDescendantId(activeElement)
    : null
  const activeDescendant = activeElement
    ? getActiveDescendant(activeElement)
    : null

  return {
    pass: activeDescendant === element,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveVirtualFocus`,
          'element',
          '',
        ),
        '',
        ...(this.isNot
          ? [
              'Expected element not to have virtual focus:',
              `  ${this.utils.printExpected(element)}`,
            ]
          : [
              'Expected element to have virtual focus:',
              `  ${this.utils.printExpected(element)}`,
            ]),
        'Received focused element:',
        `  ${this.utils.printReceived(activeElement)}`,
        'Received active descendant id:',
        `  ${this.utils.printReceived(activeDescendantId)}`,
        'Received active descendant element:',
        `  ${this.utils.printReceived(activeDescendant)}`,
      ].join('\n')
    },
  }
}
