import {render} from './helpers/test-utils'
import document from './helpers/document'

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
            background-color: black;
            color: white;
            float: left;
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
      'background-color:blue;color:white',
    )

    expect(container.querySelector('.label')).not.toHaveStyle(`
          color: white;
          font-weight: bold;
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
})
