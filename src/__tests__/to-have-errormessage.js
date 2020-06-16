import {render} from './helpers/test-utils'

// eslint-disable-next-line max-lines-per-function
describe('.toHaveErrorMessage', () => {
  test('handles aria-errormessage', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="single" aria-errormessage="errormessage" aria-invalid="true"></div>
    `)

    expect(queryByTestId('single')).toHaveErrorMessage('The errormessage')
    expect(queryByTestId('single')).toHaveErrorMessage(
      expect.stringContaining('The'),
    )
    expect(queryByTestId('single')).toHaveErrorMessage(/The/)
    expect(queryByTestId('single')).toHaveErrorMessage(
      expect.stringMatching(/The/),
    )
    expect(queryByTestId('single')).toHaveErrorMessage(/errormessage/)
    expect(queryByTestId('single')).not.toHaveErrorMessage('Something else')
    expect(queryByTestId('single')).not.toHaveErrorMessage('The')
  })

  test('handles aria-errormessage without aria-invalid', () => {
    const {queryByTestId} = render(`
    <div id="errormessage">The errormessage</div>
    <div data-testid="single_no_invalid" aria-errormessage="errormessage"></div>
    `)

    expect(queryByTestId('single_no_invalid')).not.toHaveErrorMessage(
      'The errormessage',
    )
  })

  test('handles aria-errormessage with invalid id', () => {
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
    expect(queryByTestId('without')).not.toHaveErrorMessage('')
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
