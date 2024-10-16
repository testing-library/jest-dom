import isEqualWith from 'lodash/isEqualWith.js'
import {checkHtmlElement, compareArraysAsSet, getMessage} from './utils'

/**
 * Returns the selection from the element.
 * 
 * @param element {HTMLElement} The element to get the selection from.
 * @returns {String} The selection.
 */
function getSelection(element) {
  const selection = element.ownerDocument.getSelection()

  if (['input', 'textarea'].includes(element.tagName.toLowerCase())) {
    if (['radio', 'checkbox'].includes(element.type)) return ''
    return element.value
      .toString()
      .substring(element.selectionStart, element.selectionEnd)
  }

  if (selection.anchorNode === null || selection.focusNode === null) {
    // No selection
    return ''
  }

  const originalRange = selection.getRangeAt(0)
  const temporaryRange = element.ownerDocument.createRange()

  if (selection.containsNode(element, false)) {
    // Whole element is inside selection
    temporaryRange.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(temporaryRange)
  } else if (
    element.contains(selection.anchorNode) &&
    element.contains(selection.focusNode)
  ) {
    // Element contains selection, nothing to do
  } else {
    // Element is partially selected
    const selectionStartsWithinElement =
      element === originalRange.startContainer ||
      element.contains(originalRange.startContainer)
    const selectionEndsWithinElement =
      element === originalRange.endContainer ||
      element.contains(originalRange.endContainer)
    selection.removeAllRanges()

    if (selectionStartsWithinElement || selectionEndsWithinElement) {
      temporaryRange.selectNodeContents(element)

      if (selectionStartsWithinElement) {
        temporaryRange.setStart(
          originalRange.startContainer,
          originalRange.startOffset,
        )
      }
      if (selectionEndsWithinElement) {
        temporaryRange.setEnd(
          originalRange.endContainer,
          originalRange.endOffset,
        )
      }

      selection.addRange(temporaryRange)
    }
  }

  const result = selection.toString()

  selection.removeAllRanges()
  selection.addRange(originalRange)

  return result
}

/**
 * Checks if the element has the string selected.
 *
 * @param htmlElement {HTMLElement} The html element to check the selection for.
 * @param expectedSelection {String} The selection as a string.
 */
export function toHaveSelection(htmlElement, expectedSelection) {
  checkHtmlElement(htmlElement, toHaveSelection, this)

  const expectsSelection = expectedSelection !== undefined

  if (expectsSelection && typeof expectedSelection !== 'string') {
    throw new Error(`expected selection must be a string or undefined`)
  }

  const receivedSelection = getSelection(htmlElement)

  return {
    pass: expectsSelection
      ? isEqualWith(receivedSelection, expectedSelection, compareArraysAsSet)
      : Boolean(receivedSelection),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const matcher = this.utils.matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveSelection`,
        'element',
        expectedSelection,
      )
      return getMessage(
        this,
        matcher,
        `Expected the element ${to} have selection`,
        expectsSelection ? expectedSelection : '(any)',
        'Received',
        receivedSelection,
      )
    },
  }
}
