import {render} from './helpers/test-utils'

describe('.toContainAnyByAltText / .toContainOneByAltText', () => {
  const {container} = render(`<img data-testid="img" alt="profile photo" />`)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByAltText('profile photo')
    expect(container).toContainOneByAltText('profile photo')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByAltText('missing')
    expect(container).not.toContainOneByAltText('missing')
  })

  test('toContainAnyByAltText throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByAltText('missing'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByAltText(</><green>alt text</><dim>)</>

      Expected element to contain any descendant by alt text:
      <green>  missing</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByAltText throws when no elements match', () => {
    expect(() => expect(container).toContainOneByAltText('missing'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByAltText(</><green>alt text</><dim>)</>

      Expected element to contain one descendant by alt text:
      <green>  missing</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByAltText throws when multiple elements match', () => {
    const {container: multipleContainer} = render(`
      <img alt="logo" />
      <img alt="logo" />
    `)
    expect(multipleContainer).toContainAnyByAltText('logo')
    expect(() => expect(multipleContainer).toContainOneByAltText('logo'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByAltText(</><green>alt text</><dim>)</>

      Expected element to contain one descendant by alt text:
      <green>  logo</>
      Received:
      <red>  2</>

      Here are the matching elements:

      <cyan><img</>
        <yellow>alt</>=<green>"logo"</>
      <cyan>/></>

      <cyan><img</>
        <yellow>alt</>=<green>"logo"</>
      <cyan>/></>
    `)
  })

  test('.not.toContainOneByAltText throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByAltText('profile photo'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByAltText(</><green>alt text</><dim>)</>

      Expected element not to contain one descendant by alt text:
      <green>  profile photo</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><img</>
        <yellow>alt</>=<green>"profile photo"</>
        <yellow>data-testid</>=<green>"img"</>
      <cyan>/></>
    `)
  })

  test('throws when container is not a valid HTML element', () => {
    expect(() => expect(null).toContainAnyByAltText('profile photo'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>received</><dim>).toContainAnyByAltText()</>

      <red>received</> value must be an HTMLElement or an SVGElement.
      Received has value: <red>null</>
    `)
  })
})

describe('.toContainAnyByDisplayValue / .toContainOneByDisplayValue', () => {
  const {container} = render(`
    <select data-testid="select">
      <option selected>Option A</option>
    </select>
  `)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByDisplayValue('Option A')
    expect(container).toContainOneByDisplayValue('Option A')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByDisplayValue('Option B')
    expect(container).not.toContainOneByDisplayValue('Option B')
  })

  test('toContainAnyByDisplayValue throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByDisplayValue('Option B'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByDisplayValue(</><green>display value</><dim>)</>

      Expected element to contain any descendant by display value:
      <green>  Option B</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByDisplayValue throws when no elements match', () => {
    expect(() => expect(container).toContainOneByDisplayValue('Option B'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByDisplayValue(</><green>display value</><dim>)</>

      Expected element to contain one descendant by display value:
      <green>  Option B</>
      Received:
      <red>  0</>
    `)
  })

  test('.not.toContainOneByDisplayValue throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByDisplayValue('Option A'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByDisplayValue(</><green>display value</><dim>)</>

      Expected element not to contain one descendant by display value:
      <green>  Option A</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><select</>
        <yellow>data-testid</>=<green>"select"</>
      <cyan>></>
        </>
            </>
        <cyan><option</>
          <yellow>selected</>=<green>""</>
        <cyan>></>
          </>Option A</>
        <cyan></option></>
        </>
          </>
      <cyan></select></>
    `)
  })
})

describe('.toContainAnyByLabelText / .toContainOneByLabelText', () => {
  const {container} = render(`
    <label for="name">Full name</label>
    <input id="name" data-testid="input" placeholder="Enter name" />
  `)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByLabelText('Full name')
    expect(container).toContainOneByLabelText('Full name')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByLabelText('Missing label')
    expect(container).not.toContainOneByLabelText('Missing label')
  })

  test('toContainAnyByLabelText throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByLabelText('Missing label'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByLabelText(</><green>label text</><dim>)</>

      Expected element to contain any descendant by label text:
      <green>  Missing label</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByLabelText throws when no elements match', () => {
    expect(() => expect(container).toContainOneByLabelText('Missing label'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByLabelText(</><green>label text</><dim>)</>

      Expected element to contain one descendant by label text:
      <green>  Missing label</>
      Received:
      <red>  0</>
    `)
  })

  test('passes selector option through to the query', () => {
    expect(container).toContainOneByLabelText('Full name', {selector: 'input'})
    expect(container).not.toContainOneByLabelText('Full name', {
      selector: 'select',
    })
  })

  test('.not.toContainOneByLabelText throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByLabelText('Full name'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByLabelText(</><green>label text</><dim>)</>

      Expected element not to contain one descendant by label text:
      <green>  Full name</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><input</>
        <yellow>data-testid</>=<green>"input"</>
        <yellow>id</>=<green>"name"</>
        <yellow>placeholder</>=<green>"Enter name"</>
      <cyan>/></>
    `)
  })
})

describe('.toContainAnyByPlaceholderText / .toContainOneByPlaceholderText', () => {
  const {container} = render(`
    <input id="name" data-testid="input" placeholder="Enter name" />
  `)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByPlaceholderText('Enter name')
    expect(container).toContainOneByPlaceholderText('Enter name')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByPlaceholderText('Missing')
    expect(container).not.toContainOneByPlaceholderText('Missing')
  })

  test('toContainAnyByPlaceholderText throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByPlaceholderText('Missing'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByPlaceholderText(</><green>placeholder text</><dim>)</>

      Expected element to contain any descendant by placeholder text:
      <green>  Missing</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByPlaceholderText throws when no elements match', () => {
    expect(() => expect(container).toContainOneByPlaceholderText('Missing'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByPlaceholderText(</><green>placeholder text</><dim>)</>

      Expected element to contain one descendant by placeholder text:
      <green>  Missing</>
      Received:
      <red>  0</>
    `)
  })

  test('.not.toContainOneByPlaceholderText throws when exactly one element matches', () => {
    expect(() =>
      expect(container).not.toContainOneByPlaceholderText('Enter name'),
    ).toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByPlaceholderText(</><green>placeholder text</><dim>)</>

      Expected element not to contain one descendant by placeholder text:
      <green>  Enter name</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><input</>
        <yellow>data-testid</>=<green>"input"</>
        <yellow>id</>=<green>"name"</>
        <yellow>placeholder</>=<green>"Enter name"</>
      <cyan>/></>
    `)
  })
})

describe('.toContainAnyByRole / .toContainOneByRole', () => {
  const {container} = render(`
    <div role="alert" data-testid="alert">Something went wrong.</div>
    <h1 title="Page title" data-testid="heading">Welcome</h1>
  `)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByRole('alert')
    expect(container).toContainOneByRole('alert')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByRole('dialog')
    expect(container).not.toContainOneByRole('dialog')
  })

  test('toContainAnyByRole throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByRole('dialog'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByRole(</><green>role</><dim>)</>

      Expected element to contain any descendant by role:
      <green>  dialog</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByRole throws when no elements match', () => {
    expect(() => expect(container).toContainOneByRole('dialog'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByRole(</><green>role</><dim>)</>

      Expected element to contain one descendant by role:
      <green>  dialog</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByRole throws when multiple elements match', () => {
    const {container: multipleContainer} = render(`
      <div role="listitem">A</div>
      <div role="listitem">B</div>
    `)
    expect(multipleContainer).toContainAnyByRole('listitem')
    expect(() => expect(multipleContainer).toContainOneByRole('listitem'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByRole(</><green>role</><dim>)</>

      Expected element to contain one descendant by role:
      <green>  listitem</>
      Received:
      <red>  2</>

      Here are the matching elements:

      <cyan><div</>
        <yellow>role</>=<green>"listitem"</>
      <cyan>></>
        </>A</>
      <cyan></div></>

      <cyan><div</>
        <yellow>role</>=<green>"listitem"</>
      <cyan>></>
        </>B</>
      <cyan></div></>
    `)
  })

  test('passes role option through to the query', () => {
    expect(container).toContainOneByRole('heading', {name: 'Welcome'})
    expect(container).not.toContainOneByRole('heading', {name: 'Other text'})
  })

  test('toContainOneByRole throws with options in the hint', () => {
    expect(() =>
      expect(container).toContainOneByRole('heading', {name: 'Missing'}),
    ).toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByRole(</><green>role</><dim>, </><green><green>{"name": "Missing"}</><green></><dim>)</>

      Expected element to contain one descendant by role:
      <green>  heading</>
      Received:
      <red>  0</>
    `)
  })

  test('.not.toContainOneByRole throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByRole('alert'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByRole(</><green>role</><dim>)</>

      Expected element not to contain one descendant by role:
      <green>  alert</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><div</>
        <yellow>data-testid</>=<green>"alert"</>
        <yellow>role</>=<green>"alert"</>
      <cyan>></>
        </>Something went wrong.</>
      <cyan></div></>
    `)
  })
})

describe('.toContainAnyByTestId / .toContainOneByTestId', () => {
  const {container} = render(`
    <div data-testid="alert" role="alert">Something went wrong.</div>
  `)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByTestId('alert')
    expect(container).toContainOneByTestId('alert')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByTestId('missing')
    expect(container).not.toContainOneByTestId('missing')
  })

  test('toContainAnyByTestId throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByTestId('missing'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByTestId(</><green>test ID</><dim>)</>

      Expected element to contain any descendant by test ID:
      <green>  missing</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByTestId throws when no elements match', () => {
    expect(() => expect(container).toContainOneByTestId('missing'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByTestId(</><green>test ID</><dim>)</>

      Expected element to contain one descendant by test ID:
      <green>  missing</>
      Received:
      <red>  0</>
    `)
  })

  test('.not.toContainOneByTestId throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByTestId('alert'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByTestId(</><green>test ID</><dim>)</>

      Expected element not to contain one descendant by test ID:
      <green>  alert</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><div</>
        <yellow>data-testid</>=<green>"alert"</>
        <yellow>role</>=<green>"alert"</>
      <cyan>></>
        </>Something went wrong.</>
      <cyan></div></>
    `)
  })

  test('throws when container is not a valid HTML element', () => {
    expect(() => expect(null).toContainAnyByTestId('alert'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>received</><dim>).toContainAnyByTestId()</>

      <red>received</> value must be an HTMLElement or an SVGElement.
      Received has value: <red>null</>
    `)
  })
})

describe('.toContainAnyByText / .toContainOneByText', () => {
  const {container} = render(`<span data-testid="span">Hello world</span>`)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByText('Hello world')
    expect(container).toContainOneByText('Hello world')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByText('Goodbye world')
    expect(container).not.toContainOneByText('Goodbye world')
  })

  test('toContainAnyByText throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByText(/Goodbye/i))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByText(</><green>text</><dim>)</>

      Expected element to contain any descendant by text:
      <green>  /Goodbye/i</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByText throws when no elements match', () => {
    expect(() => expect(container).toContainOneByText('Goodbye world'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByText(</><green>text</><dim>)</>

      Expected element to contain one descendant by text:
      <green>  Goodbye world</>
      Received:
      <red>  0</>
    `)
  })

  test('passes exact option through to the query', () => {
    expect(container).toContainOneByText('Hello world', {exact: false})
    expect(container).not.toContainOneByText('Hello', {exact: true})
  })

  test('.not.toContainOneByText throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByText('Hello world'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByText(</><green>text</><dim>)</>

      Expected element not to contain one descendant by text:
      <green>  Hello world</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><span</>
        <yellow>data-testid</>=<green>"span"</>
      <cyan>></>
        </>Hello world</>
      <cyan></span></>
    `)
  })
})

describe('.toContainAnyByTitle / .toContainOneByTitle', () => {
  const {container} = render(`
    <h1 title="Page title" data-testid="heading">Welcome</h1>
  `)

  test('passes when one element matches', () => {
    expect(container).toContainAnyByTitle('Page title')
    expect(container).toContainOneByTitle('Page title')
  })

  test('fails with .not when no elements match', () => {
    expect(container).not.toContainAnyByTitle('Missing title')
    expect(container).not.toContainOneByTitle('Missing title')
  })

  test('toContainAnyByTitle throws when no elements match', () => {
    expect(() => expect(container).toContainAnyByTitle('Missing title'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainAnyByTitle(</><green>title</><dim>)</>

      Expected element to contain any descendant by title:
      <green>  Missing title</>
      Received:
      <red>  0</>
    `)
  })

  test('toContainOneByTitle throws when no elements match', () => {
    expect(() => expect(container).toContainOneByTitle('Missing title'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).toContainOneByTitle(</><green>title</><dim>)</>

      Expected element to contain one descendant by title:
      <green>  Missing title</>
      Received:
      <red>  0</>
    `)
  })

  test('.not.toContainOneByTitle throws when exactly one element matches', () => {
    expect(() => expect(container).not.toContainOneByTitle('Page title'))
      .toThrowErrorMatchingInlineSnapshot(`
      <dim>expect(</><red>element</><dim>).not.toContainOneByTitle(</><green>title</><dim>)</>

      Expected element not to contain one descendant by title:
      <green>  Page title</>
      Received:
      <red>  1</>

      Here are the matching elements:

      <cyan><h1</>
        <yellow>data-testid</>=<green>"heading"</>
        <yellow>title</>=<green>"Page title"</>
      <cyan>></>
        </>Welcome</>
      <cyan></h1></>
    `)
  })
})
