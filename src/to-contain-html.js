import {checkHtmlElement} from './utils'

function sortAttributes(root) {
  const elements = [root, ...root.querySelectorAll('*')]
  for (const el of elements) {
    if (!el.attributes || el.attributes.length < 2) continue
    const attrs = Array.from(el.attributes).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    for (const attr of attrs) {
      el.removeAttribute(attr.name)
    }
    for (const attr of attrs) {
      el.setAttribute(attr.name, attr.value)
    }
  }
}

function getNormalizedHtml(container, htmlText) {
  const div = container.ownerDocument.createElement('div')
  div.innerHTML = htmlText
  // Sort attributes so order differences do not affect matching or messages
  sortAttributes(div)
  return div.innerHTML
}

export function toContainHTML(container, htmlText) {
  checkHtmlElement(container, toContainHTML, this)

  if (typeof htmlText !== 'string') {
    throw new Error(`.toContainHTML() expects a string value, got ${htmlText}`)
  }

  const normalizedContainerHtml = getNormalizedHtml(
    container,
    container.outerHTML,
  )
  const normalizedHtmlText = getNormalizedHtml(container, htmlText)

  return {
    pass: normalizedContainerHtml.includes(normalizedHtmlText),
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toContainHTML`,
          'element',
          '',
        ),
        'Expected:',
        // eslint-disable-next-line new-cap
        `  ${this.utils.EXPECTED_COLOR(normalizedHtmlText)}`,
        'Received:',
        // eslint-disable-next-line new-cap
        `  ${this.utils.RECEIVED_COLOR(normalizedContainerHtml)}`,
      ].join('\n')
    },
  }
}
