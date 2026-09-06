import {checkHtmlElement} from './utils'

// When focus moves into a shadow root, `document.activeElement` resolves to the
// shadow host rather than the element that actually has focus, which lives at
// `shadowRoot.activeElement`. Walk down nested shadow roots to find the truly
// focused element. Falls back to `doc.activeElement` when no shadow root is
// involved, so behavior is unchanged for regular elements.
function getActiveElement(doc) {
  let active = doc.activeElement

  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement
  }

  return active
}

export function toHaveFocus(element) {
  checkHtmlElement(element, toHaveFocus, this)

  return {
    pass: getActiveElement(element.ownerDocument) === element,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveFocus`,
          'element',
          '',
        ),
        '',
        ...(this.isNot
          ? [
              'Received element is focused:',
              `  ${this.utils.printReceived(element)}`,
            ]
          : [
              'Expected element with focus:',
              `  ${this.utils.printExpected(element)}`,
              'Received element with focus:',
              `  ${this.utils.printReceived(
                getActiveElement(element.ownerDocument),
              )}`,
            ]),
      ].join('\n')
    },
  }
}
