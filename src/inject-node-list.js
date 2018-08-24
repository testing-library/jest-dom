// ============================
// NodeList Matcher HOC
// ============================

// ----------------------------
// Generic Utils
// ----------------------------

const conditional = (condition, trueValue, falseValue) =>
  condition ? trueValue : falseValue

// ----------------------------
// Messaging
// ----------------------------

const getMatcherMessage = result => result.message
const getFirstMatcherMessage = results => getMatcherMessage(results[0])

const getErrorMessage = (index, element) => `[${index}] ${element}`

// ----------------------------
// Results Logic
// ----------------------------

const markErrors = nodeList => (result, index) =>
  conditional(
    result.pass,
    null,
    getErrorMessage(index, nodeList[index].cloneNode(false)),
  )

const createResults = (results, nodeList) => {
  const errors = results.map(markErrors(nodeList)).filter(Boolean)

  return {
    pass: errors.length === 0,
    message: `The following elements failed:\n\n${errors.join(
      `\n`,
    )}\n\n${getFirstMatcherMessage(nodeList)}`,
  }
}

// ----------------------------
// HOC Matcher Creation
// ----------------------------

const createMatcher = matcher => element => matcher.bind(null, element)

const nodeListMatcher = matcher => (nodeList, ...rest) => {
  return createResults(
    Array.prototype.map.call(nodeList, createMatcher(matcher)(...rest)),
    nodeList,
  )
}

// ----------------------------
// Logic Units
// ----------------------------

const isNodeList = nodeList => nodeList instanceof NodeList

// ----------------------------
// Main Export
// ----------------------------

export const withNodeList = matcher => (nodeListOrElement, ...rest) =>
  conditional(isNodeList(nodeListOrElement), nodeListMatcher(matcher), matcher)(
    nodeListOrElement,
    ...rest,
  )
