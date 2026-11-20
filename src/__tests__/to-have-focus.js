import {render} from './helpers/test-utils'
import document from './helpers/document'

test('.toHaveFocus', () => {
  const {container} = render(`
      <div>
        <label for="focused">test</label>
        <input id="focused" type="text" />
        <button type="submit" id="not-focused">Not Focused</button>
      </div>`)

  const focused = container.querySelector('#focused')
  const notFocused = container.querySelector('#not-focused')

  document.body.appendChild(container)
  focused.focus()

  expect(focused).toHaveFocus()
  expect(notFocused).not.toHaveFocus()

  expect(() => expect(focused).not.toHaveFocus()).toThrowError()
  expect(() => expect(notFocused).toHaveFocus()).toThrowError()
})

test('.toHaveFocus resolves the active element through shadow roots', () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const shadowRoot = host.attachShadow({mode: 'open'})
  const focused = document.createElement('input')
  const notFocused = document.createElement('input')
  shadowRoot.appendChild(focused)
  shadowRoot.appendChild(notFocused)

  focused.focus()

  expect(focused).toHaveFocus()
  expect(notFocused).not.toHaveFocus()

  expect(() => expect(focused).not.toHaveFocus()).toThrowError()
  expect(() => expect(notFocused).toHaveFocus()).toThrowError()
})

test('.toHaveFocus resolves the active element through nested shadow roots', () => {
  const outerHost = document.createElement('div')
  document.body.appendChild(outerHost)

  const outerShadow = outerHost.attachShadow({mode: 'open'})
  const innerHost = document.createElement('div')
  outerShadow.appendChild(innerHost)

  const innerShadow = innerHost.attachShadow({mode: 'open'})
  const focused = document.createElement('input')
  innerShadow.appendChild(focused)

  focused.focus()

  expect(focused).toHaveFocus()
})
