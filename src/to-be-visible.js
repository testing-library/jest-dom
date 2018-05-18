import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function isStyleVisible(element) {
  const {display, visibility, opacity} = getComputedStyle(element)
  return (
    display !== 'none' &&
    visibility !== 'hidden' &&
    visibility !== 'collapse' &&
    opacity !== '0' &&
    opacity !== 0
  )
}

function isElementVisible(element) {
  return (
    isStyleVisible(element) &&
    (!element.parentElement || isElementVisible(element.parentElement))
  )
}

export function toBeVisible(element) {
  checkHtmlElement(element)
  const isVisible = isElementVisible(element)
  return {
    pass: isVisible,
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const is = isVisible ? 'is' : 'is not'
      return getMessage(
        matcherHint(`${this.isNot ? '.not' : ''}.toBeVisible`, 'element', ''),
        'Expected',
        `element ${to} be visible`,
        'Received',
        `element ${is} visible`,
      )
    },
  }
}
