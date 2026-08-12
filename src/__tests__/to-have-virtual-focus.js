import {render} from './helpers/test-utils'
import document from './helpers/document'

test('.toHaveVirtualFocus', () => {
  const {container} = render(`
      <ul role="listbox" tabindex="0" aria-activedescendant="option1" data-testid="listbox">
        <li role="option" id="option1" data-testid="option1">option 1</li>
        <li role="option" id="option2" data-testid="option2">option 2</li>
      </ul>`)

  const listbox = container.querySelector('[data-testid="listbox"]')
  const option1 = container.querySelector('#option1')
  const option2 = container.querySelector('#option2')

  document.body.appendChild(container)
  listbox.focus()

  expect(option1).toHaveVirtualFocus()
  expect(option2).not.toHaveVirtualFocus()

  expect(() => expect(option1).not.toHaveVirtualFocus()).toThrowError()
  expect(() => expect(option2).toHaveVirtualFocus()).toThrowError()
})

test('.toHaveVirtualFocus when the container does not have DOM focus', () => {
  const {container} = render(`
      <ul role="listbox" tabindex="0" aria-activedescendant="option1" data-testid="listbox">
        <li role="option" id="option1" data-testid="option1">option 1</li>
      </ul>`)

  const option1 = container.querySelector('#option1')

  expect(option1).not.toHaveVirtualFocus()
})

test('.toHaveVirtualFocus updates as aria-activedescendant changes', () => {
  const {container} = render(`
      <ul role="listbox" tabindex="0" aria-activedescendant="option1" data-testid="listbox">
        <li role="option" id="option1" data-testid="option1">option 1</li>
        <li role="option" id="option2" data-testid="option2">option 2</li>
      </ul>`)

  const listbox = container.querySelector('[data-testid="listbox"]')
  const option1 = container.querySelector('#option1')
  const option2 = container.querySelector('#option2')

  document.body.appendChild(container)
  listbox.focus()

  expect(option1).toHaveVirtualFocus()

  listbox.setAttribute('aria-activedescendant', 'option2')

  expect(option1).not.toHaveVirtualFocus()
  expect(option2).toHaveVirtualFocus()
})
