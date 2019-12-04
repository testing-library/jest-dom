import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

export function toBeSelected(element) {
  checkHtmlElement(element, toBeSelected, this)

  const isSelected = element.getAttribute('aria-selected') === 'true'
  return {
    pass: isSelected,
    message: () => {
      const is = isSelected ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeSelected`, 'element', ''),
        '',
        `Received element ${is} selected:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
