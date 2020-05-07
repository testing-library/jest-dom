import {matcherHint} from 'jest-matcher-utils'
import jestDiff from 'jest-diff'
import chalk from 'chalk'
import {checkHtmlElement, parseCSS, parseJStoCSS} from './utils'
import {Declaration} from 'css'

function getStyleDeclaration(document: Document, css: Declaration) {
  const styles: Record<string, string> = {}

  // The next block is necessary to normalize colors
  const copy = document.createElement('div')
  Object.keys(css).forEach(property => {
    // @ts-ignore
    copy.style[property] = css[property]
    // @ts-ignore
    styles[property] = copy.style[property]
  })

  return styles
}

function isSubset(
  styles: Record<string, string>,
  computedStyle: CSSStyleDeclaration,
) {
  return (
    !!Object.keys(styles).length &&
    Object.entries(styles).every(
      ([prop, value]) =>
        computedStyle.getPropertyValue(prop.toLowerCase()) === value,
    )
  )
}

function printoutStyles(styles: Record<string, string>) {
  return Object.keys(styles)
    .sort()
    .map(prop => `${prop}: ${styles[prop]};`)
    .join('\n')
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(
  expected: Record<string, string>,
  computedStyles: CSSStyleDeclaration,
) {
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
  return diffOutput!.replace(`${chalk.red('+ Received')}\n`, '')
}

function getCSStoParse(
  document: Document,
  css: string | Partial<CSSStyleDeclaration>,
) {
  return typeof css === 'object' ? parseJStoCSS(document, css) : css
}

export function toHaveStyle<T>(
  this: T,
  _css: string | Partial<CSSStyleDeclaration>,
) {
  const context = (this as unknown) as jest.MatcherContext
  const htmlElement = arguments[0] as HTMLElement
  const css = arguments[1] as string | Partial<CSSStyleDeclaration>

  checkHtmlElement(htmlElement, toHaveStyle, this)
  const cssToParse = getCSStoParse(htmlElement.ownerDocument!, css)
  const parsedCSS = parseCSS(cssToParse, toHaveStyle, context)
  const {getComputedStyle} = htmlElement.ownerDocument!.defaultView!

  const expected = getStyleDeclaration(htmlElement.ownerDocument!, parsedCSS)
  const received = getComputedStyle(htmlElement)

  return {
    pass: isSubset(expected, received),
    message: () => {
      const matcher = `${context.isNot ? '.not' : ''}.toHaveStyle`
      return [
        matcherHint(matcher, 'element', ''),
        expectedDiff(expected, received),
      ].join('\n\n')
    },
  }
}
