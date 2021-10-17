import {render} from './helpers/test-utils'

describe('.toHaveSelection', () => {
  test.each(['text', 'password', 'textarea'])(
    'handles selection within form elements',
    testId => {
      const {queryByTestId} = render(`
        <input type="text" value="text selected text" data-testid="text" />
        <input type="password" value="text selected text" data-testid="password" />
        <textarea data-testid="textarea">text selected text</textarea>
    `)

      queryByTestId(testId).setSelectionRange(5, 13)
      expect(queryByTestId(testId)).toHaveSelection('selected')

      queryByTestId(testId).select()
      expect(queryByTestId(testId)).toHaveSelection('text selected text')
    },
  )

  test.each(['checkbox', 'radio'])(
    'returns empty string for form elements without text',
    testId => {
      const {queryByTestId} = render(`
        <input type="checkbox" value="checkbox" data-testid="checkbox" />
        <input type="radio" value="radio" data-testid="radio" />
    `)

      queryByTestId(testId).select()
      expect(queryByTestId(testId)).toHaveSelection('')
    },
  )

  test('does not match subset string', () => {
    const {queryByTestId} = render(`
        <input type="text" value="text selected text" data-testid="text" />
    `)

    queryByTestId('text').setSelectionRange(5, 13)
    expect(queryByTestId('text')).not.toHaveSelection('select')
    expect(queryByTestId('text')).toHaveSelection('selected')
  })

  test('accepts any selection when expected selection is missing', () => {
    const {queryByTestId} = render(`
        <input type="text" value="text selected text" data-testid="text" />
    `)

    expect(queryByTestId('text')).not.toHaveSelection()

    queryByTestId('text').setSelectionRange(5, 13)

    expect(queryByTestId('text')).toHaveSelection()
  })

  test('throws when form element is not selected', () => {
    const {queryByTestId} = render(`
        <input type="text" value="text selected text" data-testid="text" />
    `)

    let errorMessage
    try {
      expect(queryByTestId('text')).toHaveSelection()
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toHaveSelection(</><green>expected</><dim>)</>

      Expected the element to have selection:
      <green>  (any)</>
      Received:

    `)
  })

  test('throws when form element is selected', () => {
    const {queryByTestId} = render(`
        <input type="text" value="text selected text" data-testid="text" />
    `)
    queryByTestId('text').setSelectionRange(5, 13)

    let errorMessage
    try {
      expect(queryByTestId('text')).not.toHaveSelection()
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toHaveSelection(</><green>expected</><dim>)</>

      Expected the element not to have selection:
      <green>  (any)</>
      Received:
      <red>  selected</>
    `)
  })

  test('throws when element is not selected', () => {
    const {queryByTestId} = render(`
        <div data-testid="text">text</div>
    `)

    let errorMessage
    try {
      expect(queryByTestId('text')).toHaveSelection()
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toHaveSelection(</><green>expected</><dim>)</>

      Expected the element to have selection:
      <green>  (any)</>
      Received:

    `)
  })

  test('throws when element selection does not match', () => {
    const {queryByTestId} = render(`
        <input type="text" value="text selected text" data-testid="text" />
    `)
    queryByTestId('text').setSelectionRange(0, 4)

    let errorMessage
    try {
      expect(queryByTestId('text')).toHaveSelection('no match')
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toHaveSelection(</><green>no match</><dim>)</>

      Expected the element to have selection:
      <green>  no match</>
      Received:
      <red>  text</>
    `)
  })

  test('handles selection within text nodes', () => {
    const {queryByTestId} = render(`
        <div data-testid="prev">prev</div>
        <div data-testid="parent">text <span data-testid="child">selected</span> text</div>
        <div data-testid="next">next</div>
    `)

    const selection = queryByTestId('child').ownerDocument.getSelection()
    const range = queryByTestId('child').ownerDocument.createRange()
    selection.removeAllRanges()
    selection.addRange(range)

    range.selectNodeContents(queryByTestId('child'))

    expect(queryByTestId('child')).toHaveSelection('selected')
    expect(queryByTestId('parent')).toHaveSelection('selected')

    range.selectNodeContents(queryByTestId('parent'))

    expect(queryByTestId('child')).toHaveSelection('selected')
    expect(queryByTestId('parent')).toHaveSelection('text selected text')

    range.setStart(queryByTestId('prev'), 0)
    range.setEnd(queryByTestId('child').childNodes[0], 3)

    expect(queryByTestId('child')).toHaveSelection('sel')
    expect(queryByTestId('parent')).toHaveSelection('text sel')

    range.setStart(queryByTestId('child').childNodes[0], 3)
    range.setEnd(queryByTestId('next').childNodes[0], 4)

    expect(queryByTestId('child')).toHaveSelection('ected')
    expect(queryByTestId('parent')).toHaveSelection('ected text')
  })

  test('throws with information when the expected selection is not string', () => {
    const {container} = render(`<div>1</div>`)
    const element = container.firstChild
    const range = element.ownerDocument.createRange()
    range.selectNodeContents(element)
    element.ownerDocument.getSelection().addRange(range)
    let errorMessage
    try {
      expect(element).toHaveSelection(1)
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(
      `expected selection must be a string or undefined`,
    )
  })
})
