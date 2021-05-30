import {render} from './helpers/test-utils'

// eslint-disable-next-line max-lines-per-function
describe('.toHaveErrorMessage', () => {
  test('resolves for object with correct aria-errormessage reference', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="invalid" aria-errormessage="errormessage" aria-invalid="true"></div>
    <div data-testid="implicitly_invalid" aria-errormessage="errormessage" aria-invalid></div>
    `)

    // element with aria-invalid="true"
    expect(queryByTestId('invalid')).toHaveErrorMessage('The errormessage')
    expect(queryByTestId('invalid')).toHaveErrorMessage(
      expect.stringContaining('The'),
    )
    expect(queryByTestId('invalid')).toHaveErrorMessage(/The/)
    expect(queryByTestId('invalid')).toHaveErrorMessage(
      expect.stringMatching(/The/),
    )
    expect(queryByTestId('invalid')).toHaveErrorMessage(/errormessage/)
    expect(queryByTestId('invalid')).not.toHaveErrorMessage('Something else')
    expect(queryByTestId('invalid')).not.toHaveErrorMessage('The')

    // element with aria-invalid attribute
    expect(queryByTestId('implicitly_invalid')).toHaveErrorMessage(
      'The errormessage',
    )
    expect(queryByTestId('implicitly_invalid')).toHaveErrorMessage(
      expect.stringContaining('The'),
    )
    expect(queryByTestId('implicitly_invalid')).toHaveErrorMessage(/The/)
    expect(queryByTestId('implicitly_invalid')).toHaveErrorMessage(
      expect.stringMatching(/The/),
    )
    expect(queryByTestId('implicitly_invalid')).toHaveErrorMessage(
      /errormessage/,
    )
    expect(queryByTestId('implicitly_invalid')).not.toHaveErrorMessage(
      'Something else',
    )
    expect(queryByTestId('implicitly_invalid')).not.toHaveErrorMessage('The')
  })

  test('rejects for valid object', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="valid" aria-errormessage="errormessage"></div>
    <div data-testid="explicitly_valid" aria-errormessage="errormessage" aria-invalid="false"></div>
    `)

    expect(queryByTestId('valid')).not.toHaveErrorMessage('The errormessage')
    expect(() => {
      expect(queryByTestId('valid')).toHaveErrorMessage('The errormessage')
    }).toThrowError()

    expect(queryByTestId('explicitly_valid')).not.toHaveErrorMessage(
      'The errormessage',
    )
    expect(() => {
      expect(queryByTestId('explicitly_valid')).toHaveErrorMessage(
        'The errormessage',
      )
    }).toThrowError()
  })

  test('rejects for object with incorrect aria-errormessage reference', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="invalid_id" aria-errormessage="invalid" aria-invalid="true"></div>
    `)

    expect(queryByTestId('invalid_id')).not.toHaveErrorMessage()
    expect(queryByTestId('invalid_id')).toHaveErrorMessage('')
  })

  test('handles invalid element without aria-errormessage', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="without" aria-invalid="true"></div>
    `)

    expect(queryByTestId('without')).not.toHaveErrorMessage()
    expect(queryByTestId('without')).toHaveErrorMessage('')
  })

  test('handles valid element without aria-errormessage', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="without"></div>
    `)

    expect(queryByTestId('without')).not.toHaveErrorMessage()
    expect(() => {
      expect(queryByTestId('without')).toHaveErrorMessage()
    }).toThrowError()

    expect(queryByTestId('without')).not.toHaveErrorMessage('')
    expect(() => {
      expect(queryByTestId('without')).toHaveErrorMessage('')
    }).toThrowError()
  })

  test('handles multiple ids', () => {
    const {queryByTestId} = render(`
    <div id="first">First errormessage</div>
    <div id="second">Second errormessage</div>
    <div id="third">Third errormessage</div>
    <div data-testid="multiple" aria-errormessage="first second third" aria-invalid="true"></div>
    `)

    expect(queryByTestId('multiple')).toHaveErrorMessage(
      'First errormessage Second errormessage Third errormessage',
    )
    expect(queryByTestId('multiple')).toHaveErrorMessage(
      /Second errormessage Third/,
    )
    expect(queryByTestId('multiple')).toHaveErrorMessage(
      expect.stringContaining('Second errormessage Third'),
    )
    expect(queryByTestId('multiple')).toHaveErrorMessage(
      expect.stringMatching(/Second errormessage Third/),
    )
    expect(queryByTestId('multiple')).not.toHaveErrorMessage('Something else')
    expect(queryByTestId('multiple')).not.toHaveErrorMessage('First')
  })

  test('handles negative test cases', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="target" aria-errormessage="errormessage" aria-invalid="true"></div>
    `)

    expect(() =>
      expect(queryByTestId('other')).toHaveErrorMessage('The errormessage'),
    ).toThrowError()

    expect(() =>
      expect(queryByTestId('target')).toHaveErrorMessage('Something else'),
    ).toThrowError()

    expect(() =>
      expect(queryByTestId('target')).not.toHaveErrorMessage(
        'The errormessage',
      ),
    ).toThrowError()
  })

  test('normalizes whitespace', () => {
    const {queryByTestId} = render(`
      <div id="first">
        Step
          1
            of
              4
      </div>
      <div id="second">
        And
          extra
            errormessage
      </div>
      <div data-testid="target" aria-errormessage="first second" aria-invalid="true"></div>
    `)

    expect(queryByTestId('target')).toHaveErrorMessage(
      'Step 1 of 4 And extra errormessage',
    )
  })

  test('can handle multiple levels with content spread across decendants', () => {
    const {queryByTestId} = render(`
        <span id="errormessage">
            <span>Step</span>
            <span>      1</span>
            <span><span>of</span></span>
            4</span>
        </span>
        <div data-testid="target" aria-errormessage="errormessage" aria-invalid="true"></div>
    `)

    expect(queryByTestId('target')).toHaveErrorMessage('Step 1 of 4')
  })

  test('handles extra whitespace with multiple ids', () => {
    const {queryByTestId} = render(`
    <div id="first">First errormessage</div>
    <div id="second">Second errormessage</div>
    <div id="third">Third errormessage</div>
    <div data-testid="multiple" aria-errormessage="  first
    second    third
    " aria-invalid="true"></div>
    `)

    expect(queryByTestId('multiple')).toHaveErrorMessage(
      'First errormessage Second errormessage Third errormessage',
    )
  })

  test('is case-sensitive', () => {
    const {queryByTestId} = render(`
      <span id="errormessage">Sensitive text</span>
      <div data-testid="target" aria-errormessage="errormessage" aria-invalid="true"></div>
    `)

    expect(queryByTestId('target')).toHaveErrorMessage('Sensitive text')
    expect(queryByTestId('target')).not.toHaveErrorMessage('sensitive text')
  })
})
