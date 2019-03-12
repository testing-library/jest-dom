import {render} from './helpers/test-utils'

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
      <button hidden>Hidden button</button>
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
  expect(container.querySelector('button')).not.toBeVisible()
  expect(container.querySelector('strong')).not.toBeVisible()

  expect(() =>
    expect(container.querySelector('header')).not.toBeVisible(),
  ).toThrowError()
  expect(() =>
    expect(container.querySelector('p')).toBeVisible(),
  ).toThrowError()
})
