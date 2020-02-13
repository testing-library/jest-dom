import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

// form elements that support 'readonly'
const FORM_TAGS = ['input', 'textarea']

function isElementReadonly(element) {
  return FORM_TAGS.includes(getTag(element)) && element.hasAttribute('readonly')
}

export function toBeReadonly(element) {
  checkHtmlElement(element, toBeReadonly, this)

  const isReadonly = isElementReadonly(element)

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

export function toBeWritable(element) {
  checkHtmlElement(element, toBeWritable, this)

  const isWritable = !isElementReadonly(element)

  return {
    pass: isWritable,
    message: () => {
      const is = isWritable ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeWritable`, 'element', ''),
        '',
        `Received element ${is} writable:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
