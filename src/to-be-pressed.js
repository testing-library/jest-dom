import {checkHtmlElement, getMessage} from './utils'

export function toBePressed(element) {
  checkHtmlElement(element, toBePressed, this)

  const roles = (element.getAttribute('role') || '')
    .split(' ')
    .map(role => role.trim())

  const isButton =
    element.tagName.toLowerCase() === 'button' ||
    (element.tagName.toLowerCase() === 'input' && element.type === 'button') ||
    roles.includes('button')

  const pressedAttribute = element.getAttribute('aria-pressed')

  const isValidAriaElement =
    pressedAttribute === 'true' || pressedAttribute === 'false'

  if (!isButton || !isValidAriaElement) {
    return {
      pass: false,
      message: () =>
        `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePressed()`,
    }
  }

  const isPressed = pressedAttribute === 'true'

  return {
    pass: isButton && isPressed,

    message: () => {
      const matcher = this.utils.matcherHint(
        `${this.isNot ? '.not' : ''}.toBePressed`,
        'element',
        '',
      )

      return getMessage(
        this,
        matcher,
        `Expected element to have`,
        `aria-pressed="${this.isNot ? 'false' : 'true'}"`,
        `Received`,
        `aria-pressed="${pressedAttribute}"`,
      )
    },
  }
}
