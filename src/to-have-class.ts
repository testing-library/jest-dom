import {matcherHint, printExpected} from 'jest-matcher-utils'
import {checkHtmlElement, getMessage} from './utils'

function getExpectedClassNamesAndOptions(params: string[]) {
  const lastParam = params.pop()!
  let expectedClassNames, options

  if (typeof lastParam === 'object') {
    expectedClassNames = params
    options = lastParam
  } else {
    expectedClassNames = params.concat(lastParam)
    options = {exact: false}
  }
  return {expectedClassNames, options}
}

function splitClassNames(str: string | null) {
  if (!str) {
    return []
  }
  return str.split(/\s+/).filter(s => s.length > 0)
}

function isSubset<T>(subset: T[], superset: T[]) {
  return subset.every(item => superset.includes(item))
}

export function toHaveClass<T>(this: T, ...args: any[]) {
  const context = (this as unknown) as jest.MatcherContext
  const [htmlElement, ...params] = args

  checkHtmlElement(htmlElement, toHaveClass, this)
  const {expectedClassNames, options} = getExpectedClassNamesAndOptions(params)

  const received = splitClassNames(htmlElement.getAttribute('class'))
  const expected = expectedClassNames.reduce(
    (acc, className) => acc.concat(splitClassNames(className)),
    [] as string[],
  )

  if (options.exact) {
    return {
      pass: isSubset(expected, received) && expected.length === received.length,
      message: () => {
        const to = context.isNot ? 'not to' : 'to'
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
          const to = context.isNot ? 'not to' : 'to'
          return getMessage(
            matcherHint(
              `${context.isNot ? '.not' : ''}.toHaveClass`,
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
        pass: context.isNot ? received.length > 0 : false,
        message: () =>
          context.isNot
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
