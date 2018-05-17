import {parse} from 'css'
import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function parseCSS(css) {
  return parse(`selector { ${css} }`)
    .stylesheet.rules[0].declarations.filter(d => d.type === 'declaration')
    .reduce(
      (obj, {property, value}) => Object.assign(obj, {[property]: value}),
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
