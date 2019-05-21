import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

// form elements that support 'required'
const FORM_TAGS = [
  'input',
  'select',
  'optgroup',
  'option',
  'button',
  'textarea',
]

function getTag(element) {
  return element.tagName && element.tagName.toLowerCase()
}

function isElementRequired(element) {
  return FORM_TAGS.includes(getTag(element)) && element.hasAttribute('required')
}

function isElementRequiredByARIA(element) {
  return (
    FORM_TAGS.includes(getTag(element)) &&
    element.getAttribute('aria-required') === 'true'
  )
}

export function toBeRequired(element) {
  checkHtmlElement(element, toBeRequired, this)

  const isRequired =
    isElementRequired(element) || isElementRequiredByARIA(element)

  return {
    pass: isRequired,
    message: () => {
      const is = isRequired ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeRequired`, 'element', ''),
        '',
        `Received element ${is} required:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

export function toBeOptional(element) {
  checkHtmlElement(element, toBeOptional, this)

  const isOptional = !(
    isElementRequired(element) || isElementRequiredByARIA(element)
  )

  return {
    pass: isOptional,
    message: () => {
      const is = isOptional ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeOptional`, 'element', ''),
        '',
        `Received element ${is} optional:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
