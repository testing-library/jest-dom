import isEqualWith from 'lodash/isEqualWith'
import {
  checkHtmlElement,
  compareArraysAsSet,
  getMessage,
  getSelection,
} from './utils'

export function toHaveSelection(htmlElement, expectedSelection) {
  checkHtmlElement(htmlElement, toHaveSelection, this)

  const receivedSelection = getSelection(htmlElement)
  const expectsSelection = expectedSelection !== undefined

  let expectedTypedSelection = expectedSelection
  let receivedTypedSelection = receivedSelection
  if (
    expectedSelection == receivedSelection &&
    expectedSelection !== receivedSelection
  ) {
    expectedTypedSelection = `${expectedSelection} (${typeof expectedSelection})`
    receivedTypedSelection = `${receivedSelection} (${typeof receivedSelection})`
  }

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
        expectsSelection ? expectedTypedSelection : '(any)',
        'Received',
        receivedTypedSelection,
      )
    },
  }
}
