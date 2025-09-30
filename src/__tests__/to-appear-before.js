import {render} from './helpers/test-utils'

describe('.toAppearBefore', () => {
  const {queryByTestId} = render(`
    <div>
      <div data-testid='div-a'>
        <span data-testid='text-a'>Text A</span>
        <span data-testid='text-b'>Text B</span>
      </div>
    </div>
    `)

  const textA = queryByTestId('text-a')
  const textB = queryByTestId('text-b')
  const divA = queryByTestId('div-a')

  it('returns correct result when first element is before second element', () => {
    expect(textA).toAppearBefore(textB)
  })

  it('returns correct for .not() invocation', () => {
    expect(textB).not.toAppearBefore(textA)
  })

  it('errors out when first element is not before second element', () => {
    expect(() => expect(textB).toAppearBefore(textA)).toThrowError(
      /Received: Node.DOCUMENT_POSITION_PRECEDING \(2\)/i,
    )
  })

  it('errors out when .not is used but first element is actually before second element', () => {
    expect(() => expect(textA).not.toAppearBefore(textB)).toThrowError(
      /\.not\.toAppearBefore/i,
    )
  })

  it('errors out when first element is parent of second element', () => {
    expect(() => expect(divA).toAppearBefore(textA)).toThrowError(
      /Received: Unknown document position \(20\)/i,
    )
  })

  it('errors out when first element is child of second element', () => {
    expect(() => expect(textA).toAppearBefore(divA)).toThrowError(
      /Received: Unknown document position \(10\)/i,
    )
  })

  it('errors out when either first or second element is not HTMLElement', () => {
    expect(() => expect(1).toAppearBefore(textB)).toThrowError()
    expect(() => expect(textA).toAppearBefore(1)).toThrowError()
  })
})

describe('.toAppearAfter', () => {
  const {queryByTestId} = render(`
    <div>
      <div data-testid='div-a'>
        <span data-testid='text-a'>Text A</span>
        <span data-testid='text-b'>Text B</span>
      </div>
    </div>
    `)

  const textA = queryByTestId('text-a')
  const textB = queryByTestId('text-b')
  const divA = queryByTestId('div-a')

  it('returns correct result when first element is after second element', () => {
    expect(textB).toAppearAfter(textA)
  })

  it('returns correct for .not() invocation', () => {
    expect(textA).not.toAppearAfter(textB)
  })

  it('errors out when first element is not after second element', () => {
    expect(() => expect(textA).toAppearAfter(textB)).toThrowError(
      /Received: Node.DOCUMENT_POSITION_FOLLOWING \(4\)/i,
    )
  })

  it('errors out when .not is used but first element is actually after second element', () => {
    expect(() => expect(textB).not.toAppearAfter(textA)).toThrowError(
      /\.not\.toAppearAfter/i,
    )
  })

  it('errors out when first element is parent of second element', () => {
    expect(() => expect(divA).toAppearAfter(textA)).toThrowError(
      /Received: Unknown document position \(20\)/i,
    )
  })

  it('errors out when first element is child of second element', () => {
    expect(() => expect(textA).toAppearAfter(divA)).toThrowError(
      /Received: Unknown document position \(10\)/i,
    )
  })

  it('errors out when either first or second element is not HTMLElement', () => {
    expect(() => expect(1).toAppearAfter(textB)).toThrowError()
    expect(() => expect(textA).toAppearAfter(1)).toThrowError()
  })
})
