import {checkHtmlElement} from './utils'

function getDeepActiveElement(doc) {
  let active = doc.activeElement
  while (active && active.shadowRoot && active.shadowRoot.activeElement) {
    active = active.shadowRoot.activeElement
  }
  return active
}

export function toHaveFocus(element) {
  checkHtmlElement(element, toHaveFocus, this)

  const activeElement = getDeepActiveElement(element.ownerDocument)

  return {
    pass: activeElement === element,
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
              `  ${this.utils.printReceived(activeElement)}`,
            ]),
      ].join('\n')
    },
  }
}
