import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

// form elements that support 'disabled'
const FORM_TAGS = [
  'fieldset',
  'input',
  'select',
  'optgroup',
  'option',
  'button',
  'textarea',
]

/*
 * According to specification:
 * If <fieldset> is disabled, the form controls that are its descendants,
 * except descendants of its first optional <legend> element, are disabled
 *
 * https://html.spec.whatwg.org/multipage/form-elements.html#concept-fieldset-disabled
 *
 * This method tests whether element is first legend child of fieldset parent
 */
function isFirstLegendChildOfFieldset(element, parent) {
  return (
    getTag(element) === 'legend' &&
    getTag(parent) === 'fieldset' &&
    element.isSameNode(
      Array.from(parent.children).find(child => getTag(child) === 'legend'),
    )
  )
}

function isElementDisabledByParent(element, parent) {
  return (
    isElementDisabled(parent) && !isFirstLegendChildOfFieldset(element, parent)
  )
}

function isElementDisabled(element) {
  return FORM_TAGS.includes(getTag(element)) && element.hasAttribute('disabled')
}

function isAncestorDisabled(element) {
  const parent = element.parentElement
  return (
    Boolean(parent) &&
    (isElementDisabledByParent(element, parent) || isAncestorDisabled(parent))
  )
}

export function toBeDisabled(element) {
  checkHtmlElement(element, toBeDisabled, this)

  const isDisabled = isElementDisabled(element) || isAncestorDisabled(element)

  return {
    pass: isDisabled,
    message: () => {
      const is = isDisabled ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeDisabled`, 'element', ''),
        '',
        `Received element ${is} disabled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

export function toBeEnabled(element) {
  checkHtmlElement(element, toBeEnabled, this)

  const isEnabled = !(isElementDisabled(element) || isAncestorDisabled(element))

  return {
    pass: isEnabled,
    message: () => {
      const is = isEnabled ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEnabled`, 'element', ''),
        '',
        `Received element ${is} enabled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
