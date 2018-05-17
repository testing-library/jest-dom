import '../extend-expect'
import {render} from './helpers/test-utils'

test('.toBeInTheDOM', () => {
  const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

  expect(queryByTestId('count-value')).toBeInTheDOM()
  expect(queryByTestId('count-value1')).not.toBeInTheDOM()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('count-value')).not.toBeInTheDOM(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value1')).toBeInTheDOM(),
  ).toThrowError()
  expect(() =>
    expect({thisIsNot: 'an html element'}).toBeInTheDOM(),
  ).toThrowError()
})

test('.toHaveTextContent', () => {
  const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

  expect(queryByTestId('count-value')).toHaveTextContent('2')
  expect(queryByTestId('count-value')).toHaveTextContent(/2/)
  expect(queryByTestId('count-value')).not.toHaveTextContent('21')
  expect(() =>
    expect(queryByTestId('count-value2')).toHaveTextContent('2'),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('count-value')).toHaveTextContent('3'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).not.toHaveTextContent('2'),
  ).toThrowError()
})

test('.toHaveAttribute', () => {
  const {queryByTestId} = render(`
    <button data-testid="ok-button" type="submit" disabled>
      OK
    </button>
  `)

  expect(queryByTestId('ok-button')).toHaveAttribute('disabled')
  expect(queryByTestId('ok-button')).toHaveAttribute('type')
  expect(queryByTestId('ok-button')).not.toHaveAttribute('class')
  expect(queryByTestId('ok-button')).toHaveAttribute('type', 'submit')
  expect(queryByTestId('ok-button')).not.toHaveAttribute('type', 'button')

  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttribute('disabled'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttribute('type'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttribute('class'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttribute('type', 'submit'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttribute('type', 'button'),
  ).toThrowError()
})

test('.toHaveClass', () => {
  const {queryByTestId} = render(`
    <div>
      <button data-testid="delete-button" class="btn extra btn-danger">
        Delete item
      </button>
      <button data-testid="cancel-button">
        Cancel
      </button>
    </div>
  `)

  expect(queryByTestId('delete-button')).toHaveClass('btn')
  expect(queryByTestId('delete-button')).toHaveClass('btn-danger')
  expect(queryByTestId('delete-button')).toHaveClass('extra')
  expect(queryByTestId('delete-button')).not.toHaveClass('xtra')
  expect(queryByTestId('delete-button')).toHaveClass('btn btn-danger')
  expect(queryByTestId('delete-button')).not.toHaveClass('btn-link')
  expect(queryByTestId('cancel-button')).not.toHaveClass('btn-danger')

  expect(() =>
    expect(queryByTestId('delete-button')).not.toHaveClass('btn'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('delete-button')).not.toHaveClass('btn-danger'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('delete-button')).not.toHaveClass('extra'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('delete-button')).toHaveClass('xtra'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('delete-button')).not.toHaveClass('btn btn-danger'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('delete-button')).toHaveClass('btn-link'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('cancel-button')).toHaveClass('btn-danger'),
  ).toThrowError()
})

test('.toHaveStyle', () => {
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

  expect(() =>
    expect(container.querySelector('.label')).toHaveStyle('font-weight: bold'),
  ).toThrowError()
  expect(() =>
    expect(container.querySelector('.label')).not.toHaveStyle('color: white'),
  ).toThrowError()

  document.body.removeChild(style)
  document.body.removeChild(container)
})
