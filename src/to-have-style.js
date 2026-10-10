import pico from 'picocolors'
import {checkHtmlElement, parseCSS} from './utils'

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

function isSubset(styles, computedStyle, element, inlineStyles) {
  return (
    !!Object.keys(styles).length &&
    Object.entries(styles).every(([prop, value]) => {
      const isCustomProperty = prop.startsWith('--')
      const spellingVariants = [prop]
      if (!isCustomProperty) spellingVariants.push(prop.toLowerCase())

      return spellingVariants.some(
        name =>
          computedStyle[name] === value ||
          computedStyle.getPropertyValue(name) === value ||
          // getComputedStyle() silently drops CSS properties the environment
          // doesn't implement (e.g. aspect-ratio in jsdom). Fall back to the
          // element's own style declaration, but only for properties the
          // computed style doesn't know at all, so known properties keep
          // their existing semantics.
          (computedStyle[name] === undefined &&
            computedStyle.getPropertyValue(name) === '' &&
            getOwnStyleValue(element, name, inlineStyles) === value),
      )
    })
  )
}

// Reads a style property from the element's own style declaration, trying the
// dash-cased and camelCased spellings. Used as a fallback for CSS properties
// the environment doesn't implement (e.g. aspect-ratio), which neither
// getComputedStyle() nor the element's parsed style declaration report.
function getOwnStyleValue(element, property, inlineStyles) {
  const candidates = [
    property,
    property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
    property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`),
  ]
  for (const candidate of candidates) {
    const value = element.style[candidate]
    if (value) return value
  }
  for (const candidate of candidates) {
    if (inlineStyles[candidate] !== undefined) return inlineStyles[candidate]
  }
  return undefined
}

// Parses the element's raw style attribute without throwing: the DOM has
// already parsed it once, so a failure here is unexpected.
function parseInlineStyle(element, matcherContext) {
  try {
    return parseCSS(
      element.getAttribute('style') || '',
      toHaveStyle,
      matcherContext,
    )
  } catch {
    return {}
  }
}

function printoutStyles(styles) {
  return Object.keys(styles)
    .sort()
    .map(prop => `${prop}: ${styles[prop]};`)
    .join('\n')
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(diffFn, expected, computedStyles) {
  const received = Array.from(computedStyles)
    .filter(prop => expected[prop] !== undefined)
    .reduce(
      (obj, prop) =>
        Object.assign(obj, {[prop]: computedStyles.getPropertyValue(prop)}),
      {},
    )
  const diffOutput = diffFn(printoutStyles(expected), printoutStyles(received))
  // Remove the "+ Received" annotation because this is a one-way diff
  return diffOutput.replace(`${pico.red('+ Received')}\n`, '')
}

export function toHaveStyle(htmlElement, css) {
  checkHtmlElement(htmlElement, toHaveStyle, this)
  const parsedCSS =
    typeof css === 'object' ? css : parseCSS(css, toHaveStyle, this)
  const {getComputedStyle} = htmlElement.ownerDocument.defaultView

  const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS)
  const received = getComputedStyle(htmlElement)
  // getComputedStyle() drops CSS properties the environment doesn't implement
  // (e.g. aspect-ratio in jsdom); the element's own style attribute is the
  // fallback source for those.
  const inlineStyles = parseInlineStyle(htmlElement, this)

  return {
    pass: isSubset(expected, received, htmlElement, inlineStyles),
    message: () => {
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`
      return [
        this.utils.matcherHint(matcher, 'element', ''),
        expectedDiff(this.utils.diff, expected, received),
      ].join('\n\n')
    },
  }
}
