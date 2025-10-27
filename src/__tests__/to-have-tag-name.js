import {render} from './helpers/test-utils'

describe('.toHaveTagName', () => {
  test('handles HTML elements', () => {
    const {container} = render(`
      <div></div>
      <figure></figure>
      <section></section>
      <span></span>
    `)

    expect(container.querySelector('div')).toHaveTagName('div')
    expect(container.querySelector('figure')).toHaveTagName('figure')
    expect(container.querySelector('section')).toHaveTagName('section')
    expect(container.querySelector('span')).toHaveTagName('span')
    expect(container.querySelector('span')).not.toHaveTagName('div')
  })
})
