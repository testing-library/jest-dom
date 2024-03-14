import chalk from 'chalk'
import {checkHtmlElement, parseCSS, camelToKebab} from './utils'

/**
 * Set of CSS properties that typically have unitless values.
 * These properties are commonly used in CSS without specifying units such as px, em, etc.
 * This set is used to determine whether a numerical value should have a unit appended to it.
 *
 * Note: This list is based on the `isUnitlessNumber` module from the React DOM package.
 * Source: https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/isUnitlessNumber.js
 */
const unitlessNumbers = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity', // SVG-related properties
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'MozAnimationIterationCount', // Known Prefixed Properties
  'MozBoxFlex', // TODO: Remove these since they shouldn't be used in modern code
  'MozBoxFlexGroup',
  'MozLineClamp',
  'msAnimationIterationCount',
  'msFlex',
  'msZoom',
  'msFlexGrow',
  'msFlexNegative',
  'msFlexOrder',
  'msFlexPositive',
  'msFlexShrink',
  'msGridColumn',
  'msGridColumnSpan',
  'msGridRow',
  'msGridRowSpan',
  'WebkitAnimationIterationCount',
  'WebkitBoxFlex',
  'WebKitBoxFlexGroup',
  'WebkitBoxOrdinalGroup',
  'WebkitColumnCount',
  'WebkitColumns',
  'WebkitFlex',
  'WebkitFlexGrow',
  'WebkitFlexPositive',
  'WebkitFlexShrink',
  'WebkitLineClamp',
])

function isCustomProperty(property) {
  return property.startsWith('--')
}

function isUnitProperty(property, value) {
  if (typeof value !== 'number') {
    return false
  }

  return !unitlessNumbers.has(property)
}

/**
 * Convert a CSS object to a valid style object.
 * This function takes a CSS object and converts it into a valid style object.
 * It transforms camelCase property names to kebab-case and appends 'px' unit to numerical values.
 */
function convertCssObject(css) {
  return Object.entries(css).reduce((obj, [property, value]) => {
    const styleProperty = isCustomProperty(property)
      ? property
      : camelToKebab(property)
    const styleValue = isUnitProperty(property, value) ? `${value}px` : value
    return Object.assign(obj, {
      [styleProperty]: styleValue,
    })
  }, {})
}

function getStyleDeclaration(document, css) {
  const styles = {}

  // The next block is necessary to normalize colors
  const copy = document.createElement('div')
  Object.entries(css).forEach(([property, value]) => {
    copy.style[property] = value
    styles[property] = copy.style[property]
  })
  return styles
}

function isSubset(styles, computedStyle) {
  return (
    !!Object.keys(styles).length &&
    Object.entries(styles).every(([prop, value]) => {
      const spellingVariants = [prop]
      if (!isCustomProperty(prop)) spellingVariants.push(prop.toLowerCase())

      return spellingVariants.some(name => {
        return (
          computedStyle[name] === value ||
          computedStyle.getPropertyValue(name) === value
        )
      })
    })
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
  return diffOutput.replace(`${chalk.red('+ Received')}\n`, '')
}

export function toHaveStyle(htmlElement, css) {
  checkHtmlElement(htmlElement, toHaveStyle, this)
  const parsedCSS =
    typeof css === 'object' ? css : parseCSS(css, toHaveStyle, this)
  const cssObject = convertCssObject(parsedCSS)
  const {getComputedStyle} = htmlElement.ownerDocument.defaultView

  const expected = getStyleDeclaration(htmlElement.ownerDocument, cssObject)
  const received = getComputedStyle(htmlElement)

  return {
    pass: isSubset(expected, received),
    message: () => {
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`
      return [
        this.utils.matcherHint(matcher, 'element', ''),
        expectedDiff(this.utils.diff, expected, received),
      ].join('\n\n')
    },
  }
}
