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

[![All Contributors](https://img.shields.io/badge/all_contributors-18-orange.svg?style=flat-square)](#contributors)
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
  - [`toBeEmpty`](#tobeempty)
  - [`toBeInTheDocument`](#tobeinthedocument)
  - [`toContainElement`](#tocontainelement)
  - [`toContainHTML`](#tocontainhtml)
  - [`toHaveTextContent`](#tohavetextcontent)
  - [`toHaveAttribute`](#tohaveattribute)
  - [`toHaveClass`](#tohaveclass)
  - [`toHaveStyle`](#tohavestyle)
  - [`toHaveFocus`](#tohavefocus)
  - [`toBeVisible`](#tobevisible)
  - [`toBeDisabled`](#tobedisabled)
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

### `toBeEmpty`

```typescript
toBeEmpty()
```

This allows you to assert whether an element has content or not.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <span data-testid="not-empty"><span data-testid="empty"></span></span>
expect(queryByTestId(container, 'empty')).toBeEmpty()
expect(queryByTestId(container, 'not-empty')).not.toBeEmpty()
// ...
```

### `toBeInTheDocument`

```typescript
toBeInTheDocument()
```

This allows you to assert whether an element is present in the document or not.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// document.body.innerHTML = `<span data-testid="html-element"><span>Html Element</span></span><svg data-testid="svg-element"></svg>`

// const htmlElement = document.querySelector('[data-testid="html-element"]')
// const svgElement = document.querySelector('[data-testid="svg-element"]')
// const nonExistantElement = document.querySelector('does-not-exist')
// const detachedElement = document.createElement('div')

expect(htmlElement).toBeInTheDocument()
expect(svgElement).toBeInTheDocument()
expect(detacthedElement).not.toBeInTheDocument()
expect(nonExistantElement).not.toBeInTheDocument()
// ...
```

> Note: This will not find detached elements. The element must be added to the document to be found. If you desire to search in a detached element please use: [`toContainElement`](#tocontainelement)

### `toContainElement`

```typescript
toContainElement(element: HTMLElement | SVGElement | null)
```

This allows you to assert whether an element contains another element as a descendant or not.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <span data-testid="ancestor"><span data-testid="descendant"></span></span>
const ancestor = queryByTestId(container, 'ancestor')
const descendant = queryByTestId(container, 'descendant')
const nonExistantElement = queryByTestId(container, 'does-not-exist')

expect(ancestor).toContainElement(descendant)
expect(descendant).not.toContainElement(ancestor)
expect(ancestor).not.toContainElement(nonExistantElement)
// ...
```

### `toContainHTML`

```typescript
toContainHTML(htmlText: string)
```

Assert whether a string representing a HTML element is contained in another element:

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <span data-testid="parent"><span data-testid="child"></span></span>
const parent = queryByTestId('parent')
expect(parentElement).toContainHTML('<span data-testid="child"></span>')
// ...
```

> Chances are you probably do not need to use this matcher. We encourage testing from the perspective of how the user perceives the app in a browser. That's why testing against a specific DOM structure is not advised.
>
> It could be useful in situations where the code being tested renders html that was obtained from an external source, and you want to validate that that html code was used as intended.
>
> It should not be used to check DOM structure that you control. Please use [`toContainElement`](#tocontainelement) instead.

### `toHaveTextContent`

```typescript
toHaveTextContent(text: string | RegExp)
```

This API allows you to check whether the given element has a text content or not.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <span data-testid="count-value">2</span>
expect(getByTestId(container, 'count-value')).toHaveTextContent('2')
expect(getByTestId(container, 'count-value')).not.toHaveTextContent('21')
// ...
```

### `toHaveAttribute`

```typescript
toHaveAttribute(attr: string, value?: string)
```

This allows you to check whether the given element has an attribute or not. You
can also optionally check that the attribute has a specific expected value.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <button data-testid="ok-button" type="submit" disabled>
//   OK
// </button>
expect(getByTestId(container, 'ok-button')).toHaveAttribute('disabled')
expect(getByTestId(container, 'ok-button')).toHaveAttribute('type', 'submit')
expect(getByTestId(container, 'ok-button')).not.toHaveAttribute(
  'type',
  'button',
)
// ...
```

### `toHaveClass`

```typescript
toHaveClass(...classNames: string[])
```

This allows you to check whether the given element has certain classes within its
`class` attribute.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <button data-testid="delete-button" class="btn extra btn-danger">
//   Delete item
// </button>
expect(getByTestId(container, 'delete-button')).toHaveClass('extra')
expect(getByTestId(container, 'delete-button')).toHaveClass('btn-danger btn')
expect(getByTestId(container, 'delete-button')).toHaveClass('btn-danger', 'btn')
expect(getByTestId(container, 'delete-button')).not.toHaveClass('btn-link')
// ...
```

You must provide at least one class, unless you are asserting that an element
does not have any classes.

```javascript
// ...
// <button data-testid="no-classes">
//   Delete item
// </button>
expect(getByTestId(container, 'no-classes')).not.toHaveClass()
```

### `toHaveStyle`

```typescript
toHaveStyle(css: string)
```

This allows you to check if a certain element has some specific css properties
with specific values applied. It matches only if the element has _all_ the
expected properties applied, not just some of them.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <button data-testid="delete-button" style="display: none; color: red">
//   Delete item
// </button>
expect(getByTestId(container, 'delete-button')).toHaveStyle('display: none')
expect(getByTestId(container, 'delete-button')).toHaveStyle(`
  color: red;
  display: none;
`)
expect(getByTestId(container, 'delete-button')).not.toHaveStyle(`
  display: none;
  color: blue;
`)
// ...
```

This also works with rules that are applied to the element via a class name for
which some rules are defined in a stylesheet currently active in the document.
The usual rules of css precedence apply.

### `toHaveFocus`

```typescript
toHaveFocus()
```

This allows you to assert whether an element has focus or not.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <div><input id="focused" type="text" data-testid="focused" /></div>
// const { container } = render(...)
// const input = container.querySelector('#focused');

// input.focus()
expect(queryByTestId(container, 'focused')).toHaveFocus()

// input.blur()
expect(queryByTestId(container, 'focused')).not.toHaveFocus()

// ...
```

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

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <header>
//   <h1 style="display: none">Page title</h1>
// </header>
// <section>
//   <p style="visibility: hidden">Hello <strong>World</strong></h1>
// </section>
expect(container.querySelector('header')).toBeVisible()
expect(container.querySelector('h1')).not.toBeVisible()
expect(container.querySelector('strong')).not.toBeVisible()
// ...
```

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

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <button data-testid="button" type="submit" disabled>
//   SUBMIT
// </button>
// <fieldset disabled>
//   <input type="text" data-testid="text" />
// </fieldset>
expect(getByTestId(container, 'button')).toBeDisabled()
expect(getByTestId(container, 'text')).toBeDisabled()
// ...

// ...
// <a href="..." disabled>LINK</a>
expect(getByText(container, 'LINK')).not.toBeDisabled()
// ...
```

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
expect(document.querySelector('.cancel-button')).toBeThruthy()
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
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=kentcdodds "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/gnapse/jest-dom/commits?author=kentcdodds "Tests") | [<img src="https://avatars1.githubusercontent.com/u/2430381?v=4" width="100px;"/><br /><sub><b>Ryan Castner</b></sub>](http://audiolion.github.io)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=audiolion "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/8008023?v=4" width="100px;"/><br /><sub><b>Daniel Sandiego</b></sub>](https://www.dnlsandiego.com)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=dnlsandiego "Code") | [<img src="https://avatars2.githubusercontent.com/u/12592677?v=4" width="100px;"/><br /><sub><b>Paweł Mikołajczyk</b></sub>](https://github.com/Miklet)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=Miklet "Code") | [<img src="https://avatars3.githubusercontent.com/u/464978?v=4" width="100px;"/><br /><sub><b>Alejandro Ñáñez Ortiz</b></sub>](http://co.linkedin.com/in/alejandronanez/)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=alejandronanez "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Apbomb "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=pbomb "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=pbomb "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=pbomb "Tests") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[📦](#platform-wKovacs64 "Packaging/porting to new platform") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/1241511?s=460&v=4" width="100px;"/><br /><sub><b>Anto Aravinth</b></sub>](https://github.com/antoaravinth)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Tests") [📖](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/3462296?v=4" width="100px;"/><br /><sub><b>Jonah Moses</b></sub>](https://github.com/JonahMoses)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=JonahMoses "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4002543?v=4" width="100px;"/><br /><sub><b>Łukasz Gandecki</b></sub>](http://team.thebrain.pro)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Tests") [📖](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/498274?v=4" width="100px;"/><br /><sub><b>Ivan Babak</b></sub>](https://sompylasar.github.io)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Asompylasar "Bug reports") [🤔](#ideas-sompylasar "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/4439618?v=4" width="100px;"/><br /><sub><b>Jesse Day</b></sub>](https://github.com/jday3)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=jday3 "Code") | [<img src="https://avatars0.githubusercontent.com/u/15199?v=4" width="100px;"/><br /><sub><b>Ernesto García</b></sub>](http://gnapse.github.io)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=gnapse "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=gnapse "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=gnapse "Tests") | [<img src="https://avatars0.githubusercontent.com/u/79312?v=4" width="100px;"/><br /><sub><b>Mark Volkmann</b></sub>](http://ociweb.com/mark/)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Amvolkmann "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=mvolkmann "Code") |
| [<img src="https://avatars1.githubusercontent.com/u/1659099?v=4" width="100px;"/><br /><sub><b>smacpherson64</b></sub>](https://github.com/smacpherson64)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=smacpherson64 "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=smacpherson64 "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=smacpherson64 "Tests") | [<img src="https://avatars2.githubusercontent.com/u/132233?v=4" width="100px;"/><br /><sub><b>John Gozde</b></sub>](https://github.com/jgoz)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Ajgoz "Bug reports") [💻](https://github.com/gnapse/jest-dom/commits?author=jgoz "Code") | [<img src="https://avatars2.githubusercontent.com/u/7830590?v=4" width="100px;"/><br /><sub><b>Iwona</b></sub>](https://github.com/callada)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=callada "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=callada "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=callada "Tests") | [<img src="https://avatars0.githubusercontent.com/u/840609?v=4" width="100px;"/><br /><sub><b>Lewis</b></sub>](https://github.com/6ewis)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=6ewis "Code") |

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
