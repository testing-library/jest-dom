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

test('.toHaveFocus with element in shadow root', () => {
  const host = document.createElement('div')
  const shadowRoot = host.attachShadow({mode: 'open'})
  const input = document.createElement('input')
  shadowRoot.appendChild(input)
  document.body.innerHTML = ''
  document.body.appendChild(host)

  input.focus()

  expect(input).toHaveFocus()
  expect(host).not.toHaveFocus()
  expect(() => expect(input).not.toHaveFocus()).toThrowError()
})

test('.toHaveFocus with element in nested shadow root', () => {
  const outerHost = document.createElement('div')
  const outerShadow = outerHost.attachShadow({mode: 'open'})
  const innerHost = document.createElement('div')
  outerShadow.appendChild(innerHost)
  const innerShadow = innerHost.attachShadow({mode: 'open'})
  const input = document.createElement('input')
  innerShadow.appendChild(input)
  document.body.innerHTML = ''
  document.body.appendChild(outerHost)

  input.focus()

  expect(input).toHaveFocus()
  expect(outerHost).not.toHaveFocus()
  expect(innerHost).not.toHaveFocus()
})
