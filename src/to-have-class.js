import {checkHtmlElement, getMessage} from './utils'

function getExpectedClassNamesAndOptions(params) {
  const lastParam = params.pop()
  let expectedClassNames, options

  if (typeof lastParam === 'object' && !(lastParam instanceof RegExp)) {
    expectedClassNames = params
    options = lastParam
  } else {
    expectedClassNames = params.concat(lastParam)
    options = {exact: false}
  }
  return {expectedClassNames, options}
}

function splitClassNames(str) {
  if (!str) return []
  return str.split(/\s+/).filter(s => s.length > 0)
}

function isSubset(subset, superset) {
  return subset.every(strOrRegexp =>
    typeof strOrRegexp === 'string'
      ? superset.includes(strOrRegexp)
      : superset.some(className => strOrRegexp.test(className)),
  )
}

export function toHaveClass(htmlElement, ...params) {
  checkHtmlElement(htmlElement, toHaveClass, this)
  const {expectedClassNames, options} = getExpectedClassNamesAndOptions(params)

  const received = splitClassNames(htmlElement.getAttribute('class'))
  const expected = expectedClassNames.reduce(
    (acc, className) =>
      acc.concat(
        typeof className === 'string' || !className
          ? splitClassNames(className)
          : className,
      ),
    [],
  )

  const hasRegExp = expected.some(className => className instanceof RegExp)
  if (options.exact && hasRegExp) {
    throw new Error('Exact option does not support RegExp expected class names')
  }

  if (options.exact) {
    return {
      pass: isSubset(expected, received) && expected.length === received.length,
      message: () => {
        const to = this.isNot ? 'not to' : 'to'
        return getMessage(
          this,
          this.utils.matcherHint(
            `${this.isNot ? '.not' : ''}.toHaveClass`,
            'element',
            this.utils.printExpected(expected.join(' ')),
          ),
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
            this,
            this.utils.matcherHint(
              `${this.isNot ? '.not' : ''}.toHaveClass`,
              'element',
              this.utils.printExpected(expected.join(' ')),
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
                this,
                this.utils.matcherHint('.not.toHaveClass', 'element', ''),
                'Expected the element to have classes',
                '(none)',
                'Received',
                received.join(' '),
              )
            : [
                this.utils.matcherHint(`.toHaveClass`, 'element'),
                'At least one expected class must be provided.',
              ].join('\n'),
      }
}
