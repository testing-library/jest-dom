import {roles} from 'aria-query'
import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, toSentence} from './utils'

export function toBeChecked(element) {
  checkHtmlElement(element, toBeChecked, this)

  const isValidInput = () => {
    return (
      element.tagName.toLowerCase() === 'input' &&
      ['checkbox', 'radio'].includes(element.type)
    )
  }

  const isValidAriaElement = () => {
    return (
      roleSupportsChecked(element.getAttribute('role')) &&
      ['true', 'false'].includes(element.getAttribute('aria-checked'))
    )
  }

  if (!isValidInput() && !isValidAriaElement()) {
    return {
      pass: false,
      message: () =>
        `only inputs with type="checkbox" or type="radio" or elements with ${supportedRolesSentence()} and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead`,
    }
  }

  const isChecked = () => {
    if (isValidInput()) return element.checked
    return element.getAttribute('aria-checked') === 'true'
  }

  return {
    pass: isChecked(),
    message: () => {
      const is = isChecked() ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'element', ''),
        '',
        `Received element ${is} checked:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}

function supportedRolesSentence() {
  return toSentence(
    supportedRoles().map(role => `role="${role}"`),
    {lastWordConnector: ' or '},
  )
}

function supportedRoles() {
  return Array.from(roles.keys()).filter(roleSupportsChecked)
}

function roleSupportsChecked(role) {
  return roles.get(role)?.props['aria-checked'] !== undefined
}
