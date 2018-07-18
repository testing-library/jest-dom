test('.toBeInTheDocument', () => {
  document.body.innerHTML = `
    <span data-testid="html-element"><span>Html Element</span></span>
    <svg data-testid="svg-element"></svg>`

  const htmlElement = document.querySelector('[data-testid="html-element"]')
  const svgElement = document.querySelector('[data-testid="html-element"]')
  const detachedElement = document.createElement('div')
  const fakeElement = {thisIsNot: 'an html element'}
  const undefinedElement = undefined
  const nullElement = null

  expect(htmlElement).toBeInTheDocument()
  expect(svgElement).toBeInTheDocument()
  expect(detachedElement).not.toBeInTheDocument()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(htmlElement).not.toBeInTheDocument()).toThrowError()
  expect(() => expect(svgElement).not.toBeInTheDocument()).toThrowError()
  expect(() => expect(detachedElement).toBeInTheDocument()).toThrowError()
  expect(() => expect(fakeElement).toBeInTheDocument()).toThrowError()
  expect(() => expect(undefinedElement).toBeInTheDocument()).toThrowError()
  expect(() => expect(nullElement).toBeInTheDocument()).toThrowError()
})
