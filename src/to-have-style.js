import {matcherHint} from 'jest-matcher-utils'
import jestDiff from 'jest-diff'
import chalk from 'chalk'
import {checkHtmlElement, parseCSS, parseJStoCSS} from './utils'

function getStyleDeclaration(document, css) {
  const styles = {}

  // The next block is necessary to normalize colors
  const copy = document.createElement('div')
  Object.keys(css).forEach(property => {
    copy.style[property] = css[property]
    styles[property] = copy.style[property]
  })

  return styles
}

function isSubset(styles, computedStyle) {
  return (
    !!Object.keys(styles).length &&
    Object.entries(styles).every(
      ([prop, value]) =>
        computedStyle.getPropertyValue(prop.toLowerCase()) === value,
    )
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

function getCSStoParse(document, css) {
  return typeof css === 'object' ? parseJStoCSS(document, css) : css
}

export function toHaveStyle(htmlElement, css) {
  checkHtmlElement(htmlElement, toHaveStyle, this)
  const cssToParse = getCSStoParse(htmlElement.ownerDocument, css)
  const parsedCSS = parseCSS(cssToParse, toHaveStyle, this)
  const {getComputedStyle} = htmlElement.ownerDocument.defaultView

  const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS)
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
