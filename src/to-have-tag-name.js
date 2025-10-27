import {checkHtmlElement, getMessage} from './utils'

export function toHaveTagName(htmlElement, expectedTagName) {
  checkHtmlElement(htmlElement, toHaveTagName, this)

  if (!isValidTagName(expectedTagName)) {
    throw new Error(
      `Expected tag name must be a single lowercase word, got ${expectedTagName}`,
    )
  }

  const actualTagName = htmlElement.tagName.toLowerCase()
  const pass = expectedTagName === actualTagName

  return {
    pass,

    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.${toHaveTagName.name}`,
          'element',
          '',
        ),
        `Expected element ${to} have tag name`,
        expectedTagName,
        'Received',
        actualTagName,
      )
    },
  }
}

function isValidTagName(value) {
  return typeof value === 'string' && /^[a-z]+$/.test(value)
}
