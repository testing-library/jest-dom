import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

function isElementHavingAriaInvalid(element) {
  return (
    element.hasAttribute('aria-invalid') &&
    element.getAttribute('aria-invalid') !== 'false'
  )
}

function isElementInvalid(element) {
  return !element.checkValidity()
}

export function toBeInvalid(element) {
  checkHtmlElement(element, toBeInvalid, this)

  const isInvalid =
    isElementHavingAriaInvalid(element) || isElementInvalid(element)

  return {
    pass: isInvalid,
    message: () => {
      const is = isInvalid ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeInvalid`, 'element', ''),
        '',
        `Received element ${is} currently invalid:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

export function toBeValid(element) {
  checkHtmlElement(element, toBeValid, this)

  const isValid =
    !isElementHavingAriaInvalid(element) && !isElementInvalid(element)

  return {
    pass: isValid,
    message: () => {
      const is = isValid ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeValid`, 'element', ''),
        '',
        `Received element ${is} currently invalid:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
