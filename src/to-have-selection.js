import isEqualWith from 'lodash/isEqualWith'
import {checkHtmlElement, compareArraysAsSet, getMessage} from './utils'

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
  } else if (selection.containsNode(element, true)) {
    // Element is partially selected
    const selectionStartsWithinElement =
      element === originalRange.startContainer ||
      element.contains(originalRange.startContainer)
    const selectionEndsWithinElement =
      element === originalRange.endContainer ||
      element.contains(originalRange.endContainer)

    temporaryRange.selectNodeContents(element)

    if (selectionStartsWithinElement) {
      temporaryRange.setStart(
        originalRange.startContainer,
        originalRange.startOffset,
      )
    } else if (selectionEndsWithinElement) {
      temporaryRange.setEnd(originalRange.endContainer, originalRange.endOffset)
    }

    selection.removeAllRanges()
    selection.addRange(temporaryRange)
  }

  const result = selection.toString()

  selection.removeAllRanges()
  selection.addRange(originalRange)

  return result
}

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
