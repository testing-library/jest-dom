import {checkHtmlElement} from './utils'

// ref: https://dom.spec.whatwg.org/#dom-node-document_position_disconnected
const DOCUMENT_POSITION_DISCONNECTED = 0x01
const DOCUMENT_POSITION_PRECEDING = 0x02
const DOCUMENT_POSITION_FOLLOWING = 0x04
const DOCUMENT_POSITION_CONTAINS = 0x08
const DOCUMENT_POSITION_CONTAINED_BY = 0x10
const DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20

// ref: https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
const DOCUMENT_POSITIONS_STRINGS = {
  [DOCUMENT_POSITION_DISCONNECTED]: 'Node.DOCUMENT_POSITION_DISCONNECTED',
  [DOCUMENT_POSITION_PRECEDING]: 'Node.DOCUMENT_POSITION_PRECEDING',
  [DOCUMENT_POSITION_FOLLOWING]: 'Node.DOCUMENT_POSITION_FOLLOWING',
  [DOCUMENT_POSITION_CONTAINS]: 'Node.DOCUMENT_POSITION_CONTAINS',
  [DOCUMENT_POSITION_CONTAINED_BY]: 'Node.DOCUMENT_POSITION_CONTAINED_BY',
  [DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC]:
    'Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',
}

function makeDocumentPositionErrorString(documentPosition) {
  if (documentPosition in DOCUMENT_POSITIONS_STRINGS) {
    return `${DOCUMENT_POSITIONS_STRINGS[documentPosition]} (${documentPosition})`
  }

  return `Unknown document position (${documentPosition})`
}

function checkToAppear(methodName, targetDocumentPosition) {
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
  return checkToAppear('toAppearBefore', DOCUMENT_POSITION_FOLLOWING).apply(
    this,
    [element, secondElement],
  )
}

export function toAppearAfter(element, secondElement) {
  return checkToAppear('toAppearAfter', DOCUMENT_POSITION_PRECEDING).apply(
    this,
    [element, secondElement],
  )
}
