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
function isFirstLegendChildOfFieldset(
  element: HTMLElement,
  parent: HTMLElement,
) {
  return (
    getTag(element) === 'legend' &&
    getTag(parent) === 'fieldset' &&
    element.isSameNode(
      Array.from(parent.children).find(
        child => getTag(child as HTMLElement) === 'legend',
      ) as Node | null,
    )
  )
}

function isElementDisabledByParent(element: HTMLElement, parent: HTMLElement) {
  return (
    isElementDisabled(parent) && !isFirstLegendChildOfFieldset(element, parent)
  )
}

function isElementDisabled(element: HTMLElement) {
  return FORM_TAGS.includes(getTag(element)) && element.hasAttribute('disabled')
}

function isAncestorDisabled(element: HTMLElement): boolean {
  const parent = element!.parentElement!
  return (
    Boolean(parent) &&
    (isElementDisabledByParent(element, parent) || isAncestorDisabled(parent))
  )
}

export function toBeDisabled<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeDisabled, this)

  const isDisabled = isElementDisabled(element) || isAncestorDisabled(element)

  return {
    pass: isDisabled,
    message: () => {
      const is = isDisabled ? 'is' : 'is not'
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeDisabled`,
          'element',
          '',
        ),
        '',
        `Received element ${is} disabled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

export function toBeEnabled<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeEnabled, this)

  const isEnabled = !(isElementDisabled(element) || isAncestorDisabled(element))

  return {
    pass: isEnabled,
    message: () => {
      const is = isEnabled ? 'is' : 'is not'
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeEnabled`,
          'element',
          '',
        ),
        '',
        `Received element ${is} enabled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
