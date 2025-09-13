import {checkHtmlElement} from './utils'

// ref: https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
const DOCUMENT_POSITIONS_STRINGS = {
  [Node.DOCUMENT_POSITION_DISCONNECTED]: 'Node.DOCUMENT_POSITION_DISCONNECTED',
  [Node.DOCUMENT_POSITION_PRECEDING]: 'Node.DOCUMENT_POSITION_PRECEDING',
  [Node.DOCUMENT_POSITION_FOLLOWING]: 'Node.DOCUMENT_POSITION_FOLLOWING',
  [Node.DOCUMENT_POSITION_CONTAINS]: 'Node.DOCUMENT_POSITION_CONTAINS',
  [Node.DOCUMENT_POSITION_CONTAINED_BY]: 'Node.DOCUMENT_POSITION_CONTAINED_BY',
  [Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC]:
    'Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',
}

const makeDocumentPositionErrorString = documentPosition => {
  if (documentPosition in DOCUMENT_POSITIONS_STRINGS) {
    return `${DOCUMENT_POSITIONS_STRINGS[documentPosition]} (${documentPosition})`
  }

  return `Unknown document position (${documentPosition})`
}

const checkToAppear = (methodName, targetDocumentPosition) => {
  // eslint-disable-next-line func-names
  return function (element, secondElement) {
    checkHtmlElement(element, toAppearBefore, this)
    checkHtmlElement(secondElement, toAppearBefore, this)

    const documentPosition = element.compareDocumentPosition(secondElement)
    const pass = documentPosition === targetDocumentPosition

    return {
      pass,
      message: () => {
        return [
          this.utils.matcherHint(
            `${this.isNot ? '.not' : ''}.${methodName}`,
            'element',
            'secondElement',
          ),
          '',
          `Received: ${makeDocumentPositionErrorString(documentPosition)}`,
        ].join('\n')
      },
    }
  }
}

export function toAppearBefore(element, secondElement) {
  return checkToAppear(
    'toAppearBefore',
    Node.DOCUMENT_POSITION_FOLLOWING,
  ).apply(this, [element, secondElement])
}

export function toAppearAfter(element, secondElement) {
  return checkToAppear('toAppearAfter', Node.DOCUMENT_POSITION_PRECEDING).apply(
    this,
    [element, secondElement],
  )
}
