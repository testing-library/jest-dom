import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

const FORM_TAGS = ['form', 'input', 'select', 'textarea']

function isElementHavingAriaInvalid(element: HTMLElement) {
  return (
    element.hasAttribute('aria-invalid') &&
    element.getAttribute('aria-invalid') !== 'false'
  )
}

function isElementInvalid(element: any) {
  return !element.checkValidity()
}

export function toBeInvalid<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeInvalid, this)

  const isInvalid =
    isElementHavingAriaInvalid(element) || isElementInvalid(element)

  return {
    pass: isInvalid,
    message: () => {
      const is = isInvalid ? 'is' : 'is not'
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeInvalid`,
          'element',
          '',
        ),
        '',
        `Received element ${is} currently invalid:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

export function toBeValid<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeValid, this)

  const isValid =
    !isElementHavingAriaInvalid(element) &&
    FORM_TAGS.includes(getTag(element)) &&
    !isElementInvalid(element)

  return {
    pass: isValid,
    message: () => {
      const is = isValid ? 'is' : 'is not'
      return [
        matcherHint(`${context.isNot ? '.not' : ''}.toBeValid`, 'element', ''),
        '',
        `Received element ${is} currently valid:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
