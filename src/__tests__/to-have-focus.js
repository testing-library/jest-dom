import {render} from './helpers/test-utils'

test('.toHaveFocus', () => {
  const {container} = render(`
      <div>
        <label for="focused">test</label>
        <input id="focused" type="text" />
        <button type="submit" id="not-focused">Not Focused</button>
      </div>`)

  const focused = container.querySelector('#focused')
  const notFocused = container.querySelector('#not-focused')

  focused.focus()

  expect(focused).toHaveFocus()
  expect(notFocused).not.toHaveFocus()

  expect(() => expect(focused).not.toHaveFocus()).toThrowError()
  expect(() => expect(notFocused).toHaveFocus()).toThrowError()
})
