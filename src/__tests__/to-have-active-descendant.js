import {render} from './helpers/test-utils'

describe('aria-activedescendant matchers', () => {
  test('.toHaveActiveDescendant', () => {
    const {queryByTestId} = render(`
      <div>
        <ul
          aria-activedescendant="option-1"
          data-testid="listbox"
          role="listbox"
          tabindex="0"
        >
          <li data-testid="option-1" id="option-1" role="option">Option 1</li>
          <li data-testid="option-2" id="option-2" role="option">Option 2</li>
          <li data-testid="no-id" role="option">No id</li>
        </ul>
        <button data-testid="button">Button</button>
      </div>
    `)
    const listbox = queryByTestId('listbox')
    const option1 = queryByTestId('option-1')
    const option2 = queryByTestId('option-2')
    const noId = queryByTestId('no-id')
    const button = queryByTestId('button')

    listbox.focus()

    expect(listbox).toHaveActiveDescendant()
    expect(listbox).toHaveActiveDescendant(option1)
    expect(listbox).toHaveActiveDescendant('option-1')
    expect(listbox).not.toHaveActiveDescendant(option2)
    expect(listbox).not.toHaveActiveDescendant(noId)
    expect(listbox).not.toHaveActiveDescendant('option-2')
    expect(listbox).not.toHaveActiveDescendant('')

    expect(() => expect(listbox).not.toHaveActiveDescendant()).toThrowError()
    expect(() =>
      expect(listbox).not.toHaveActiveDescendant(option1),
    ).toThrowError()
    expect(() => expect(listbox).toHaveActiveDescendant(option2)).toThrowError()
    expect(() => expect(listbox).toHaveActiveDescendant(noId)).toThrowError()
    expect(() => expect(listbox).toHaveActiveDescendant('')).toThrowError()

    listbox.setAttribute('aria-activedescendant', 'missing')

    expect(listbox).not.toHaveActiveDescendant()
    expect(listbox).not.toHaveActiveDescendant('missing')
    expect(() => expect(listbox).toHaveActiveDescendant()).toThrowError()
    expect(() =>
      expect(listbox).toHaveActiveDescendant('missing'),
    ).toThrowError()

    button.focus()

    expect(listbox).not.toHaveActiveDescendant()
    expect(listbox).not.toHaveActiveDescendant(option1)
    expect(() => expect(listbox).toHaveActiveDescendant()).toThrowError()
    expect(() => expect(listbox).toHaveActiveDescendant(option1)).toThrowError()
  })

  test('.toHaveVirtualFocus', () => {
    const {queryByTestId} = render(`
      <div>
        <ul
          aria-activedescendant="option-1"
          data-testid="listbox"
          role="listbox"
          tabindex="0"
        >
          <li data-testid="option-1" id="option-1" role="option">Option 1</li>
          <li data-testid="option-2" id="option-2" role="option">Option 2</li>
          <li data-testid="no-id" role="option">No id</li>
        </ul>
        <button data-testid="button">Button</button>
      </div>
    `)
    const listbox = queryByTestId('listbox')
    const option1 = queryByTestId('option-1')
    const option2 = queryByTestId('option-2')
    const noId = queryByTestId('no-id')
    const button = queryByTestId('button')

    listbox.focus()

    expect(option1).toHaveVirtualFocus()
    expect(option2).not.toHaveVirtualFocus()
    expect(noId).not.toHaveVirtualFocus()

    expect(() => expect(option1).not.toHaveVirtualFocus()).toThrowError()
    expect(() => expect(option2).toHaveVirtualFocus()).toThrowError()

    button.focus()

    expect(option1).not.toHaveVirtualFocus()
    expect(() => expect(option1).toHaveVirtualFocus()).toThrowError()
  })

  test('checks the resolved active descendant element', () => {
    const {queryByTestId} = render(`
      <ul
        aria-activedescendant="duplicate-id"
        data-testid="listbox"
        role="listbox"
        tabindex="0"
      >
        <li data-testid="first" id="duplicate-id" role="option">First</li>
        <li data-testid="second" id="duplicate-id" role="option">Second</li>
      </ul>
    `)
    const listbox = queryByTestId('listbox')
    const first = queryByTestId('first')
    const second = queryByTestId('second')

    listbox.focus()

    expect(listbox).toHaveActiveDescendant(first)
    expect(listbox).not.toHaveActiveDescendant(second)
    expect(first).toHaveVirtualFocus()
    expect(second).not.toHaveVirtualFocus()
  })

  test('validates received and expected elements', () => {
    const {queryByTestId} = render(`
      <ul
        aria-activedescendant="option-1"
        data-testid="listbox"
        role="listbox"
        tabindex="0"
      >
        <li data-testid="option-1" id="option-1" role="option">Option 1</li>
      </ul>
    `)

    expect(() => expect({}).toHaveActiveDescendant()).toThrowError()
    expect(() => expect({}).toHaveVirtualFocus()).toThrowError()
    expect(() =>
      expect(queryByTestId('listbox')).toHaveActiveDescendant({}),
    ).toThrowError()
  })
})
