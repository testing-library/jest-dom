import {render} from './helpers/test-utils'
import document from './helpers/document'

describe('.toBeVisible', () => {
  it('considers elements to be visible by default', () => {
    const {container} = render(`
      <div>
        <header>
          <h1>This is the title</h1>
        </header>
        <button>Hidden button</button>
        <section>
          <p>Hello <strong>World</strong></p>
        </section>
      </div>
    `)

    expect(container.querySelector('header')).toBeVisible()
    expect(container.querySelector('h1')).toBeVisible()
    expect(container.querySelector('button')).toBeVisible()
    expect(container.querySelector('strong')).toBeVisible()

    expect(() =>
      expect(container.querySelector('header')).not.toBeVisible(),
    ).toThrowError()
  })

  describe('with the "hidden" attribute', () => {
    it('considers an element to not be visible', () => {
      const {container} = render('<button hidden>Click me</button>')
      expect(container.querySelector('button')).not.toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).toBeVisible(),
      ).toThrowError()
    })
  })

  describe('display', () => {
    it.each([
      ['inline'],
      ['block'],
      ['inline-block'],
      ['flex'],
      ['inline-flex'],
      ['grid'],
      ['inline-grid'],
    ])('considers "display: %s" as visible', display => {
      const {container} = render(`
        <div style="display: ${display}">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).not.toBeVisible(),
      ).toThrowError()
    })

    it('considers "display: none" as not visible', () => {
      const {container} = render(`
        <div style="display: none">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).not.toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).toBeVisible(),
      ).toThrowError()
    })
  })

  describe('visibility', () => {
    it('considers "visibility: collapse" as visible', () => {
      const {container} = render(`
        <div style="visibility: visible">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).not.toBeVisible(),
      ).toThrowError()
    })

    it('considers "visibility: hidden" as not visible', () => {
      const {container} = render(`
        <div style="visibility: hidden">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).not.toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).toBeVisible(),
      ).toThrowError()
    })

    it('considers "visibility: collapse" as not visible', () => {
      const {container} = render(`
        <div style="visibility: hidden">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).not.toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).toBeVisible(),
      ).toThrowError()
    })
  })

  describe('opacity', () => {
    it('considers "opacity: 0" as not visible', () => {
      const {container} = render(`
        <div style="opacity: 0">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).not.toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).toBeVisible(),
      ).toThrowError()
    })

    it('considers "opacity > 0" as visible', () => {
      const {container} = render(`
        <div style="opacity: 0.1">
          <button>Click me</button>
        </div>,
      `)
      expect(container.querySelector('button')).toBeVisible()
      expect(() =>
        expect(container.querySelector('button')).not.toBeVisible(),
      ).toThrowError()
    })
  })

  describe('detached element', () => {
    it('is not visible', () => {
      const subject = document.createElement('div')
      expect(subject).not.toBeVisible()
      expect(() => {
        expect(subject).toBeVisible()
      }).toThrowError()
    })
  })

  describe('with a <details /> element', () => {
    let subject

    afterEach(() => {
      subject = undefined
    })

    describe('when the details is opened', () => {
      beforeEach(() => {
        subject = render(`
          <details open>
            <summary>Title of visible</summary>
            <div>Visible <small>details</small></div>
          </details>
        `)
      })

      it('returns true to the details content', () => {
        expect(subject.container.querySelector('div')).toBeVisible()
      })

      it('returns true to the most inner details content', () => {
        expect(subject.container.querySelector('small')).toBeVisible()
      })

      it('returns true to the details summary', () => {
        expect(subject.container.querySelector('summary')).toBeVisible()
      })

      describe('when the user clicks on the summary', () => {
        beforeEach(() => subject.container.querySelector('summary').click())

        it('returns false to the details content', () => {
          expect(subject.container.querySelector('div')).not.toBeVisible()
        })

        it('returns true to the details summary', () => {
          expect(subject.container.querySelector('summary')).toBeVisible()
        })
      })
    })

    describe('when the details is not opened', () => {
      beforeEach(() => {
        subject = render(`
          <details>
            <summary>Title of hidden</summary>
            <div>Hidden details</div>
          </details>
        `)
      })

      it('returns false to the details content', () => {
        expect(subject.container.querySelector('div')).not.toBeVisible()
      })

      it('returns true to the summary content', () => {
        expect(subject.container.querySelector('summary')).toBeVisible()
      })

      describe('when the user clicks on the summary', () => {
        beforeEach(() => subject.container.querySelector('summary').click())

        it('returns true to the details content', () => {
          expect(subject.container.querySelector('div')).toBeVisible()
        })

        it('returns true to the details summary', () => {
          expect(subject.container.querySelector('summary')).toBeVisible()
        })
      })
    })

    describe('when the details is opened but it is hidden', () => {
      beforeEach(() => {
        subject = render(`
          <details open hidden>
            <summary>Title of visible</summary>
            <div>Visible details</div>
          </details>
        `)
      })

      it('returns false to the details content', () => {
        expect(subject.container.querySelector('div')).not.toBeVisible()
      })

      it('returns false to the details summary', () => {
        expect(subject.container.querySelector('summary')).not.toBeVisible()
      })
    })

    describe('with a nested <details /> element', () => {
      describe('when the nested <details /> is opened', () => {
        beforeEach(() => {
          subject = render(`
            <details open>
              <summary>Title of visible</summary>
              <div>Outer content</div>
              <details open>
                <summary>Title of nested details</summary>
                <div>Inner content</div>
              </details>
            </details>
          `)
        })

        it('returns true to the nested details content', () => {
          expect(
            subject.container.querySelector('details > details > div'),
          ).toBeVisible()
        })

        it('returns true to the nested details summary', () => {
          expect(
            subject.container.querySelector('details > details > summary'),
          ).toBeVisible()
        })

        it('returns true to the outer details content', () => {
          expect(subject.container.querySelector('details > div')).toBeVisible()
        })

        it('returns true to the outer details summary', () => {
          expect(
            subject.container.querySelector('details > summary'),
          ).toBeVisible()
        })
      })

      describe('when the nested <details /> is not opened', () => {
        beforeEach(() => {
          subject = render(`
            <details open>
              <summary>Title of visible</summary>
              <div>Outer content</div>
              <details>
                <summary>Title of nested details</summary>
                <div>Inner content</div>
              </details>
            </details>
          `)
        })

        it('returns false to the nested details content', () => {
          expect(
            subject.container.querySelector('details > details > div'),
          ).not.toBeVisible()
        })

        it('returns true to the nested details summary', () => {
          expect(
            subject.container.querySelector('details > details > summary'),
          ).toBeVisible()
        })

        it('returns true to the outer details content', () => {
          expect(subject.container.querySelector('details > div')).toBeVisible()
        })

        it('returns true to the outer details summary', () => {
          expect(
            subject.container.querySelector('details > summary'),
          ).toBeVisible()
        })
      })

      describe('when the outer <details /> is not opened and the nested one is opened', () => {
        beforeEach(() => {
          subject = render(`
            <details>
              <summary>Title of visible</summary>
              <div>Outer content</div>
              <details open>
                <summary>Title of nested details</summary>
                <div>Inner content</div>
              </details>
            </details>
          `)
        })

        it('returns false to the nested details content', () => {
          expect(
            subject.container.querySelector('details > details > div'),
          ).not.toBeVisible()
        })

        it('returns false to the nested details summary', () => {
          expect(
            subject.container.querySelector('details > details > summary'),
          ).not.toBeVisible()
        })

        it('returns false to the outer details content', () => {
          expect(
            subject.container.querySelector('details > div'),
          ).not.toBeVisible()
        })

        it('returns true to the outer details summary', () => {
          expect(
            subject.container.querySelector('details > summary'),
          ).toBeVisible()
        })
      })
    })
  })
})
