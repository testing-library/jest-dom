import {render} from './helpers/test-utils'

describe('.toHaveValue', () => {
  test('handles value of text input', () => {
    const {queryByTestId} = render(`
        <input type="text" value="foo" data-testid="value" />
        <input type="text" value=""  data-testid="empty" />
        <input type="text" data-testid="without" />
    `)

    expect(queryByTestId('value')).toHaveValue('foo')
    expect(queryByTestId('value')).toHaveValue()
    expect(queryByTestId('value')).not.toHaveValue('bar')
    expect(queryByTestId('value')).not.toHaveValue('')

    expect(queryByTestId('empty')).toHaveValue('')
    expect(queryByTestId('empty')).not.toHaveValue()
    expect(queryByTestId('empty')).not.toHaveValue('foo')

    expect(queryByTestId('without')).toHaveValue('')
    expect(queryByTestId('without')).not.toHaveValue()
    expect(queryByTestId('without')).not.toHaveValue('foo')
    queryByTestId('without').value = 'bar'
    expect(queryByTestId('without')).toHaveValue('bar')
  })

  test('handles value of number input', () => {
    const {queryByTestId} = render(`
        <input type="number" value="5" data-testid="number" />
        <input type="number" value=""  data-testid="empty" />
        <input type="number" data-testid="without" />
    `)

    expect(queryByTestId('number')).toHaveValue(5)
    expect(queryByTestId('number')).toHaveValue()
    expect(queryByTestId('number')).not.toHaveValue(4)
    expect(queryByTestId('number')).not.toHaveValue('5')

    expect(queryByTestId('empty')).toHaveValue(null)
    expect(queryByTestId('empty')).not.toHaveValue()
    expect(queryByTestId('empty')).not.toHaveValue('5')

    expect(queryByTestId('without')).toHaveValue(null)
    expect(queryByTestId('without')).not.toHaveValue()
    expect(queryByTestId('without')).not.toHaveValue('10')
    queryByTestId('without').value = 10
    expect(queryByTestId('without')).toHaveValue(10)
  })

  test('handles value of select element', () => {
    const {queryByTestId} = render(`
      <select data-testid="single">
        <option value="first">First Value</option> 
        <option value="second" selected>Second Value</option>
        <option value="third">Third Value</option>
      </select>
      
      <select data-testid="multiple" multiple>
        <option value="first">First Value</option> 
        <option value="second" selected>Second Value</option>
        <option value="third" selected>Third Value</option>
      </select>
      
      <select data-testid="not-selected" >
        <option value="" disabled selected>- Select some value - </option>
        <option value="first">First Value</option> 
        <option value="second">Second Value</option>
        <option value="third">Third Value</option>
      </select>
    `)

    expect(queryByTestId('single')).toHaveValue('second')
    expect(queryByTestId('single')).toHaveValue()

    expect(queryByTestId('multiple')).toHaveValue(['second', 'third'])
    expect(queryByTestId('multiple')).toHaveValue()

    expect(queryByTestId('not-selected')).not.toHaveValue()
    expect(queryByTestId('not-selected')).toHaveValue('')

    queryByTestId('single').children[0].setAttribute('selected', true)
    expect(queryByTestId('single')).toHaveValue('first')
  })

  test('handles value of textarea element', () => {
    const {queryByTestId} = render(`
      <textarea data-testid="textarea">text value</textarea>
    `)
    expect(queryByTestId('textarea')).toHaveValue('text value')
  })

  test('throws when passed checkbox or radio', () => {
    const {queryByTestId} = render(`
        <input data-testid="checkbox" type="checkbox" name="checkbox" value="val" checked />
        <input data-testid="radio" type="radio" name="radio" value="val" checked />
    `)

    expect(() => {
      expect(queryByTestId('checkbox')).toHaveValue('')
    }).toThrow()

    expect(() => {
      expect(queryByTestId('radio')).toHaveValue('')
    }).toThrow()
  })

  test('throws when the expected input value does not match', () => {
    const {container} = render(`<input data-testid="one" value="foo" />`)
    const input = container.firstChild
    let errorMessage
    try {
      expect(input).toHaveValue('something else')
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(`
      "<dim>expect(</><red>element</><dim>).toHaveValue(</><green>something else</><dim>)</>

      Expected the element to have value:
      <green>  something else</>
      Received:
      <red>  foo</>"
    `)
  })

  test('throws with type information when the expected text input value has loose equality with received value', () => {
    const {container} = render(`<input data-testid="one" value="8" />`)
    const input = container.firstChild
    let errorMessage
    try {
      expect(input).toHaveValue(8)
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toMatchInlineSnapshot(`
      "<dim>expect(</><red>element</><dim>).toHaveValue(</><green>8</><dim>)</>

      Expected the element to have value:
      <green>  8 (number)</>
      Received:
      <red>  8 (string)</>"
    `)
  })

  test('throws when using not but the expected input value does match', () => {
    const {container} = render(`<input data-testid="one" value="foo" />`)
    const input = container.firstChild
    let errorMessage

    try {
      expect(input).not.toHaveValue('foo')
    } catch (error) {
      errorMessage = error.message
    }
    expect(errorMessage).toMatchInlineSnapshot(`
      "<dim>expect(</><red>element</><dim>).not.toHaveValue(</><green>foo</><dim>)</>

      Expected the element not to have value:
      <green>  foo</>
      Received:
      <red>  foo</>"
    `)
  })

  test('throws when the form has no a value but a value is expected', () => {
    const {container} = render(`<input data-testid="one" />`)
    const input = container.firstChild
    let errorMessage

    try {
      expect(input).toHaveValue()
    } catch (error) {
      errorMessage = error.message
    }
    expect(errorMessage).toMatchInlineSnapshot(`
      "<dim>expect(</><red>element</><dim>).toHaveValue(</><green>expected</><dim>)</>

      Expected the element to have value:
      <green>  (any)</>
      Received:
      "
    `)
  })

  test('throws when the form has a value but none is expected', () => {
    const {container} = render(`<input data-testid="one" value="foo" />`)
    const input = container.firstChild
    let errorMessage

    try {
      expect(input).not.toHaveValue()
    } catch (error) {
      errorMessage = error.message
    }
    expect(errorMessage).toMatchInlineSnapshot(`
      "<dim>expect(</><red>element</><dim>).not.toHaveValue(</><green>expected</><dim>)</>

      Expected the element not to have value:
      <green>  (any)</>
      Received:
      <red>  foo</>"
    `)
  })
})

/* eslint max-lines-per-function:0 */
