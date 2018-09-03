describe('NodeList .toBeEmpty', () => {
  test('runs without failing.', () => {
    document.body.innerHTML = `
      <div>
        <span></span>
        <span></span>
      </div>`

    const emptyNodes = document.querySelectorAll('span')
    expect(emptyNodes).toBeEmpty()
  })

  test('runs inverted without failing', () => {
    document.body.innerHTML = `
      <div>
        <span>a</span>
        <span>a</span>
      </div>`

    const emptyNodes = document.querySelectorAll('span')
    expect(emptyNodes).not.toBeEmpty()
  })

  test('fails normally correctly', () => {
    expect(() => {
      document.body.innerHTML = `
      <div>
        <span></span>
        <span>a</span>
      </div>`

      const emptyNodes = document.querySelectorAll('span')
      expect(emptyNodes).toBeEmpty()
    }).toThrowError()
  })

  test('fails inverted correctly', () => {
    expect(() => {
      document.body.innerHTML = `
      <div>
        <span></span>
        <span>a</span>
      </div>`

      const emptyNodes = document.querySelectorAll('span')
      expect(emptyNodes).not.toBeEmpty()
    }).toThrowError()
  })

  test('fails a large amount of elements', () => {
    expect(() => {
      document.body.innerHTML = `
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
    </div>`

      const emptyNodes = document.querySelectorAll('span')
      expect(emptyNodes).toBeEmpty()
    }).toThrowError()
  })
})
