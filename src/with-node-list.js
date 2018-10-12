// ============================
// NodeList Matcher HOC
// ============================

import {stringify, RECEIVED_COLOR as colorAsError} from 'jest-matcher-utils'
import {getSelectorPath} from 'dom-path-utils'

// ----------------------------
// Generic Utils
// ----------------------------

const conditional = (condition, trueValue, falseValue) =>
  condition ? trueValue : falseValue

// ----------------------------
// Messaging
// ----------------------------

const getMatcherMessage = result => result.message()
const getFirstMatcherMessage = results => getMatcherMessage(results[0])
const getErrorElement = (index, element) =>
  colorAsError(`[${index}] ${element}`)
const getErrorMessage = (index, element, path) =>
  `\t${getErrorElement(index, element)}\n\t${path}\n`

// ----------------------------
// Results Logic
// ----------------------------

const markErrors = nodeList => (result, index) => {
  const element = nodeList[index]

  return conditional(
    result.pass,
    null,
    getErrorMessage(
      index,
      stringify(element.cloneNode(false)),
      getSelectorPath(element, ['id', 'class', 'data-testid']),
    ),
  )
}

const createResults = (results, nodeList, isNot) => {
  const errors = results.map(markErrors(nodeList)).filter(Boolean)
  const allMatchersPassed = isNot
    ? errors.length === results.length
    : errors.length === 0

  // When isNot is set, jest expects a "false" to pass
  const pass = isNot ? !allMatchersPassed : allMatchersPassed

  return {
    pass,
    message: () =>
      `${errors.length} of ${
        results.length
      } NodeList elements failed this test. ${
        errors.length > 3 ? 'Displaying subset of failing elements:' : ''
      } 
      
${errors.slice(0, 3).join(`\n`)}${errors.length > 3 ? '\n\t...\n' : ''}
${colorAsError('Error message for element [0]: \n============================')}

${getFirstMatcherMessage(results)}

${colorAsError('============================')}
`,
  }
}

// ----------------------------
// HOC Matcher Creation
// ----------------------------

function wrapMatcher(matcher, ...rest) {
  return function elementWalker(element) {
    return matcher.call(this, element, ...rest)
  }.bind(this)
}

function nodeListMatcher(matcher) {
  return function matcherParameters(nodeList, ...rest) {
    const wrappedMatcher = wrapMatcher.call(this, matcher, ...rest)

    return createResults(
      Array.prototype.map.call(nodeList, wrappedMatcher),
      nodeList,
      this.isNot,
    )
  }.bind(this)
}

// ----------------------------
// Logic Units
// ----------------------------

const isNodeList = elementSelection =>
  !!elementSelection && elementSelection.constructor.name === 'NodeList'

// ----------------------------
// Main Export
// ----------------------------

export function withNodeList(matcher) {
  return function initialMatcherCall(nodeListOrElement, ...rest) {
    return conditional(
      isNodeList(nodeListOrElement),
      nodeListMatcher.call(this, matcher),
      matcher.bind(this),
    )(nodeListOrElement, ...rest)
  }
}
