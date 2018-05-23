<div align="center">
<h1>jest-dom</h1>

<a href="https://www.emojione.com/emoji/1f989">
<img height="80" width="80" alt="owl" src="https://raw.githubusercontent.com/gnapse/jest-dom/master/other/owl.png" />
</a>

<p>Custom jest matchers to test the dom structure</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
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

* [Installation](#installation)
* [Usage](#usage)
* [Custom matchers](#custom-matchers)
  * [`toBeInTheDOM`](#tobeinthedom)
  * [`toHaveTextContent`](#tohavetextcontent)
  * [`toHaveAttribute`](#tohaveattribute)
  * [`toHaveClass`](#tohaveclass)
  * [`toHaveStyle`](#tohavestyle)
  * [`toBeVisible`](#tobevisible)
* [Inspiration](#inspiration)
* [Other Solutions](#other-solutions)
* [Guiding Principles](#guiding-principles)
* [Contributors](#contributors)
* [LICENSE](#license)

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
import {toBeInTheDOM, toHaveClass} from 'jest-dom'

expect.extend({toBeInTheDOM, toHaveClass})
```

> Note: when using TypeScript, this way of importing matchers won't provide the
> necessary type definitions. More on this [here](https://github.com/gnapse/jest-dom/pull/11#issuecomment-387817459).

## Custom matchers

### `toBeInTheDOM`

This allows you to assert whether an element present in the DOM or not.

```javascript
// add the custom expect matchers once
import 'jest-dom/extend-expect'

// ...
// <span data-testid="count-value">2</span>
expect(queryByTestId(container, 'count-value')).toBeInTheDOM()
expect(queryByTestId(container, 'count-value1')).not.toBeInTheDOM()
// ...
```

> Note: when using `toBeInTheDOM`, make sure you use a query function
> (like `queryByTestId`) rather than a get function (like `getByTestId`).
> Otherwise the `get*` function could throw an error before your assertion.

### `toHaveTextContent`

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

This allows you to check wether the given element has an attribute or not. You
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

This allows you to check wether the given element has certain classes within its
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
expect(getByTestId(container, 'delete-button')).not.toHaveClass('btn-link')
// ...
```

### `toHaveStyle`

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

### `toBeVisible`

This allows you to check if an element is currently visible to the user.

An element is visible if **all** the following conditions are met:

* it does not have its css property `display` set to `none`
* it does not have its css property `visibility` set to either `hidden` or
  `collapse`
* it does not have its css property `opacity` set to `0`
* its parent element is also visible (and so on up to the top of the DOM tree)

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
| [<img src="https://avatars1.githubusercontent.com/u/1241511?s=460&v=4" width="100px;"/><br /><sub><b>Anto Aravinth</b></sub>](https://github.com/antoaravinth)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Tests") [📖](https://github.com/gnapse/jest-dom/commits?author=antoaravinth "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/3462296?v=4" width="100px;"/><br /><sub><b>Jonah Moses</b></sub>](https://github.com/JonahMoses)<br />[📖](https://github.com/gnapse/jest-dom/commits?author=JonahMoses "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4002543?v=4" width="100px;"/><br /><sub><b>Łukasz Gandecki</b></sub>](http://team.thebrain.pro)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Code") [⚠️](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Tests") [📖](https://github.com/gnapse/jest-dom/commits?author=lgandecki "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/498274?v=4" width="100px;"/><br /><sub><b>Ivan Babak</b></sub>](https://sompylasar.github.io)<br />[🐛](https://github.com/gnapse/jest-dom/issues?q=author%3Asompylasar "Bug reports") [🤔](#ideas-sompylasar "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/4439618?v=4" width="100px;"/><br /><sub><b>Jesse Day</b></sub>](https://github.com/jday3)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=jday3 "Code") | [<img src="https://avatars0.githubusercontent.com/u/15199?v=4" width="100px;"/><br /><sub><b>Ernesto García</b></sub>](http://gnapse.github.io)<br />[💻](https://github.com/gnapse/jest-dom/commits?author=gnapse "Code") [📖](https://github.com/gnapse/jest-dom/commits?author=gnapse "Documentation") [⚠️](https://github.com/gnapse/jest-dom/commits?author=gnapse "Tests") |

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
