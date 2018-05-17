import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function parseCSS(css) {
  const props = css
    .split(/\s*;\s*/)
    .map(str => str.split(':').map(s => s.trim()))
    .filter(prop => prop.length === 2)
  return props.reduce(
    (result, [prop, value]) => Object.assign(result, {[prop]: value}),
    {},
  )
}

function isSubset(styles, computedStyle) {
  return Object.entries(styles).every(([prop, value]) => {
    return computedStyle.getPropertyValue(prop) === value
  })
}

export function toHaveStyle(htmlElement, css) {
  checkHtmlElement(htmlElement)
  const expected = parseCSS(css)
  const received = getComputedStyle(htmlElement)
  return {
    pass: isSubset(expected, received),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        matcherHint(`${this.isNot ? '.not' : ''}.toHaveStyle`, 'element', ''),
        `Expected the element ${to} have style`,
        JSON.stringify(expected),
        'Received',
        JSON.stringify(received),
      )
    },
  }
}
