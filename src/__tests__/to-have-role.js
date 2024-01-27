import {render} from './helpers/test-utils'

describe('.toHaveRole', () => {
  it('matches implicit role', () => {
    const {queryByTestId} = render(`
      <div>
        <button data-testid="continue-button">Continue</button>
      </div>
    `)

    const continueButton = queryByTestId('continue-button')

    expect(continueButton).not.toHaveRole('listitem')
    expect(continueButton).toHaveRole('button')

    expect(() => {
      expect(continueButton).toHaveRole('listitem')
    }).toThrow(/expected element to have role/i)
    expect(() => {
      expect(continueButton).not.toHaveRole('button')
    }).toThrow(/expected element not to have role/i)
  })

  it('matches explicit role', () => {
    const {queryByTestId} = render(`
      <div>
        <div role="button" data-testid="continue-button">Continue</div>
      </div>
    `)

    const continueButton = queryByTestId('continue-button')

    expect(continueButton).not.toHaveRole('listitem')
    expect(continueButton).toHaveRole('button')

    expect(() => {
      expect(continueButton).toHaveRole('listitem')
    }).toThrow(/expected element to have role/i)
    expect(() => {
      expect(continueButton).not.toHaveRole('button')
    }).toThrow(/expected element not to have role/i)
  })
  it.todo('handles multiple explicit roles')
  it.todo('handles multiple implicit roles')
  it.todo('handles implicit roles with multiple conditions')
})
