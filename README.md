<div align="center">
<h1>jest-dom</h1>

<a href="https://www.emojione.com/emoji/1f989">
<img height="80" width="80" alt="owl" src="https://raw.githubusercontent.com/gnapse/jest-dom/master/other/owl.png" />
</a>

<p>Custom jest matchers to test the state of the DOM</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-23-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

You want to use [jest][] to write tests that assert various things about the
state of a DOM. As part of that goal, you want to avoid all the repetitive
patterns that arise in doing so. Checking for an element's attributes, its text
content, its css classes, you name it.

## This solution

The `jest-dom` library provides a set of custom jest matchers that you can use
to extend jest. These will make your tests more declarative, clear to read and
to maintain.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Custom matchers](#custom-matchers)
  - [`toBeDisabled`](#tobedisabled)
  - [`toBeEnabled`](#tobeenabled)
  - [`toBeEmpty`](#tobeempty)
  - [`toBeInTheDocument`](#tobeinthedocument)
  - [`toBeVisible`](#tobevisible)
  - [`toContainElement`](#tocontainelement)
  - [`toContainHTML`](#tocontainhtml)
  - [`toHaveAttribute`](#tohaveattribute)
  - [`toHaveClass`](#tohaveclass)
  - [`toHaveFocus`](#tohavefocus)
  - [`toHaveFormValues`](#tohaveformvalues)
  - [`toHaveStyle`](#tohavestyle)
  - [`toHaveTextContent`](#tohavetextcontent)
- [Deprecated matchers](#deprecated-matchers)
  - [`toBeInTheDOM`](#tobeinthedom)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev jest-dom
```

## Usage

Import `jest-dom/extend-expect` once (for instance in your [tests setup file][])
and you're good to go:

[tests setup file]: https://facebook.github.io/jest/docs/en/configuration.html#setuptestframeworkscriptfile-string

```javascript
import 'jest-dom/extend-expect'
```

Alternatively, you can selectively import only the matchers you intend to use,
and extend jest's `expect` yourself:

```javascript
import {toBeInTheDocument, toHaveClass} from 'jest-dom'

expect.extend({toBeInTheDocument, toHaveClass})
```

> Note: when using TypeScript, this way of importing matchers won't provide the
> necessary type definitions. More on this [here](https://github.com/gnapse/jest-dom/pull/11#issuecomment-387817459).

## Custom matchers

`jest-dom` can work with any library or framework that returns DOM elements from queries. The custom matcher examples below demonstrate using `document.querySelector` and [dom-testing-library](https://github.com/kentcdodds/dom-testing-library) for querying DOM elements.

### `toBeDisabled`

```typescript
toBeDisabled()
```

This allows you to check whether an element is disabled from the user's perspective.

It matches if the element is a form control and the `disabled` attribute is
specified on this element or the element is a descendant of a form element
with a `disabled` attribute.

According to the specification, the following elements can be [actually disabled](https://html.spec.whatwg.org/multipage/semantics-other.html#disabled-elements):
`button`, `input`, `select`, `textarea`, `optgroup`, `option`, `fieldset`.

#### Examples

```html
<button data-testid="button" type="submit" disabled>submit</button>
<fieldset disabled><input type="text" data-testid="input" /></fieldset>
<a href="..." disabled>link</a>
```

##### Using document.querySelector

```javascript
expect(document.querySelector('[data-testid="button"]')).toBeDisabled()
expect(document.querySelector('[data-testid="input"]')).toBeDisabled()
expect(document.querySelector('a')).not.toBeDisabled()
```

##### Using dom-testing-library

```javascript
expect(getByTestId(container, 'button')).toBeDisabled()
expect(getByTestId(container, 'input')).toBeDisabled()
expect(getByText(container, 'link')).not.toBeDisabled()
```

<hr />

### `toBeEnabled`

```typescript
toBeEnabled()
```

This allows you to check whether an element is not disabled from the user's perspective.

It works like `not.toBeDisabled()`. Use this matcher to avoid double negation in your tests.

<hr />

### `toBeEmpty`

```typescript
toBeEmpty()
```

This allows you to assert whether an element has content or not.

#### Examples

```html
<span data-testid="not-empty"><span data-testid="empty"></span></span>
```

##### Using document.querySelector

```javascript
expect(document.querySelector('[data-testid="empty"]').toBeEmpty()
expect(document.querySelector('[data-testid="not-empty"]').not.toBeEmpty()
```

##### Using dom-testing-library

```javascript
expect(queryByTestId(container, 'empty')).toBeEmpty()
expect(queryByTestId(container, 'not-empty')).not.toBeEmpty()
```

<hr />

### `toBeInTheDocument`

```typescript
toBeInTheDocument()
```

This allows you to assert whether an element is present in the document or not.

#### Examples

```html
<span data-testid="html-element"><span>Html Element</span></span>
<svg data-testid="svg-element"></svg>
```

##### Using document.querySelector

```javascript
const htmlElement = document.querySelector('[data-testid="html-element"]')
const svgElement = document.querySelector('[data-testid="svg-element"]')
const nonExistantElement = document.querySelector('does-not-exist')
const detachedElement = document.createElement('div')

expect(htmlElement).toBeInTheDocument()
expect(svgElement).toBeInTheDocument()
expect(nonExistantElement).not.toBeInTheDocument()
expect(detachedElement).not.toBeInTheDocument()
```

##### Using dom-testing-library

```javascript
expect(
  queryByTestId(document.documentElement, 'html-element'),
).toBeInTheDocument()
expect(
  queryByTestId(document.documentElement, 'svg-element'),
).toBeInTheDocument()
expect(
  queryByTestId(document.documentElement, 'does-not-exist'),
).not.toBeInTheDocument()
```

> Note: This matcher does not find detached elements. The element must be added to the document to be found by toBeInTheDocument. If you desire to search in a detached element please use: [`toContainElement`](#tocontainelement)

<hr />

### `toBeVisible`

```typescript
toBeVisible()
```

This allows you to check if an element is currently visible to the user.

An element is visible if **all** the following conditions are met:

- it does not have its css property `display` set to `none`
- it does not have its css property `visibility` set to either `hidden` or
  `collapse`
- it does not have its css property `opacity` set to `0`
- its parent element is also visible (and so on up to the top of the DOM tree)
- it does not have the [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) attribute

#### Examples

```html
<div data-testid="zero-opacity" style="opacity: 0">Zero Opacity Example</div>
<div data-testid="visibility-hidden" style="visibility: hidden">
  Visibility Hidden Example
</div>
<div data-testid="display-none" style="display: none">Display None Example</div>
<div style="opacity: 0">
  <span data-testid="hidden-parent">Hidden Parent Example</span>
</div>
<div data-testid="visible">Visible Example</div>
<div data-testid="hidden-attribute" hidden>Hidden Attribute Example</div>
```

##### Using document.querySelector

```javascript
expect(document.querySelector('[data-testid="zero-opacity"]')).not.toBeVisible()
expect(
  document.querySelector('[data-testid="visibility-hidden"]'),
).not.toBeVisible()
expect(document.querySelector('[data-testid="display-none"]')).not.toBeVisible()
expect(
  document.querySelector('[data-testid="hidden-parent"]'),
).not.toBeVisible()
expect(document.querySelector('[data-testid="visible"]')).toBeVisible()
expect(
  document.querySelector('[data-testid="hidden-attribute"]'),
).not.toBeVisible()
```

##### Using dom-testing-library

```javascript
expect(getByText(container, 'Zero Opacity Example')).not.toBeVisible()
expect(getByText(container, 'Visibility Hidden Example')).not.toBeVisible()
expect(getByText(container, 'Display None Example')).not.toBeVisible()
expect(getByText(container, 'Hidden Parent Example')).not.toBeVisible()
expect(getByText(container, 'Visible Example')).toBeVisible()
expect(getByText(container, 'Hidden Attribute Example')).not.toBeVisible()
```

<hr />

### `toContainElement`

```typescript
toContainElement(element: HTMLElement | SVGElement | null)
```

This allows you to assert whether an element contains another element as a descendant or not.

#### Examples

```html
<span data-testid="ancestor"><span data-testid="descendant"></span></span>
```

##### Using document.querySelector

```javascript
const ancestor = document.querySelector('[data-testid="ancestor"]')
const descendant = document.querySelector('[data-testid="descendant"]')
const nonExistantElement = document.querySelector(
  '[data-testid="does-not-exist"]',
)

expect(ancestor).toContainElement(descendant)
expect(descendant).not.toContainElement(ancestor)
expect(ancestor).not.toContainElement(nonExistantElement)
```

##### Using dom-testing-library

```javascript
const {queryByTestId} = render(/* Rendered HTML */)

const ancestor = queryByTestId(container, 'ancestor')
const descendant = queryByTestId(container, 'descendant')
const nonExistantElement = queryByTestId(container, 'does-not-exist')

expect(ancestor).toContainElement(descendant)
expect(descendant).not.toContainElement(ancestor)
expect(ancestor).not.toContainElement(nonExistantElement)
```

<hr />

### `toContainHTML`

```typescript
toContainHTML(htmlText: string)
```

Assert whether a string representing a HTML element is contained in another element:

#### Examples

```html
<span data-testid="parent"><span data-testid="child"></span></span>
```

##### Using document.querySelector

```javascript
expect(document.querySelector('[data-testid="parent"]')).toContainHTML(
  '<span data-testid="child"></span>',
)
```

##### Using dom-testing-library

```javascript
expect(getByTestId(container, 'parent')).toContainHTML(
  '<span data-testid="child"></span>',
)
```

> Chances are you probably do not need to use this matcher. We encourage testing from the perspective of how the user perceives the app in a browser. That's why testing against a specific DOM structure is not advised.
>
> It could be useful in situations where the code being tested renders html that was obtained from an external source, and you want to validate that that html code was used as intended.
>
> It should not be used to check DOM structure that you control. Please use [`toContainElement`](#tocontainelement) instead.

<hr />

### `toHaveAttribute`

```typescript
toHaveAttribute(attr: string, value?: string)
```

This allows you to check whether the given element has an attribute or not. You
can also optionally check that the attribute has a specific expected value.

#### Examples

```html
<button data-testid="ok-button" type="submit" disabled>ok</button>
```

##### Using document.querySelector

```javascript
const button = document.querySelector('[data-testid="ok-button"]')

expect(button).toHaveAttribute('disabled')
expect(button).toHaveAttribute('type', 'submit')
expect(button).not.toHaveAttribute('type', 'button')
```

##### Using dom-testing-library

```javascript
const button = getByTestId(container, 'ok-button')

expect(button).toHaveAttribute('disabled')
expect(button).toHaveAttribute('type', 'submit')
expect(button).not.toHaveAttribute('type', 'button')
```

<hr />

### `toHaveClass`

```typescript
toHaveClass(...classNames: string[])
```

This allows you to check whether the given element has certain classes within its
`class` attribute.

You must provide at least one class, unless you are asserting that an element
does not have any classes.

#### Examples

```html
<button data-testid="delete-button" class="btn extra btn-danger">
  Delete item
</button>
<button data-testid="no-classes">No Classes</button>
```

##### Using document.querySelector

```javascript
const deleteButton = document.querySelector('[data-testid="delete-button"]')
const noClasses = document.querySelector('[data-testid="no-classes"]')

expect(deleteButton).toHaveClass('extra')
expect(deleteButton).toHaveClass('btn-danger btn')
expect(deleteButton).toHaveClass('btn-danger', 'btn')
expect(deleteButton).not.toHaveClass('btn-link')

expect(noClasses).not.toHaveClass()
```

##### Using dom-testing-library

```javascript
const deleteButton = getByTestId(container, 'delete-button')
const noClasses = getByTestId(container, 'no-classes')

expect(deleteButton).toHaveClass('extra')
expect(deleteButton).toHaveClass('btn-danger btn')
expect(deleteButton).toHaveClass('btn-danger', 'btn')
expect(deleteButton).not.toHaveClass('btn-link')

expect(noClasses).not.toHaveClass()
```

<hr />

### `toHaveFocus`

```typescript
toHaveFocus()
```

This allows you to assert whether an element has focus or not.

#### Examples

```html
<div><input type="text" data-testid="element-to-focus" /></div>
```

##### Using document.querySelector

```javascript
const input = document.querySelector(['data-testid="element-to-focus"')

input.focus()
expect(input).toHaveFocus()

input.blur()
expect(input).not.toHaveFocus()
```

##### Using dom-testing-library

```javascript
const input = queryByTestId(container, 'element-to-focus')

fireEvent.focus(input)
expect(input).toHaveFocus()

fireEvent.blur(input)
expect(input).not.toHaveFocus()
```

<hr />

### `toHaveFormValues`

```typescript
toHaveFormValues(expectedValues: {
  [name: string]: any
})
```

This allows you to check if a form or fieldset contains form controls for each
given name, and having the specified value.

> It is important to stress that this matcher can only be invoked on a [form][]
> or a [fieldset][] element.
>
> This allows it to take advantage of the [.elements][] property in `form` and
> `fieldset` to reliably fetch all form controls within them.
>
> This also avoids the possibility that users provide a container that contains
> more than one `form`, thereby intermixing form controls that are not related,
> and could even conflict with one another.

This matcher abstracts away the particularities with which a form control value
is obtained depending on the type of form control. For instance, `<input>`
elements have a `value` attribute, but `<select>` elements do not. Here's a list
of all cases covered:

- `<input type="number">` elements return the value as a **number**, instead of
  a string.
- `<input type="checkbox">` elements:
  - if there's a single one with the given `name` attribute, it is treated as a
    **boolean**, returning `true` if the checkbox is checked, `false` if
    unchecked.
  - if there's more than one checkbox with the same `name` attribute, they are
    all treated collectively as a single form control, which returns the value
    as an **array** containing all the values of the selected checkboxes in the
    collection.
- `<input type="radio">` elements are all grouped by the `name` attribute, and
  such a group treated as a single form control. This form control returns the
  value as a **string** corresponding to the `value` attribute of the selected
  radio button within the group.
- `<input type="text">` elements return the value as a **string**. This also
  applies to `<input>` elements having any other possible `type` attribute
  that's not explicitly covered in different rules above (e.g. `search`,
  `email`, `date`, `password`, `hidden`, etc.)
- `<select>` elements without the `multiple` attribute return the value as a
  **string** corresponding to the `value` attribute of the selected `option`, or
  `undefined` if there's no selected option.
- `<select multiple>` elements return the value as an **array** containing all
  the values of the [selected options][].
- `<textarea>` elements return their value as a **string**. The value
  corresponds to their node content.

The above rules make it easy, for instance, to switch from using a single select
control to using a group of radio buttons. Or to switch from a multi select
control, to using a group of checkboxes. The resulting set of form values used
by this matcher to compare against would be the same.

[selected options]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedOptions
[form]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
[fieldset]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement
[.elements]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements

#### Examples

```html
<form data-testid="login-form">
  <input type="text" name="username" value="jane.doe" />
  <input type="password" name="password" value="12345678" />
  <input type="checkbox" name="rememberMe" checked />
  <button type="submit">Sign in</button>
</form>
```

```javascript
const form = document.querySelector('[data-testid="login-form"]')
expect(form).toHaveFormValues({
  username: 'jane.doe',
  rememberMe: true,
})
```

### `toHaveStyle`

```typescript
toHaveStyle(css: string)
```

This allows you to check if a certain element has some specific css properties
with specific values applied. It matches only if the element has _all_ the
expected properties applied, not just some of them.

#### Examples

```html
<button data-testid="delete-button" style="display: none; color: red">
  Delete item
</button>
```

##### Using document.querySelector

```javascript
const button = document.querySelector(['data-testid="delete-button"')

expect(button).toHaveStyle('display: none')
expect(button).toHaveStyle(`
  color: red;
  display: none;
`)
expect(button).not.toHaveStyle(`
  color: blue;
  display: none;
`)
```

##### Using dom-testing-library

```javascript
const button = getByTestId(container, 'delete-button')

expect(button).toHaveStyle('display: none')
expect(button).toHaveStyle(`
  color: red;
  display: none;
`)
expect(button).not.toHaveStyle(`
  color: blue;
  display: none;
`)
```

This also works with rules that are applied to the element via a class name for
which some rules are defined in a stylesheet currently active in the document.
The usual rules of css precedence apply.

<hr />

### `toHaveTextContent`

```typescript
toHaveTextContent(text: string | RegExp, options?: {normalizeWhitespace: boolean})
```

This allows you to check whether the given element has a text content or not.

When a `string` argument is passed through, it will perform a partial case-sensitive match to the element content.

To perform a case-insensitive match, you can use a `RegExp` with the `/i` modifier.

If you want to match the whole content, you can use a `RegExp` to do it.

#### Examples

```html
<span data-testid="text-content">Text Content</span>
```

##### Using document.querySelector

```javascript
const element = document.querySelector('[data-testid="text-content"]')

expect(element).toHaveTextContent('Content')
expect(element).toHaveTextContent(/^Text Content$/) // to match the whole content
expect(element).toHaveTextContent(/content$/i) // to use case-insentive match
expect(element).not.toHaveTextContent('content')
```

##### Using dom-testing-library

```javascript
const element = getByTestId(container, 'text-content')

expect(element).toHaveTextContent('Content')
expect(element).toHaveTextContent(/^Text Content$/) // to match the whole content
expect(element).toHaveTextContent(/content$/i) // to use case-insentive match
expect(element).not.toHaveTextContent('content')
```

<hr />

## Deprecated matchers

### `toBeInTheDOM`

```typescript
toBeInTheDOM()
```

This allows you to check whether a value is a DOM element, or not.

Contrary to what its name implies, this matcher only checks that you passed to
it a valid DOM element. It does not have a clear definition of that "the DOM"
is. Therefore, it does not check wether that element is contained anywhere.

This is the main reason why this matcher is deprecated, and will be removed in
the next major release. You can follow the discussion around this decision in
more detail [here](https://github.com/gnapse/jest-dom/issues/34).

As an alternative, you can use [`toBeInTheDocument`](#tobeinthedocument)
or [`toContainElement`](#tocontainelement). Or if you just want to check if a
value is indeed an `HTMLElement` you can always use some of
[jest's built-in matchers](https://jestjs.io/docs/en/expect#tobeinstanceofclass):

```js
expect(document.querySelector('.ok-button')).toBeInstanceOf(HTMLElement)
expect(document.querySelector('.cancel-button')).toBeTruthy()
```

> Note: The differences between `toBeInTheDOM` and `toBeInTheDocument` are
> significant. Replacing all uses of `toBeInTheDOM` with `toBeInTheDocument`
> will likely cause unintended consequences in your tests. Please make sure when
> replacing `toBeInTheDOM` to read through the documentation of the proposed
> alternatives to see which use case works better for your needs.

## Inspiration

This whole library was extracted out of Kent C. Dodds' [dom-testing-library][],
which was in turn extracted out of [react-testing-library][].

The intention is to make this available to be used independently of these other
libraries, and also to make it more clear that these other libraries are
independent from jest, and can be used with other tests runners as well.

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it
here!

## Guiding Principles

> [The more your tests resemble the way your software is used, the more confidence they can give you.][guiding-principle]

This library follows the same guiding principles as its mother library [dom-testing-library][].
Go [check them out](https://github.com/kentcdodds/dom-testing-library#guiding-principles)
for more details.

Additionally, with respect to custom DOM matchers, this library aims to maintain
a minimal but useful set of them, while avoiding bloating itself with merely
convenient ones that can be easily achieved with other APIs. In general, the
overall criteria for what is considered a useful custom matcher to add to this
library, is that doing the equivalent assertion on our own makes the test code
more verbose, less clear in its intent, and/or harder to read.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=kentcdodds "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/gnapse/jest-dom/commits?author=kentcdodds "Tests") | [<img src="https://avatars1.githubusercontent.com/u/2430381?v=4" width="100px;" alt="Ryan Castner"/><br /><sub><b>Ryan Castner</b></sub>](http://audiolion.github.io)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=audiolion "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/8008023?v=4" width="100px;" alt="Daniel Sandiego"/><br /><sub><b>Daniel Sandiego</b></sub>](https://www.dnlsandiego.com)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=dnlsandiego "Code") | [<img src="https://avatars2.githubusercontent.com/u/12592677?v=4" width="100px;" alt="Paweł Mikołajczyk"/><br /><sub><b>Paweł Mikołajczyk</b></sub>](https://github.com/Miklet)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=Miklet "Code") | [<img src="https://avatars3.githubusercontent.com/u/464978?v=4" width="100px;" alt="Alejandro Ñáñez Ortiz"/><br /><sub><b>Alejandro Ñáñez Ortiz</b></sub>](http://co.linkedin.com/in/alejandronanez/)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=alejandronanez "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;" alt="Matt Parrish"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Apbomb "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=pbomb "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=pbomb "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=pbomb "Tests") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;" alt="Justin Hall"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[📦](#platform-wKovacs64 "Packaging/porting to new platform") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/1241511?s=460&v=4" width="100px;" alt="Anto Aravinth"/><br /><sub><b>Anto Aravinth</b></sub>](https://github.com/antoaravinth)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Tests") [📖](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/3462296?v=4" width="100px;" alt="Jonah Moses"/><br /><sub><b>Jonah Moses</b></sub>](https://github.com/JonahMoses)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=JonahMoses "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4002543?v=4" width="100px;" alt="Łukasz Gandecki"/><br /><sub><b>Łukasz Gandecki</b></sub>](http://team.thebrain.pro)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Tests") [📖](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/498274?v=4" width="100px;" alt="Ivan Babak"/><br /><sub><b>Ivan Babak</b></sub>](https://sompylasar.github.io)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Asompylasar "Bug reports") [🤔](#ideas-sompylasar "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/4439618?v=4" width="100px;" alt="Jesse Day"/><br /><sub><b>Jesse Day</b></sub>](https://github.com/jday3)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=jday3 "Code") | [<img src="https://avatars0.githubusercontent.com/u/15199?v=4" width="100px;" alt="Ernesto García"/><br /><sub><b>Ernesto García</b></sub>](http://gnapse.github.io)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=gnapse "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=gnapse "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=gnapse "Tests") | [<img src="https://avatars0.githubusercontent.com/u/79312?v=4" width="100px;" alt="Mark Volkmann"/><br /><sub><b>Mark Volkmann</b></sub>](http://ociweb.com/mark/)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Amvolkmann "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=mvolkmann "Code") |
| [<img src="https://avatars1.githubusercontent.com/u/1659099?v=4" width="100px;" alt="smacpherson64"/><br /><sub><b>smacpherson64</b></sub>](https://github.com/smacpherson64)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=smacpherson64 "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=smacpherson64 "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=smacpherson64 "Tests") | [<img src="https://avatars2.githubusercontent.com/u/132233?v=4" width="100px;" alt="John Gozde"/><br /><sub><b>John Gozde</b></sub>](https://github.com/jgoz)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Ajgoz "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=jgoz "Code") | [<img src="https://avatars2.githubusercontent.com/u/7830590?v=4" width="100px;" alt="Iwona"/><br /><sub><b>Iwona</b></sub>](https://github.com/callada)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=callada "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=callada "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=callada "Tests") | [<img src="https://avatars0.githubusercontent.com/u/840609?v=4" width="100px;" alt="Lewis"/><br /><sub><b>Lewis</b></sub>](https://github.com/6ewis)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=6ewis "Code") | [<img src="https://avatars3.githubusercontent.com/u/2339362?v=4" width="100px;" alt="Leandro Lourenci"/><br /><sub><b>Leandro Lourenci</b></sub>](https://blog.lourenci.com/)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Alourenci "Bug reports") [📖](https://github.com/gnapse/jest-dom/commits?author=lourenci "Documentation") [💻](https://github.com/gnapse/jest-dom/commits?author=lourenci "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=lourenci "Tests") | [<img src="https://avatars1.githubusercontent.com/u/626420?v=4" width="100px;" alt="Shukhrat Mukimov"/><br /><sub><b>Shukhrat Mukimov</b></sub>](https://github.com/mufasa71)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Amufasa71 "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/1481264?v=4" width="100px;" alt="Roman Usherenko"/><br /><sub><b>Roman Usherenko</b></sub>](https://github.com/dreyks)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=dreyks "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=dreyks "Tests") |
| [<img src="https://avatars1.githubusercontent.com/u/648?v=4" width="100px;" alt="Joe Hsu"/><br /><sub><b>Joe Hsu</b></sub>](http://josephhsu.com)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=jhsu "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/3068563?v=4" width="100px;" alt="Haz"/><br /><sub><b>Haz</b></sub>](https://twitter.com/diegohaz)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Adiegohaz "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=diegohaz "Code") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[jest]: https://facebook.github.io/jest/
[dom-testing-library]: https://github.com/kentcdodds/dom-testing-library
[react-testing-library]: https://github.com/kentcdodds/react-testing-library
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/gnapse/jest-dom.svg?style=flat-square
[build]: https://travis-ci.org/gnapse/jest-dom
[coverage-badge]: https://img.shields.io/codecov/c/github/gnapse/jest-dom.svg?style=flat-square
[coverage]: https://codecov.io/github/gnapse/jest-dom
[version-badge]: https://img.shields.io/npm/v/jest-dom.svg?style=flat-square
[package]: https://www.npmjs.com/package/jest-dom
[downloads-badge]: https://img.shields.io/npm/dm/jest-dom.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/jest-dom
[license-badge]: https://img.shields.io/npm/l/jest-dom.svg?style=flat-square
[license]: https://github.com/gnapse/jest-dom/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/gnapse/jest-dom/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/gnapse/jest-dom.svg?style=social
[github-watch]: https://github.com/gnapse/jest-dom/watchers
[github-star-badge]: https://img.shields.io/github/stars/gnapse/jest-dom.svg?style=social
[github-star]: https://github.com/gnapse/jest-dom/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20jest-dom%20by%20%40gnapse%20https%3A%2F%2Fgithub.com%2Fgnapse%2Fjest-dom%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/gnapse/jest-dom.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106
