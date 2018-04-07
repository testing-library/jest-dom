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

export function toHaveClass(htmlElement, expectedClassNames) {
  checkHtmlElement(htmlElement)
  const received = splitClassNames(htmlElement.getAttribute('class'))
  const expected = splitClassNames(expectedClassNames)
  return {
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
}
