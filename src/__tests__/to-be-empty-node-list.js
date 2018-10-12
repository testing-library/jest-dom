import {render} from './helpers/test-utils'

describe('NodeList .toBeEmpty', () => {
  test('runs without failing.', () => {
    const {container} = render(`
      <div>
        <span></span>
        <span></span>
      </div>`)

    const emptyNodes = container.querySelectorAll('span')
    expect(emptyNodes).toBeEmpty()
  })

  test('runs inverted without failing', () => {
    const {container} = render(`
      <div>
        <span>a</span>
        <span>a</span>
      </div>`)

    const emptyNodes = container.querySelectorAll('span')
    expect(emptyNodes).not.toBeEmpty()
  })

  test('fails correctly', () => {
    expect(() => {
      const {container} = render(`
      <div>
        <span></span>
        <span>a</span>
      </div>`)

      const emptyNodes = container.querySelectorAll('span')
      expect(emptyNodes).toBeEmpty()
    }).toThrowError()
  })

  test('fails inverted correctly', () => {
    expect(() => {
      const {container} = render(`
      <div>
        <span></span>
        <span>a</span>
      </div>`)

      const emptyNodes = container.querySelectorAll('span')
      expect(emptyNodes).not.toBeEmpty()
    }).toThrowError()
  })

  test('fails large amount of elements', () => {
    expect(() => {
      const {container} = render(`
    <div>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
      <span>a</span><span>a</span><span>a</span><span>a</span><span>a</span>
    </div>`)

      const emptyNodes = container.querySelectorAll('span')
      expect(emptyNodes).toBeEmpty()
    }).toThrowError()
  })
})
