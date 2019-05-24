import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

// form elements that support 'required'
const FORM_TAGS = ['select', 'textarea']

const ARIA_FORM_TAGS = ['input', 'select', 'textarea']

const UNSUPPORTED_INPUT_TYPES = [
  'color',
  'hidden',
  'range',
  'submit',
  'image',
  'reset',
]

const SUPPORTED_ARIA_ROLES = [
  'combobox',
  'gridcell',
  'radiogroup',
  'spinbutton',
  'tree',
]

function isRequiredOnFormTagsExceptInput(element) {
  return FORM_TAGS.includes(getTag(element)) && element.hasAttribute('required')
}

function isRequiredOnSupportedInput(element) {
  return (
    getTag(element) === 'input' &&
    element.hasAttribute('required') &&
    ((element.hasAttribute('type') &&
      !UNSUPPORTED_INPUT_TYPES.includes(element.getAttribute('type'))) ||
      !element.hasAttribute('type'))
  )
}

function isElementRequiredByARIA(element) {
  return (
    element.hasAttribute('aria-required') &&
    element.getAttribute('aria-required') === 'true' &&
    (ARIA_FORM_TAGS.includes(getTag(element)) ||
      (element.hasAttribute('role') &&
        SUPPORTED_ARIA_ROLES.includes(element.getAttribute('role'))))
  )
}

export function toBeRequired(element) {
  checkHtmlElement(element, toBeRequired, this)

  const isRequired =
    isRequiredOnFormTagsExceptInput(element) ||
    isRequiredOnSupportedInput(element) ||
    isElementRequiredByARIA(element)

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
