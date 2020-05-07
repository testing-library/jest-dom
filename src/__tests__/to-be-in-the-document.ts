import {HtmlElementTypeError} from '../utils'
import document from './helpers/document'

test('.toBeInTheDocument', () => {
  document.body.innerHTML = `
    <span data-testid="html-element"><span>Html Element</span></span>
    <svg data-testid="svg-element"></svg>`

  const htmlElement = document.querySelector('[data-testid="html-element"]')
  const svgElement = document.querySelector('[data-testid="svg-element"]')
  const detachedElement = document.createElement('div')
  const fakeElement = {thisIsNot: 'an html element'}
  const undefinedElement = undefined
  const nullElement = null

  expect(htmlElement).toBeInTheDocument()
  expect(svgElement).toBeInTheDocument()
  expect(detachedElement).not.toBeInTheDocument()
  expect(nullElement).not.toBeInTheDocument()

  // negative test cases wrapped in throwError assertions for coverage.
  const expectToBe = /expect.*\.toBeInTheDocument/
  const expectNotToBe = /expect.*not\.toBeInTheDocument/
  expect(() => expect(htmlElement).not.toBeInTheDocument()).toThrowError(
    expectNotToBe,
  )
  expect(() => expect(svgElement).not.toBeInTheDocument()).toThrowError(
    expectNotToBe,
  )
  expect(() => expect(detachedElement).toBeInTheDocument()).toThrowError(
    expectToBe,
  )
  expect(() => expect(fakeElement).toBeInTheDocument()).toThrowError(
    HtmlElementTypeError,
  )
  expect(() => expect(nullElement).toBeInTheDocument()).toThrowError(
    HtmlElementTypeError,
  )
  expect(() => expect(undefinedElement).toBeInTheDocument()).toThrowError(
    HtmlElementTypeError,
  )
  expect(() => expect(undefinedElement).not.toBeInTheDocument()).toThrowError(
    HtmlElementTypeError,
  )
})
