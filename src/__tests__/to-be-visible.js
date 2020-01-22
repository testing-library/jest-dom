import {render} from './helpers/test-utils'

// eslint-disable-next-line max-lines-per-function
describe('.toBeVisible', () => {
  it('returns the visibility of an element', () => {
    const {container} = render(`
      <div>
        <header>
          <h1 style="display: none">Main title</h1>
          <h2 style="visibility: hidden">Secondary title</h2>
          <h3 style="visibility: collapse">Secondary title</h3>
          <h4 style="opacity: 0">Secondary title</h4>
          <h5 style="opacity: 0.1">Secondary title</h5>
        </header>
        <button hidden>Hidden button</button>
        <section style="display: block; visibility: hidden">
          <p>Hello <strong>World</strong></p>
        </section>
      </div>
    `)

    expect(container.querySelector('header')).toBeVisible()
    expect(container.querySelector('h1')).not.toBeVisible()
    expect(container.querySelector('h2')).not.toBeVisible()
    expect(container.querySelector('h3')).not.toBeVisible()
    expect(container.querySelector('h4')).not.toBeVisible()
    expect(container.querySelector('h5')).toBeVisible()
    expect(container.querySelector('button')).not.toBeVisible()
    expect(container.querySelector('strong')).not.toBeVisible()

    expect(() =>
      expect(container.querySelector('header')).not.toBeVisible(),
    ).toThrowError()
    expect(() =>
      expect(container.querySelector('p')).toBeVisible(),
    ).toThrowError()
  })

  // eslint-disable-next-line max-lines-per-function
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
