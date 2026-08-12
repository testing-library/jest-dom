import {checkHtmlElement} from './utils'

export function toHaveVirtualFocus(element) {
  checkHtmlElement(element, toHaveVirtualFocus, this)

  const {activeElement} = element.ownerDocument
  const activeDescendantId = activeElement?.getAttribute(
    'aria-activedescendant',
  )
  const virtuallyFocusedElement = activeDescendantId
    ? element.ownerDocument.getElementById(activeDescendantId)
    : null

  return {
    pass: virtuallyFocusedElement === element,
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
              'Received element has virtual focus via aria-activedescendant:',
              `  ${this.utils.printReceived(element)}`,
            ]
          : [
              'Expected element to have virtual focus via aria-activedescendant:',
              `  ${this.utils.printExpected(element)}`,
              'Received element with virtual focus:',
              `  ${this.utils.printReceived(virtuallyFocusedElement)}`,
            ]),
      ].join('\n')
    },
  }
}
