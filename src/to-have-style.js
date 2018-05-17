import {parse} from 'css'
import {matcherHint} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function parseCSS(css) {
  const ast = parse(`selector { ${css} }`, {
    silent: true,
  }).stylesheet
  if (ast.parsingErrors && ast.parsingErrors.length > 0) {
    const {reason, line, column} = ast.parsingErrors[0]
    return {
      parsingError: `Syntax error parsing expected css: ${reason} in ${line}:${column}`,
    }
  }
  const parsedRules = ast.rules[0].declarations
    .filter(d => d.type === 'declaration')
    .reduce(
      (obj, {property, value}) => Object.assign(obj, {[property]: value}),
      {},
    )
  return {parsedRules}
}

function isSubset(styles, computedStyle) {
  return Object.entries(styles).every(([prop, value]) => {
    return computedStyle.getPropertyValue(prop) === value
  })
}

export function toHaveStyle(htmlElement, css) {
  checkHtmlElement(htmlElement)
  const {parsedRules: expected, parsingError} = parseCSS(css)
  if (parsingError) {
    return {
      pass: this.isNot, // Fail regardless of the test being positive or negative
      message: () => parsingError,
    }
  }
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
