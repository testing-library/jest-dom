import {matcherHint, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function splitClassNames(str) {
  if (!str) {
    return []
  }
  return str.split(/\s+/).filter(s => s.length > 0)
}

function isSubset(subset, superset) {
  return subset.every(item => superset.includes(item))
}

export function toHaveClass(htmlElement, ...expectedClassNames) {
  checkHtmlElement(htmlElement, toHaveClass, this)
  const received = splitClassNames(htmlElement.getAttribute('class'))
  const expected = expectedClassNames.reduce(
    (acc, className) => acc.concat(splitClassNames(className)),
    [],
  )
  return expected.length > 0
    ? {
        pass: isSubset(expected, received),
        message: () => {
          const to = this.isNot ? 'not to' : 'to'
          return getMessage(
            matcherHint(
              `${this.isNot ? '.not' : ''}.toHaveClass`,
              'element',
              printExpected(expected.join(' ')),
            ),
            `Expected the element ${to} have class`,
            expected.join(' '),
            'Received',
            received.join(' '),
          )
        },
      }
    : {
        pass: this.isNot,
        message: () =>
          [
            matcherHint(`${this.isNot ? '.not' : ''}.toHaveClass`, 'element'),
            'At least one expected class must be provided.',
          ].join('\n'),
      }
}
