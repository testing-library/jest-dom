import {render} from './helpers/test-utils'

describe('.toHaveDescription', () => {
  test('handles positive test cases', () => {
    const {queryByTestId} = render(`
    <div id="description">The description</div>

    <div data-testid="single" aria-describedby="description"></div>
    <div data-testid="invalid_id" aria-describedby="invalid"></div>
    <div data-testid="without"></div>
    `)

    expect(queryByTestId('single')).toHaveDescription('The description')
    expect(queryByTestId('single')).toHaveDescription(
      expect.stringContaining('The'),
    )
    expect(queryByTestId('single')).toHaveDescription(/The/)
    expect(queryByTestId('single')).toHaveDescription(
      expect.stringMatching(/The/),
    )
    expect(queryByTestId('single')).toHaveDescription(/description/)
    expect(queryByTestId('single')).not.toHaveDescription('Something else')
    expect(queryByTestId('single')).not.toHaveDescription('The')

    expect(queryByTestId('invalid_id')).not.toHaveDescription()
    expect(queryByTestId('invalid_id')).toHaveDescription('')

    expect(queryByTestId('without')).not.toHaveDescription()
    expect(queryByTestId('without')).toHaveDescription('')
  })

  test('handles multiple ids', () => {
    const {queryByTestId} = render(`
    <div id="first">First description</div>
    <div id="second">Second description</div>
    <div id="third">Third description</div>

    <div data-testid="multiple" aria-describedby="first second third"></div>
    `)

    expect(queryByTestId('multiple')).toHaveDescription(
      'First description Second description Third description',
    )
    expect(queryByTestId('multiple')).toHaveDescription(
      /Second description Third/,
    )
    expect(queryByTestId('multiple')).toHaveDescription(
      expect.stringContaining('Second description Third'),
    )
    expect(queryByTestId('multiple')).toHaveDescription(
      expect.stringMatching(/Second description Third/),
    )
    expect(queryByTestId('multiple')).not.toHaveDescription('Something else')
    expect(queryByTestId('multiple')).not.toHaveDescription('First')
  })

  test('handles negative test cases', () => {
    const {queryByTestId} = render(`
    <div id="description">The description</div>
    <div data-testid="target" aria-describedby="description"></div>
    `)

    expect(() =>
      expect(queryByTestId('other')).toHaveDescription('The description'),
    ).toThrowError()

    expect(() =>
      expect(queryByTestId('target')).toHaveDescription('Something else'),
    ).toThrowError()

    expect(() =>
      expect(queryByTestId('target')).not.toHaveDescription('The description'),
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
            description
      </div>
      <div data-testid="target" aria-describedby="first second"></div>
    `)

    expect(queryByTestId('target')).toHaveDescription(
      'Step 1 of 4 And extra description',
    )
  })

  test('can handle multiple levels with content spread across decendants', () => {
    const {queryByTestId} = render(`
        <span id="description">
            <span>Step</span>
            <span>      1</span>
            <span><span>of</span></span>


            4</span>
        </span>
        <div data-testid="target" aria-describedby="description"></div>
    `)

    expect(queryByTestId('target')).toHaveDescription('Step 1 of 4')
  })

  test('handles extra whitespace with multiple ids', () => {
    const {queryByTestId} = render(`
    <div id="first">First description</div>
    <div id="second">Second description</div>
    <div id="third">Third description</div>

    <div data-testid="multiple" aria-describedby="  first
    second    third
    "></div>
    `)

    expect(queryByTestId('multiple')).toHaveDescription(
      'First description Second description Third description',
    )
  })

  test('is case-sensitive', () => {
    const {queryByTestId} = render(`
      <span id="description">Sensitive text</span>
      <div data-testid="target" aria-describedby="description"></div>
    `)

    expect(queryByTestId('target')).toHaveDescription('Sensitive text')
    expect(queryByTestId('target')).not.toHaveDescription('sensitive text')
  })
})
