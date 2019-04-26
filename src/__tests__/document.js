const {JSDOM} = require('jsdom')

test('Document', () => {
  const {window} = new JSDOM(
    `
    <!DOCTYPE html>
    <html lang="en" class="awesome" style="box-sizing: border-box">
      <head>
        <meta charset="utf-8">
      </head>
      <body id="lol">
        <div className="lol2">Hello world</div>
      </body>
    </html>
  `,
    {url: 'http://localhost'},
  )

  expect(window.document).toContainElement(window.document.body)
  expect(window.document).toContainElement(window.document.head)
  expect(window.document).toContainHTML('<meta charset="utf-8">')
  expect(window.document).toHaveAttribute('lang', 'en')
  expect(window.document).toHaveClass('awesome')
  expect(window.document).toBeEnabled()
  expect(window.document).toHaveStyle('box-sizing: border-box')
  expect(window.document).toHaveTextContent('Hello world')
  expect(window.document).toBeInTheDocument()
  expect(window.document).toBeVisible()
  expect(window.document).not.toHaveFocus()
  expect(window.document).not.toBeDisabled()
  expect(window.document).not.toBeEmpty()
})
