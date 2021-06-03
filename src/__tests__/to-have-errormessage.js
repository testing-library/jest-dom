import {render} from './helpers/test-utils'

// eslint-disable-next-line max-lines-per-function
describe('.toHaveErrorMessage', () => {
  test('resolves for object with correct aria-errormessage reference', () => {
    const {queryByTestId} = render(`
    <label for="startTime"> Please enter a start time for the meeting: </label>
    <input data-testid="startTime" type="text" aria-errormessage="msgID" aria-invalid="true" value="11:30 PM" >
    <span id="msgID" aria-live="assertive" style="visibility:visible"> Invalid time:  the time must be between 9:00 AM and 5:00 PM </span>
    `)

    const timeInput = queryByTestId('startTime')

    expect(timeInput).toHaveErrorMessage(
      'Invalid time: the time must be between 9:00 AM and 5:00 PM',
    )
    expect(timeInput).toHaveErrorMessage(/invalid time/i) // to partially match
    expect(timeInput).toHaveErrorMessage(
      expect.stringContaining('Invalid time'),
    ) // to partially match
    expect(timeInput).not.toHaveErrorMessage('Pikachu!')
  })

  test('works correctly on implicit invalid element', () => {
    const {queryByTestId} = render(`
    <label for="startTime"> Please enter a start time for the meeting: </label>
    <input data-testid="startTime" type="text" aria-errormessage="msgID" aria-invalid value="11:30 PM" >
    <span id="msgID" aria-live="assertive" style="visibility:visible"> Invalid time:  the time must be between 9:00 AM and 5:00 PM </span>
    `)

    const timeInput = queryByTestId('startTime')

    expect(timeInput).toHaveErrorMessage(
      'Invalid time: the time must be between 9:00 AM and 5:00 PM',
    )
    expect(timeInput).toHaveErrorMessage(/invalid time/i) // to partially match
    expect(timeInput).toHaveErrorMessage(
      expect.stringContaining('Invalid time'),
    ) // to partially match
    expect(timeInput).not.toHaveErrorMessage('Pikachu!')
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
