import {
  deprecate,
  checkHtmlElement,
  HtmlElementTypeError,
  parseJStoCSS,
} from '../utils'
import document from './helpers/document'

test('deprecate', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const name = 'test'
  const replacement = 'test'
  const message = `Warning: ${name} has been deprecated and will be removed in future updates.`

  deprecate(name, replacement)
  expect(spy).toHaveBeenCalledWith(message, replacement)

  deprecate(name)
  expect(spy).toHaveBeenCalledWith(message, undefined)

  spy.mockRestore()
})

describe('checkHtmlElement', () => {
  it('does not throw an error for correct html element', () => {
    expect(() => {
      const element = document.createElement('p')
      checkHtmlElement(element, () => {}, {})
    }).not.toThrow()
  })

  it('does not throw an error for correct svg element', () => {
    expect(() => {
      const element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      checkHtmlElement(element, () => {}, {})
    }).not.toThrow()
  })

  it('does not throw for body', () => {
    expect(() => {
      checkHtmlElement(document.body, () => {}, {})
    }).not.toThrow()
  })

  it('throws for undefined', () => {
    expect(() => {
      checkHtmlElement(undefined, () => {}, {})
    }).toThrow(HtmlElementTypeError)
  })

  it('throws for document', () => {
    expect(() => {
      checkHtmlElement(document, () => {}, {})
    }).toThrow(HtmlElementTypeError)
  })

  it('throws for function', () => {
    expect(() => {
      checkHtmlElement(
        () => {},
        () => {},
        {},
      )
    }).toThrow(HtmlElementTypeError)
  })

  it('throws for almost element-like objects', () => {
    class FakeObject {}
    expect(() => {
      checkHtmlElement(
        {
          ownerDocument: {
            defaultView: {HTMLElement: FakeObject, SVGElement: FakeObject},
          },
        },
        () => {},
        {},
      )
    }).toThrow(HtmlElementTypeError)
  })
})

describe('parseJStoCSS', () => {
  describe('when all the styles are valid', () => {
    it('returns the JS parsed as CSS text', () => {
      expect(
        parseJStoCSS(document, {
          backgroundColor: 'blue',
          height: '100%',
        }),
      ).toBe('background-color: blue; height: 100%;')
    })
  })

  describe('when some style is invalid', () => {
    it('returns the JS parsed as CSS text without the invalid style', () => {
      expect(
        parseJStoCSS(document, {
          backgroundColor: 'blue',
          whatever: 'anything',
        }),
      ).toBe('background-color: blue;')
    })
  })

  describe('when all the styles are invalid', () => {
    it('returns an empty string', () => {
      expect(
        parseJStoCSS(document, {
          whatever: 'anything',
        }),
      ).toBe('')
    })
  })
})
