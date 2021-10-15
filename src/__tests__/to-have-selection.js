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

    expect(queryByTestId('parent')).toHaveSelection('selected')

    range.setStart(queryByTestId('prev'), 0)
    range.setEnd(queryByTestId('child').childNodes[0], 3)

    expect(queryByTestId('parent')).toHaveSelection('text sel')

    range.setStart(queryByTestId('child').childNodes[0], 3)
    range.setEnd(queryByTestId('next').childNodes[0], 4)

    expect(queryByTestId('parent')).toHaveSelection('ected text')
  })
})
