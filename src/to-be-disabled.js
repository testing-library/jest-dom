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

/* eslint-disable valid-jsdoc */
/**
 * @description Allows you to check whether an element is disabled from the user's perspective. matches if the element is a form control and the `disabled` attribute is specified on this element or the element is a descendant of a form element with a `disabled` attribute.
 * @example
 *  <button
 *    data-testid="button"
 *    type="submit"
 *    disabled
 *  >
 *    submit
 *  </button>
 *
 *  expect(getByTestId('button')).toBeDisabled()
 * @see [github.com/testing-library/jest-dom#tobedisabled](https:github.com/testing-library/jest-dom#tobedisabled)
 */
/* eslint-enable valid-jsdoc */
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

/* eslint-disable valid-jsdoc */
/**
 * @description Allows you to check whether an element is not disabled from the user's perspective. Works like `not.toBeDisabled()`. Use this matcher to avoid double negation in your tests.
 * @example
 *  <button
 *    data-testid="button"
 *    type="submit"
 *  >
 *    submit
 *  </button>
 *
 *  expect(getByTestId('button')).toBeEnabled()
 * @see [github.com/testing-library/jest-dom#tobeenabled](https:github.com/testing-library/jest-dom#tobeenabled)
 */
/* eslint-enable valid-jsdoc */
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
