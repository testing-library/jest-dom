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

function isAttributeVisible(element, previousElement) {
  return (
    !element.hasAttribute('hidden') &&
    (element.nodeName === 'DETAILS' && previousElement.nodeName !== 'SUMMARY'
      ? element.hasAttribute('open')
      : true)
  )
}

function isElementVisible(element, previousElement) {
  return (
    isStyleVisible(element) &&
    isAttributeVisible(element, previousElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  )
}

/* eslint-disable valid-jsdoc */
/**
 * @description This allows you to check if an element is currently visible to the user.
 *
 * An element is visible if **all** the following conditions are met:
 * * it does not have its css property display set to none
 * * it does not have its css property visibility set to either hidden or collapse
 * * it does not have its css property opacity set to 0
 * * its parent element is also visible (and so on up to the top of the DOM tree)
 * * it does not have the hidden attribute
 * * if `<details />` it has the open attribute
 * @example
 *  <div
 *    data-testid="zero-opacity"
 *    style="opacity: 0"
 *  >
 *    Zero Opacity
 *  </div>
 *
 *  <div data-testid="visible">Visible Example</div>
 *
 *  expect(getByTestId('zero-opacity')).not.toBeVisible()
 *  expect(getByTestId('visible')).toBeVisible()
 * @see [github.com/testing-library/jest-dom#tobevisible](https:github.com/testing-library/jest-dom#tobevisible)
 */
/* eslint-enable valid-jsdoc */
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
