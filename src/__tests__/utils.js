import {
  deprecate,
  checkHtmlElement,
  checkNode,
  HtmlElementTypeError,
  NodeTypeError,
  toSentence,
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
  let assertionContext
  beforeAll(() => {
    expect.extend({
      fakeMatcher() {
        assertionContext = this

        return {pass: true}
      },
    })

    expect(true).fakeMatcher(true)
  })
  it('does not throw an error for correct html element', () => {
    expect(() => {
      const element = document.createElement('p')
      checkHtmlElement(element, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('does not throw an error for correct svg element', () => {
    expect(() => {
      const element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      checkHtmlElement(element, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('does not throw for body', () => {
    expect(() => {
      checkHtmlElement(document.body, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('throws for undefined', () => {
    expect(() => {
      checkHtmlElement(undefined, () => {}, assertionContext)
    }).toThrow(HtmlElementTypeError)
  })

  it('throws for document', () => {
    expect(() => {
      checkHtmlElement(document, () => {}, assertionContext)
    }).toThrow(HtmlElementTypeError)
  })

  it('throws for function', () => {
    expect(() => {
      checkHtmlElement(
        () => {},
        () => {},
        assertionContext,
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
        assertionContext,
      )
    }).toThrow(HtmlElementTypeError)
  })
})

describe('checkNode', () => {
  let assertionContext
  beforeAll(() => {
    expect.extend({
      fakeMatcher() {
        assertionContext = this

        return {pass: true}
      },
    })

    expect(true).fakeMatcher(true)
  })
  it('does not throw an error for correct html element', () => {
    expect(() => {
      const element = document.createElement('p')
      checkNode(element, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('does not throw an error for correct svg element', () => {
    expect(() => {
      const element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      checkNode(element, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('does not throw an error for Document fragments', () => {
    expect(() => {
      const fragment = document.createDocumentFragment()
      checkNode(fragment, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('does not throw an error for text nodes', () => {
    expect(() => {
      const text = document.createTextNode('foo')
      checkNode(text, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('does not throw for body', () => {
    expect(() => {
      checkNode(document.body, () => {}, assertionContext)
    }).not.toThrow()
  })

  it('throws for undefined', () => {
    expect(() => {
      checkNode(undefined, () => {}, assertionContext)
    }).toThrow(NodeTypeError)
  })

  it('throws for document', () => {
    expect(() => {
      checkNode(document, () => {}, assertionContext)
    }).toThrow(NodeTypeError)
  })

  it('throws for function', () => {
    expect(() => {
      checkNode(
        () => {},
        () => {},
        assertionContext,
      )
    }).toThrow(NodeTypeError)
  })

  it('throws for almost element-like objects', () => {
    class FakeObject {}
    expect(() => {
      checkNode(
        {
          ownerDocument: {
            defaultView: {Node: FakeObject, SVGElement: FakeObject},
          },
        },
        () => {},
        assertionContext,
      )
    }).toThrow(NodeTypeError)
  })
})

describe('toSentence', () => {
  it('turns array into string of comma separated list with default last word connector', () => {
    expect(toSentence(['one', 'two', 'three'])).toBe('one, two and three')
  })

  it('supports custom word connector', () => {
    expect(toSentence(['one', 'two', 'three'], {wordConnector: '; '})).toBe(
      'one; two and three',
    )
  })

  it('supports custom last word connector', () => {
    expect(
      toSentence(['one', 'two', 'three'], {lastWordConnector: ' or '}),
    ).toBe('one, two or three')
  })

  it('turns one element array into string containing first element', () => {
    expect(toSentence(['one'])).toBe('one')
  })

  it('turns empty array into empty string', () => {
    expect(toSentence([])).toBe('')
  })
})
