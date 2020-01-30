import {render} from './helpers/test-utils'
import document from './helpers/document'

// eslint-disable-next-line max-lines-per-function
describe('.toHaveStyle', () => {
  test('handles positive test cases', () => {
    const {container} = render(`
          <div class="label" style="background-color: blue; height: 100%">
            Hello World
          </div>
        `)

    const style = document.createElement('style')
    style.innerHTML = `
          .label {
            align-items: center;
            background-color: black;
            color: white;
            float: left;
            transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
            transform: translateX(0px);
          }
        `
    document.body.appendChild(style)
    document.body.appendChild(container)

    expect(container.querySelector('.label')).toHaveStyle(`
          height: 100%;
          color: white;
          background-color: blue;
        `)

    expect(container.querySelector('.label')).toHaveStyle(`
          background-color: blue;
          color: white;
        `)

    expect(container.querySelector('.label')).toHaveStyle(
      'transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275)',
    )

    expect(container.querySelector('.label')).toHaveStyle(
      'background-color:blue;color:white',
    )

    expect(container.querySelector('.label')).not.toHaveStyle(`
          color: white;
          font-weight: bold;
        `)

    expect(container.querySelector('.label')).toHaveStyle(`
        Align-items: center;
      `)

    expect(container.querySelector('.label')).toHaveStyle(`
      transform: translateX(0px);
    `)
  })

  test('handles negative test cases', () => {
    const {container} = render(`
    <div class="label" style="background-color: blue; height: 100%">
      Hello World
    </div>
  `)

    const style = document.createElement('style')
    style.innerHTML = `
    .label {
      background-color: black;
      color: white;
      float: left;
      transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
    }
  `
    document.body.appendChild(style)
    document.body.appendChild(container)

    expect(() =>
      expect(container.querySelector('.label')).toHaveStyle(
        'font-weight: bold',
      ),
    ).toThrowError()

    expect(() =>
      expect(container.querySelector('.label')).not.toHaveStyle('color: white'),
    ).toThrowError()

    expect(() =>
      expect(container.querySelector('.label')).toHaveStyle(
        'transition: all 0.7s ease, width 1.0s cubic-bezier(3, 4, 5, 6);',
      ),
    ).toThrowError()

    // Make sure the test fails if the css syntax is not valid
    expect(() =>
      expect(container.querySelector('.label')).not.toHaveStyle(
        'font-weight bold',
      ),
    ).toThrowError()

    expect(() =>
      expect(container.querySelector('.label')).toHaveStyle('color white'),
    ).toThrowError()

    document.body.removeChild(style)
    document.body.removeChild(container)
  })

  test('properly normalizes colors', () => {
    const {queryByTestId} = render(`
      <span data-testid="color-example" style="background-color: #123456">Hello World</span>
    `)
    expect(queryByTestId('color-example')).toHaveStyle(
      'background-color: #123456',
    )
  })

  test('properly normalizes colors for border', () => {
    const {queryByTestId} = render(`
    <span data-testid="color-example" style="border: 1px solid #fff">Hello World</span>
  `)
    expect(queryByTestId('color-example')).toHaveStyle('border: 1px solid #fff')
  })

  test('handles different color declaration formats', () => {
    const {queryByTestId} = render(`
      <span data-testid="color-example" style="color: rgba(0, 0, 0, 1); background-color: #000000">Hello World</span>
    `)

    expect(queryByTestId('color-example')).toHaveStyle('color: #000000')
    expect(queryByTestId('color-example')).toHaveStyle(
      'background-color: rgba(0, 0, 0, 1)',
    )
  })

  test('handles nonexistent styles', () => {
    const {container} = render(`
          <div class="label" style="background-color: blue; height: 100%">
            Hello World
          </div>
        `)

    expect(container.querySelector('.label')).not.toHaveStyle(
      'whatever: anything',
    )
  })

  test('handles styles as object', () => {
    const {container} = render(`
      <div class="label" style="background-color: blue; height: 100%">
        Hello World
      </div>
    `)

    expect(container.querySelector('.label')).toHaveStyle({
      backgroundColor: 'blue',
    })
    expect(container.querySelector('.label')).toHaveStyle({
      backgroundColor: 'blue',
      height: '100%',
    })
    expect(container.querySelector('.label')).not.toHaveStyle({
      backgroundColor: 'red',
      height: '100%',
    })
    expect(container.querySelector('.label')).not.toHaveStyle({
      whatever: 'anything',
    })
  })
})
