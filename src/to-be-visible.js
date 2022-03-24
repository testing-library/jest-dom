import {checkHtmlElement} from './utils'

function getElementVisibilityStyle(element) {
  if (!element) return 'visible'
  const {getComputedStyle} = element.ownerDocument.defaultView
  const {visibility} = getComputedStyle(element)
  return visibility || getElementVisibilityStyle(element.parentElement)
}

function isVisibleSummaryDetails(element, previousElement) {
  return element.nodeName === 'DETAILS' &&
    previousElement.nodeName !== 'SUMMARY'
    ? element.hasAttribute('open')
    : true
}

function isElementTreeVisible(element, previousElement = undefined) {
  const {getComputedStyle} = element.ownerDocument.defaultView
  const {display, opacity} = getComputedStyle(element)
  return (
    display !== 'none' &&
    opacity !== '0' &&
    !element.hasAttribute('hidden') &&
    isVisibleSummaryDetails(element, previousElement) &&
    (element.parentElement
      ? isElementTreeVisible(element.parentElement, element)
      : true)
  )
}

function isElementVisibilityVisible(element) {
  const visibility = getElementVisibilityStyle(element)
  return visibility !== 'hidden' && visibility !== 'collapse'
}

/**
 * Computes the boolean value that determines if an element is considered visible from the
 * `toBeVisible` custom matcher point of view.
 *
 * Visibility is controlled via two different sets of properties and styles.
 *
 * 1. One set of properties allow parent elements to fully controls its sub-tree visibility. This
 *    means that if higher up in the tree some element is not visible by this criteria, it makes the
 *    entire sub-tree not visible too, and there's nothing that child elements can do to revert it.
 *    This includes `display: none`, `opacity: 0`, the presence of the `hidden` attribute`, and the
 *    open state of a details/summary elements pair.
 *
 * 2. The other aspect influencing if an element is visible is the CSS `visibility` style. This one
 *    is also inherited. But unlike the previous case, this one can be reverted by child elements.
 *    A parent element can set its visibiilty to `hidden` or `collapse`, but a child element setting
 *    its own styles to `visibility: visible` can rever that, and it makes itself visible. Hence,
 *    this criteria needs to be checked independently of the other one.
 *
 * Hence, the apprach taken by this function is two-fold: it first gets the first set of criteria
 * out of the way, analyzing the target element and up its tree. If this branch yields that the
 * element is not visible, there's nothing the element could be doing to revert that, so it returns
 * false. Only if the first check is true, if proceeds to analyze the `visibility` CSS.
 */
function isElementVisible(element) {
  return isElementTreeVisible(element) && isElementVisibilityVisible(element)
}

export function toBeVisible(element) {
  checkHtmlElement(element, toBeVisible, this)
  const isInDocument =
    element.ownerDocument === element.getRootNode({composed: true})
  const isVisible = isInDocument && isElementVisible(element)
  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? 'is' : 'is not'
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeVisible`,
          'element',
          '',
        ),
        '',
        `Received element ${is} visible${
          isInDocument ? '' : ' (element is not in the document)'
        }:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
