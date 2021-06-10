import {render} from './helpers/test-utils'

describe('.toHaveAccessibleName', () => {
  it("recognizes an element's content as its label when appropriate", () => {
    const {queryByTestId} = render(`
      <div>
        <ul data-testid="my-list">
          <li role="menuitem" data-testid="first"><strong>First</strong> element</li>
          <li role="menuitem" data-testid="second">Second <em>element</em></li>
        </ul>

        <button data-testid="my-button">
          <strong>Continue</strong> to the next step
        </button>
      </div>
    `)

    const list = queryByTestId('my-list')
    expect(list).not.toHaveAccessibleName()
    expect(() => {
      expect(list).toHaveAccessibleName()
    }).toThrow(/expected element to have accessible name/i)

    expect(queryByTestId('first')).toHaveAccessibleName('First element')
    expect(queryByTestId('second')).toHaveAccessibleName('Second element')

    const button = queryByTestId('my-button')
    expect(button).toHaveAccessibleName()
    expect(button).toHaveAccessibleName('Continue to the next step')
    expect(button).toHaveAccessibleName(/continue to the next step/i)
    expect(button).toHaveAccessibleName(
      expect.stringContaining('Continue to the next'),
    )
    expect(button).not.toHaveAccessibleName('Next step')
    expect(() => {
      expect(button).toHaveAccessibleName('Next step')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(button).not.toHaveAccessibleName('Continue to the next step')
    }).toThrow(/expected element not to have accessible name/i)
    expect(() => {
      expect(button).not.toHaveAccessibleName()
    }).toThrow(/expected element not to have accessible name/i)
  })

  it('works with label elements', () => {
    const {queryByTestId} = render(`
      <div>
        <label for="first-name-field">First name</label>
        <input type="text" id="first-name-field" data-testid="first-name-field" />

	      <label>
          <input type="checkbox" data-testid="checkbox-field" />
          Accept terms and conditions
	      </label>
      </div>
   `)

    const firstNameField = queryByTestId('first-name-field')
    expect(firstNameField).toHaveAccessibleName('First name')
    expect(queryByTestId('first-name-field')).toHaveAccessibleName(
      /first name/i,
    )
    expect(firstNameField).toHaveAccessibleName(
      expect.stringContaining('First'),
    )
    expect(() => {
      expect(firstNameField).toHaveAccessibleName('Last name')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(firstNameField).not.toHaveAccessibleName('First name')
    }).toThrow(/expected element not to have accessible name/i)

    const checkboxField = queryByTestId('checkbox-field')
    expect(checkboxField).toHaveAccessibleName('Accept terms and conditions')
    expect(checkboxField).toHaveAccessibleName(/accept terms/i)
    expect(checkboxField).toHaveAccessibleName(
      expect.stringContaining('Accept terms'),
    )
    expect(() => {
      expect(checkboxField).toHaveAccessibleName(
        'Accept our terms and conditions',
      )
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(checkboxField).not.toHaveAccessibleName(
        'Accept terms and conditions',
      )
    }).toThrow(/expected element not to have accessible name/i)
  })

  it('works with aria-label attributes', () => {
    const {queryByTestId} = render(`
      <div>
        <label for="first-name-field">First name</label>
        <input
          type="text"
          id="first-name-field"
          data-testid="first-name-field"
          aria-label="Enter your name"
        />

	      <label>
          <input
            type="checkbox"
            data-testid="checkbox-field"
            aria-label="Accept our terms and conditions"
          />
          Accept terms and conditions
	      </label>

        <button
          type="submit"
          data-testid="submit-button"
          aria-label="Submit this form"
        >
          Continue
        </button>
      </div>
   `)

    const firstNameField = queryByTestId('first-name-field')
    expect(firstNameField).not.toHaveAccessibleName('First name')
    expect(firstNameField).toHaveAccessibleName('Enter your name')
    expect(firstNameField).toHaveAccessibleName(/enter your name/i)
    expect(firstNameField).toHaveAccessibleName(
      expect.stringContaining('your name'),
    )
    expect(() => {
      expect(firstNameField).toHaveAccessibleName('First name')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(firstNameField).not.toHaveAccessibleName('Enter your name')
    }).toThrow(/expected element not to have accessible name/i)

    const checkboxField = queryByTestId('checkbox-field')
    expect(checkboxField).not.toHaveAccessibleName(
      'Accept terms and conditions',
    )
    expect(checkboxField).toHaveAccessibleName(
      'Accept our terms and conditions',
    )
    expect(checkboxField).toHaveAccessibleName(/accept our terms/i)
    expect(checkboxField).toHaveAccessibleName(expect.stringContaining('terms'))
    expect(() => {
      expect(checkboxField).toHaveAccessibleName('Accept terms and conditions')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(checkboxField).not.toHaveAccessibleName(
        'Accept our terms and conditions',
      )
    }).toThrow(/expected element not to have accessible name/i)

    const submitButton = queryByTestId('submit-button')
    expect(submitButton).not.toHaveAccessibleName('Continue')
    expect(submitButton).toHaveAccessibleName('Submit this form')
    expect(submitButton).toHaveAccessibleName(/submit this form/i)
    expect(submitButton).toHaveAccessibleName(expect.stringContaining('form'))
    expect(() => {
      expect(submitButton).toHaveAccessibleName('Continue')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(submitButton).not.toHaveAccessibleName('Submit this form')
    }).toThrow(/expected element not to have accessible name/i)
  })

  it('works with aria-labelledby attributes', () => {
    const {queryByTestId} = render(`
      <div>
        <label for="first-name-field">First name</label>
        <input
          type="text"
          id="first-name-field"
          data-testid="first-name-field"
          aria-labelledby="first-name-label"
        />
        <p id="first-name-label">Enter your name</p>

	      <label>
          <input
            type="checkbox"
            data-testid="checkbox-field"
            aria-labelledby="checkbox-label"
          />
          Accept terms and conditions
	      </label>
        <p id="checkbox-label">Accept our terms and conditions</p>

        <button
          type="submit"
          data-testid="submit-button"
          aria-labelledby="button-label"
        >
          Continue
        </button>
        <p id="button-label">Submit this form</p>
      </div>
   `)

    const firstNameField = queryByTestId('first-name-field')
    expect(firstNameField).not.toHaveAccessibleName('First name')
    expect(firstNameField).toHaveAccessibleName('Enter your name')
    expect(firstNameField).toHaveAccessibleName(/enter your name/i)
    expect(firstNameField).toHaveAccessibleName(
      expect.stringContaining('your name'),
    )
    expect(() => {
      expect(firstNameField).toHaveAccessibleName('First name')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(firstNameField).not.toHaveAccessibleName('Enter your name')
    }).toThrow(/expected element not to have accessible name/i)

    const checkboxField = queryByTestId('checkbox-field')
    expect(checkboxField).not.toHaveAccessibleName(
      'Accept terms and conditions',
    )
    expect(checkboxField).toHaveAccessibleName(
      'Accept our terms and conditions',
    )
    expect(checkboxField).toHaveAccessibleName(/accept our terms/i)
    expect(checkboxField).toHaveAccessibleName(expect.stringContaining('terms'))
    expect(() => {
      expect(checkboxField).toHaveAccessibleName('Accept terms and conditions')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(checkboxField).not.toHaveAccessibleName(
        'Accept our terms and conditions',
      )
    }).toThrow(/expected element not to have accessible name/i)

    const submitButton = queryByTestId('submit-button')
    expect(submitButton).not.toHaveAccessibleName('Continue')
    expect(submitButton).toHaveAccessibleName('Submit this form')
    expect(submitButton).toHaveAccessibleName(/submit this form/i)
    expect(submitButton).toHaveAccessibleName(expect.stringContaining('form'))
    expect(() => {
      expect(submitButton).toHaveAccessibleName('Continue')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(submitButton).not.toHaveAccessibleName('Submit this form')
    }).toThrow(/expected element not to have accessible name/i)
  })

  it('works with image alt attributes', () => {
    const {queryByTestId} = render(`
      <div>
        <img src="logo.png" alt="Company logo" data-testid="logo-img" />
        <button data-testid="close-button">
          <img src="close.png" alt="Close modal"  />
        </button>
      </div>
    `)

    const logoImage = queryByTestId('logo-img')
    expect(logoImage).toHaveAccessibleName('Company logo')
    expect(logoImage).toHaveAccessibleName(/company logo/i)
    expect(logoImage).toHaveAccessibleName(expect.stringContaining('logo'))
    expect(() => {
      expect(logoImage).toHaveAccessibleName('Our company logo')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(logoImage).not.toHaveAccessibleName('Company logo')
    }).toThrow(/expected element not to have accessible name/i)

    const closeButton = queryByTestId('close-button')
    expect(closeButton).toHaveAccessibleName('Close modal')
    expect(closeButton).toHaveAccessibleName(/close modal/i)
    expect(closeButton).toHaveAccessibleName(expect.stringContaining('modal'))
    expect(() => {
      expect(closeButton).toHaveAccessibleName('Close window')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(closeButton).not.toHaveAccessibleName('Close modal')
    }).toThrow(/expected element not to have accessible name/i)
  })

  it('works with svg title attributes', () => {
    const {queryByTestId} = render(`
      <svg data-testid="svg-title"><title>Test title</title></svg>
    `)

    const svgElement = queryByTestId('svg-title')
    expect(svgElement).toHaveAccessibleName('Test title')
    expect(svgElement).toHaveAccessibleName(/test title/i)
    expect(svgElement).toHaveAccessibleName(expect.stringContaining('Test'))
    expect(() => {
      expect(svgElement).toHaveAccessibleName('Another title')
    }).toThrow(/expected element to have accessible name/i)
    expect(() => {
      expect(svgElement).not.toHaveAccessibleName('Test title')
    }).toThrow(/expected element not to have accessible name/i)
  })

  it('works as in the examples in the README', () => {
    const {queryByTestId: getByTestId} = render(`
      <div>
        <img data-testid="img-alt" src="" alt="Test alt" />
        <img data-testid="img-empty-alt" src="" alt="" />
        <svg data-testid="svg-title"><title>Test title</title></svg>
        <button data-testid="button-img-alt"><img src="" alt="Test" /></button>
        <p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
        <button data-testid="svg-button"><svg><title>Test</title></svg></p>
        <div><svg data-testid="svg-without-title"></svg></div>
        <input data-testid="input-title" title="test" />
      </div>
    `)

    expect(getByTestId('img-alt')).toHaveAccessibleName('Test alt')
    expect(getByTestId('img-empty-alt')).not.toHaveAccessibleName()
    expect(getByTestId('svg-title')).toHaveAccessibleName('Test title')
    expect(getByTestId('button-img-alt')).toHaveAccessibleName()
    expect(getByTestId('img-paragraph')).not.toHaveAccessibleName()
    expect(getByTestId('svg-button')).toHaveAccessibleName()
    expect(getByTestId('svg-without-title')).not.toHaveAccessibleName()
    expect(getByTestId('input-title')).toHaveAccessibleName()
  })
})
