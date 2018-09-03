import {toBeInTheDOM as toBeInTheDOMDirect} from './to-be-in-the-dom'
import {toBeInTheDocument as toBeInTheDocumentDirect} from './to-be-in-the-document'
import {toBeEmpty as toBeEmptyDirect} from './to-be-empty'
import {toContainElement as toContainElementDirect} from './to-contain-element'
import {toContainHTML as toContainHTMLDirect} from './to-contain-html'
import {toHaveTextContent as toHaveTextContentDirect} from './to-have-text-content'
import {toHaveAttribute as toHaveAttributeDirect} from './to-have-attribute'
import {toHaveClass as toHaveClassDirect} from './to-have-class'
import {toHaveStyle as toHaveStyleDirect} from './to-have-style'
import {toHaveFocus as toHaveFocusDirect} from './to-have-focus'
import {toBeVisible as toBeVisibleDirect} from './to-be-visible'
import {toBeDisabled as toBeDisabledDirect} from './to-be-disabled'
import {withNodeList} from './with-node-list'

const toBeInTheDOM = withNodeList(toBeInTheDOMDirect)
const toBeInTheDocument = withNodeList(toBeInTheDocumentDirect)
const toBeEmpty = withNodeList(toBeEmptyDirect)
const toContainElement = withNodeList(toContainElementDirect)
const toContainHTML = withNodeList(toContainHTMLDirect)
const toHaveTextContent = withNodeList(toHaveTextContentDirect)
const toHaveAttribute = withNodeList(toHaveAttributeDirect)
const toHaveClass = withNodeList(toHaveClassDirect)
const toHaveStyle = withNodeList(toHaveStyleDirect)
const toHaveFocus = withNodeList(toHaveFocusDirect)
const toBeVisible = withNodeList(toBeVisibleDirect)
const toBeDisabled = withNodeList(toBeDisabledDirect)

export {
  toBeInTheDOM,
  toBeInTheDocument,
  toBeEmpty,
  toContainElement,
  toContainHTML,
  toHaveTextContent,
  toHaveAttribute,
  toHaveClass,
  toHaveStyle,
  toHaveFocus,
  toBeVisible,
  toBeDisabled,
}
