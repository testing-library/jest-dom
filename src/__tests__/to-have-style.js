import {render} from './helpers/test-utils'

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
