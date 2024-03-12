import {checkHtmlElement, getTag} from './utils'

// form elements that support 'required'
const FORM_TAGS = ['select', 'textarea']

const UNSUPPORTED_INPUT_TYPES = [
  'color',
  'hidden',
  'range',
  'submit',
  'image',
  'reset',
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
    element.getAttribute('aria-required') === 'true'
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
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeRequired`,
          'element',
          '',
        ),
        '',
        `Received element ${is} required:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
