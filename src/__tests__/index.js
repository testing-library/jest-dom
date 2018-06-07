import '../extend-expect'
import {plugins} from 'pretty-format'
import {render} from './helpers/test-utils'

expect.addSnapshotSerializer(plugins.ConvertAnsi)

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
  expect(() =>
    expect({thisIsNot: 'an html element'}).not.toHaveAttribute(),
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

test('.toBeVisible', () => {
  const {container} = render(`
    <div>
      <header>
        <h1 style="display: none">Main title</h1>
        <h2 style="visibility: hidden">Secondary title</h2>
        <h3 style="visibility: collapse">Secondary title</h3>
        <h4 style="opacity: 0">Secondary title</h4>
        <h5 style="opacity: 0.1">Secondary title</h5>
      </header>
      <section style="display: block; visibility: hidden">
        <p>Hello <strong>World</strong></p>
      </section>
    </div>
  `)

  expect(container.querySelector('header')).toBeVisible()
  expect(container.querySelector('h1')).not.toBeVisible()
  expect(container.querySelector('h2')).not.toBeVisible()
  expect(container.querySelector('h3')).not.toBeVisible()
  expect(container.querySelector('h4')).not.toBeVisible()
  expect(container.querySelector('h5')).toBeVisible()
  expect(container.querySelector('strong')).not.toBeVisible()

  expect(() =>
    expect(container.querySelector('header')).not.toBeVisible(),
  ).toThrowError()
  expect(() =>
    expect(container.querySelector('p')).toBeVisible(),
  ).toThrowError()
})
