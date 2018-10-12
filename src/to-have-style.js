import {matcherHint} from 'jest-matcher-utils'
import jestDiff from 'jest-diff'
import chalk from 'chalk'
import {checkHtmlElement, checkValidCSS} from './utils'

function getStyleDeclaration(document, css) {
  const copy = document.createElement('div')
  copy.style = css
  const styles = copy.style

  return Array.from(styles).reduce(
    (acc, name) => ({...acc, [name]: styles[name]}),
    {},
  )
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
  checkHtmlElement(htmlElement, toHaveStyle, this)
  checkValidCSS(css, toHaveStyle, this)
  const {getComputedStyle} = htmlElement.ownerDocument.defaultView

  const expected = getStyleDeclaration(htmlElement.ownerDocument, css)
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
