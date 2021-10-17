import isEqualWith from 'lodash/isEqualWith'
import {
  checkHtmlElement,
  compareArraysAsSet,
  getMessage,
  getSelection,
} from './utils'

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
