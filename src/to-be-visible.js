import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

function isStyleVisible(element) {
  const {getComputedStyle} = element.ownerDocument.defaultView

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
    !element.hasAttribute('hidden') &&
    (!element.parentElement || isElementVisible(element.parentElement))
  )
}

export function toBeVisible(element) {
  checkHtmlElement(element, toBeVisible, this)
  const isVisible = isElementVisible(element)
  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeVisible`, 'element', ''),
        '',
        `Received element ${is} visible:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
