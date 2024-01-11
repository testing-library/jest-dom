import {prettyDOM, queries} from '@testing-library/dom'
import {checkHtmlElement, getMessage} from './utils'

/**
 * The list of supported query names. These must match the plain English used
 * by Testing Library (e.g. "by role", "by test ID"). Each name is converted to
 * PascalCase to derive the matcher names `toContainAnyBy${PascalCase}` and
 * `toContainOneBy${PascalCase}`, as well as look up the query function
 * `queryAllBy${PascalCase}`.
 */
const queryNames = [
  'alt text',
  'display value',
  'label text',
  'placeholder text',
  'role',
  'test ID',
  'text',
  'title',
]

function isString(value) {
  return typeof value === 'string'
}

function toPascalCase(value) {
  return value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Factory that creates an expect matcher function for the given DOM query.
 * @param {'Any'|'One'} quantity Whether to match any or one element.
 * @param {string} queryName The display name of the query. The matcher name
 * and query function will be derived from this value.
 * @returns {Function} The matcher function.
 */
function createQueryMatcher(quantity, queryName) {
  const strategy = toPascalCase(queryName)
  const matcherName = `toContain${quantity}By${strategy}`
  const query = queries[`queryAllBy${strategy}`]

  function queryMatcher(actual, ...args) {
    checkHtmlElement(actual, queryMatcher, this)
    const elements = query(actual, ...args)
    const pass =
      quantity === 'One' ? elements.length === 1 : elements.length > 0

    return {
      message: () => {
        const to = this.isNot ? 'not to' : 'to'
        const hint = this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.${matcherName}`,
          'element',
          queryName,
          {
            secondArgument:
              args[1] === undefined
                ? undefined
                : this.utils.printExpected(args[1]),
          },
        )
        const parts = [
          getMessage(
            this,
            hint,
            `Expected element ${to} contain ${quantity.toLowerCase()} descendant by ${queryName}`,
            args[0],
            'Received',
            elements.length,
          ),
        ]
        const prettyElements = elements
          .map(element => prettyDOM(element))
          .filter(isString)

        if (prettyElements.length) {
          parts.push('Here are the matching elements:', ...prettyElements)
        }

        return parts.join('\n\n')
      },
      pass,
    }
  }

  // The function's .name must align with the matcher for the checkHtmlElement
  // hint to render correctly.
  Object.defineProperty(queryMatcher, 'name', {
    value: matcherName,
  })

  return queryMatcher
}

export const queryMatchers = queryNames.reduce((matchers, queryName) => {
  const anyMatcher = createQueryMatcher('Any', queryName)
  const oneMatcher = createQueryMatcher('One', queryName)

  matchers[anyMatcher.name] = anyMatcher
  matchers[oneMatcher.name] = oneMatcher

  return matchers
}, {})
