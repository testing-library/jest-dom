import {matcherHint, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function getExpectedClassNamesAndOptions(params) {
  const lastParam = params.pop()
  let expectedClassNames, options

  if (typeof lastParam === 'object') {
    expectedClassNames = params
    options = lastParam
  } else {
    expectedClassNames = params.concat(lastParam)
    options = { exact: false }
  }
  return {expectedClassNames, options}
}

function splitClassNames(str) {
  if (!str) {
    return []
  }
  return str.split(/\s+/).filter(s => s.length > 0)
}

function isSubset(subset, superset) {
  return subset.every(item => superset.includes(item))
}

export function toHaveClass(htmlElement, ...params) {
  checkHtmlElement(htmlElement, toHaveClass, this)
  const {expectedClassNames, options} = getExpectedClassNamesAndOptions(params)

  const received = splitClassNames(htmlElement.getAttribute('class'))
  const expected = expectedClassNames.reduce(
    (acc, className) => acc.concat(splitClassNames(className)),
    [],
  )

  if (options.exact) {
    return {
      pass: isSubset(expected, received) && expected.length === received.length,
      message: () => {
        const to = this.isNot ? 'not to' : 'to'
        return getMessage(
          `Expected the element ${to} have EXACTLY defined classes`,
          expected.join(' '),
          'Received',
          received.join(' '),
        )
      },
    }
  }

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
        pass: this.isNot ? received.length > 0 : false,
        message: () =>
          this.isNot
            ? getMessage(
                matcherHint('.not.toHaveClass', 'element', ''),
                'Expected the element to have classes',
                '(none)',
                'Received',
                received.join(' '),
              )
            : [
                matcherHint(`.toHaveClass`, 'element'),
                'At least one expected class must be provided.',
              ].join('\n'),
      }
}
