import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

const SUPPORTED_INPUT_TYPES = [
  'text',
  'search',
  'url',
  'tel',
  'email',
  'password',
  'date',
  'month',
  'week',
  'time',
  'datetime-local',
  'number',
]

const SUPPORTED_ARIA_TAGS = ['input', 'textarea', 'table', 'td', 'th']

const SUPPORTED_ARIA_ROLES = [
  'grid',
  'gridcell',
  'textbox',
  'columnheader',
  'rowheader',
  'treegrid',
]

function isReadOnlyTextarea(element) {
  return getTag(element) === 'textarea' && element.hasAttribute('readonly')
}

function isReadonlyOnSupportedInput(element) {
  return (
    getTag(element) === 'input' &&
    element.hasAttribute('readonly') &&
    ((element.hasAttribute('type') &&
      SUPPORTED_INPUT_TYPES.includes(element.getAttribute('type'))) ||
      !element.hasAttribute('type'))
  )
}

function isElementRequiredByARIA(element) {
  return (
    element.hasAttribute('aria-readonly') &&
    element.getAttribute('aria-readonly') === 'true' &&
    SUPPORTED_ARIA_TAGS.includes(getTag(element)) &&
    element.hasAttribute('role') &&
    SUPPORTED_ARIA_ROLES.includes(element.getAttribute('role'))
  )
}

export function toBeReadonly(element) {
  checkHtmlElement(element, toBeReadonly, this)

  const isReadonly =
    isReadOnlyTextarea(element) ||
    isReadonlyOnSupportedInput(element) ||
    isElementRequiredByARIA(element)

  return {
    pass: isReadonly,
    message: () => {
      const is = isReadonly ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeReadonly`, 'element', ''),
        '',
        `Received element ${is} readonly:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
