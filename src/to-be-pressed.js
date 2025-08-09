import {checkHtmlElement, getMessage} from './utils'

export function toBePressed(element) {
  checkHtmlElement(element, toBePressed, this)

  const isButton = () => {
    return (
      element.tagName.toLowerCase() === 'button' ||
      element.getAttribute('role') === 'button' ||
      (element.tagName.toLowerCase() === 'input' && element.type === 'button')
    )
  }

  const isValidAriaElement = () => {
    const ariaPressed = element.getAttribute('aria-pressed')

    if (ariaPressed === 'true' || ariaPressed === 'false') {
      return true
    }

    return false
  }

  if (!isButton() || !isValidAriaElement()) {
    return {
      pass: false,
      message: () =>
        `Only button or input with type="button" or element with role="button" and a valid aria-pressed attribute can be used with .toBePressed()`,
    }
  }

  const isPressed = () => {
    return element.getAttribute('aria-pressed') === 'true'
  }

  return {
    pass: isButton() && isPressed(),

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
        `aria-pressed="${element.getAttribute('aria-pressed')}"`,
      )
    },
  }
}
