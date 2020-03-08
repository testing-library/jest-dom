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

/* eslint-disable valid-jsdoc */
/**
 * @description Check whether the given element has certain classes within its `class` attribute.
 *
 * You must provide at least one class, unless you are asserting that an element does not have any classes.
 * @example
 *  <button
 *    data-testid="delete-button"
 *    class="btn xs btn-danger"
 *  >
 *    delete item
 *  </button>
 *
 *  <div data-testid="no-classes">no classes</div>
 *
 *  const deleteButton = getByTestId('delete-button')
 *  const noClasses = getByTestId('no-classes')
 *  expect(deleteButton).toHaveClass('btn')
 *  expect(deleteButton).toHaveClass('btn-danger xs')
 *  expect(noClasses).not.toHaveClass()
 * @see [github.com/testing-library/jest-dom#tohaveclass](https:github.com/testing-library/jest-dom#tohaveclass)
 */
/* eslint-enable valid-jsdoc */
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
