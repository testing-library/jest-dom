import {parse} from 'css'
import {matcherHint} from 'jest-matcher-utils'
import jestDiff from 'jest-diff'
import chalk from 'chalk'
import {checkHtmlElement} from './utils'

function parseCSS(css) {
  const ast = parse(`selector { ${css} }`, {silent: true}).stylesheet
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
  return Object.entries(styles).every(
    ([prop, value]) => computedStyle.getPropertyValue(prop) === value,
  )
}

function printoutStyles(styles) {
  return Object.keys(styles)
    .sort()
    .map(prop => `${prop}: ${styles[prop]};`)
    .join('\n')
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(expected, computedStyles) {
  const received = Array.from(computedStyles)
    .filter(prop => expected[prop])
    .reduce(
      (obj, prop) =>
        Object.assign(obj, {[prop]: computedStyles.getPropertyValue(prop)}),
      {},
    )
  const diffOutput = jestDiff(
    printoutStyles(expected),
    printoutStyles(received),
  )
  // Remove the "+ Received" annotation because this is a one-way diff
  return diffOutput.replace(`${chalk.red('+ Received')}\n`, '')
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
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`
      return [
        matcherHint(matcher, 'element', ''),
        expectedDiff(expected, received),
      ].join('\n\n')
    },
  }
}
