const createErrorMessage = error => {
  return `[${error.index}] ${error.element}`
}

const displayResults = (results, nodeList) => {
  const originalMessage = results[0].message

  const errors = results
    .map((result, index) => {
      return result.pass
        ? null
        : {
            index,
            element: nodeList[index].cloneNode(false),
          }
    })
    .filter(Boolean)

  return {
    pass: errors.length === 0,
    message: `The following elements failed:\n\n${errors
      .map(createErrorMessage)
      .join(`\n`)}\n\n${originalMessage}`,
  }
}

const createNodeListTest = callback => element => callback.bind(null, element)

const nodeListCallback = callback => (nodeList, ...rest) => {
  const matchers = Array.prototype.map.call(
    nodeList,
    createNodeListTest(callback),
  )
  const results = matchers.map(matcher => matcher(...rest))

  return displayResults(results, nodeList)
}

const isNodeList = nodeList => nodeList instanceof NodeList

export const withNodeList = elementCallback => (nodeListOrElement, ...rest) =>
  isNodeList(nodeListOrElement)
    ? nodeListCallback(elementCallback)(nodeListOrElement, ...rest)
    : elementCallback(nodeListOrElement, ...rest)
