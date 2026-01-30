import {checkHtmlElement, getMessage} from './utils'

export function toBePartiallyPressed(element) {
  checkHtmlElement(element, toBePartiallyPressed, this)

  const roles = (element.getAttribute('role') || '')
    .split(' ')
    .map(role => role.trim())

  const isButton =
    element.tagName.toLowerCase() === 'button' ||
    (element.tagName.toLowerCase() === 'input' && element.type === 'button') ||
    roles.includes('button')

  const pressedAttribute = element.getAttribute('aria-pressed')

  const isValidAriaElement =
    pressedAttribute === 'true' ||
    pressedAttribute === 'false' ||
    pressedAttribute === 'mixed'

  if (!isButton || !isValidAriaElement) {
    return {
      pass: false,
      message: () =>
        `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePartiallyPressed()`,
    }
  }

  const isPartiallyPressed = pressedAttribute === 'mixed'

  return {
    pass: isButton && isPartiallyPressed,

    message: () => {
      const to = this.isNot ? 'not to' : 'to'

      const matcher = this.utils.matcherHint(
        `${this.isNot ? '.not' : ''}.toBePartiallyPressed`,
        'element',
        '',
      )

      return getMessage(
        this,
        matcher,
        `Expected element ${to} have`,
        `aria-pressed="mixed"`,
        `Received`,
        `aria-pressed="${pressedAttribute}"`,
      )
    },
  }
}
