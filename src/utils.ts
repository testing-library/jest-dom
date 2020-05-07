import redent from 'redent'
import {
  RECEIVED_COLOR as receivedColor,
  EXPECTED_COLOR as expectedColor,
  matcherHint,
  printWithType,
  printReceived,
  stringify,
} from 'jest-matcher-utils'
import {parse, Rule, Declaration} from 'css'
import isEqual from 'lodash/isEqual'
import {InvalidCssReceived} from './types'

class HtmlElementTypeError<C> extends Error {
  constructor(received: Element, matcherFn: jest.CustomMatcher, context: C) {
    super()

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn)
    }
    let withType = ''
    try {
      withType = printWithType('Received', received, printReceived)
    } catch (e) {
      // Can throw for Document:
      // https://github.com/jsdom/jsdom/issues/2304
    }
    this.message = [
      matcherHint(
        // @ts-ignore
        `${context.isNot ? '.not' : ''}.${matcherFn.name}`,
        'received',
        '',
      ),
      '',
      `${receivedColor(
        'received',
      )} value must be an HTMLElement or an SVGElement.`,
      withType,
    ].join('\n')
  }
}

function checkHasWindow<C>(
  htmlElement: Element,
  ...args: [jest.CustomMatcher, C]
) {
  if (
    !htmlElement ||
    !htmlElement.ownerDocument ||
    !htmlElement.ownerDocument.defaultView
  ) {
    throw new HtmlElementTypeError(htmlElement, ...args)
  }
}

function checkHtmlElement<C>(
  htmlElement: Element,
  ...args: [jest.CustomMatcher, C]
) {
  checkHasWindow(htmlElement, ...args)
  const window = htmlElement.ownerDocument!.defaultView

  if (
    // @ts-ignore
    !(htmlElement instanceof window.HTMLElement) &&
    // @ts-ignore
    !(htmlElement instanceof window.SVGElement)
  ) {
    throw new HtmlElementTypeError(htmlElement, ...args)
  }
}

class InvalidCSSError extends Error {
  constructor(
    received: InvalidCssReceived,
    matcherFn: jest.CustomMatcher,
    _context: jest.MatcherContext,
  ) {
    super()

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn)
    }
    this.message = [
      received.message,
      '',
      receivedColor(`Failing css:`),
      receivedColor(`${received.css}`),
    ].join('\n')
  }
}

function parseCSS(
  css: string,
  ...args: [jest.CustomMatcher, jest.MatcherContext]
) {
  const ast = parse(`selector { ${css} }`, {silent: true}).stylesheet!

  if (ast.parsingErrors && ast.parsingErrors.length > 0) {
    const {reason, line} = ast.parsingErrors[0]

    throw new InvalidCSSError(
      {
        css,
        message: `Syntax error parsing expected css: ${reason} on line: ${line}`,
      },
      ...args,
    )
  }

  const delarations = (ast.rules[0]! as Rule).declarations as Declaration[]
  const parsedRules = delarations
    .filter(d => d.type === 'declaration')
    .reduce(
      (obj, {property, value}) =>
        Object.assign(obj, {[String(property)]: value}),
      {},
    )
  return parsedRules
}

function display(value: string | unknown) {
  return typeof value === 'string' ? value : stringify(value)
}

function getMessage(
  matcher: string,
  expectedLabel: string,
  expectedValue: string | RegExp | number | null | string[],
  receivedLabel: string,
  receivedValue?: string | null,
) {
  return [
    `${matcher}\n`,
    `${expectedLabel}:\n${expectedColor(redent(display(expectedValue), 2))}`,
    `${receivedLabel}:\n${receivedColor(redent(display(receivedValue), 2))}`,
  ].join('\n')
}

function matches(textToMatch: string, matcher: RegExp | unknown) {
  if (matcher instanceof RegExp) {
    return matcher.test(textToMatch)
  } else {
    return textToMatch.includes(String(matcher))
  }
}

function deprecate(name: string, replacementText?: string) {
  // Notify user that they are using deprecated functionality.
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: ${name} has been deprecated and will be removed in future updates.`,
    replacementText,
  )
}

function normalize(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

function getTag(element: HTMLElement) {
  return element.tagName && element.tagName.toLowerCase()
}

function getSelectValue({multiple, options}: HTMLSelectElement) {
  const selectedOptions = [...options].filter(option => option.selected)

  if (multiple) {
    return [...selectedOptions].map(opt => opt.value)
  }
  /* istanbul ignore if */
  if (selectedOptions.length === 0) {
    return undefined // Couldn't make this happen, but just in case
  }
  return selectedOptions[0].value
}

function getInputValue(inputElement: HTMLInputElement) {
  switch (inputElement.type) {
    case 'number':
      return inputElement.value === '' ? null : Number(inputElement.value)
    case 'checkbox':
      return inputElement.checked
    default:
      return inputElement.value
  }
}

function getSingleElementValue(element: HTMLElement) {
  /* istanbul ignore if */
  if (!element) {
    return undefined
  }

  if (isInputElement(element)) {
    return getInputValue(element)
  } else if (isSelectElement(element)) {
    return getSelectValue(element)
  } else {
    // @ts-ignore
    return element.value
  }
}

function compareArraysAsSet<T, R>(a: T[], b: R[]) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return isEqual(new Set(a), new Set(b))
  }
  return undefined
}

function parseJStoCSS(
  document: Document,
  css: string | Partial<CSSStyleDeclaration>,
) {
  const sandboxElement = document.createElement('div')
  Object.assign(sandboxElement.style, css)
  return sandboxElement.style.cssText
}

export {
  HtmlElementTypeError,
  checkHtmlElement,
  parseCSS,
  deprecate,
  getMessage,
  matches,
  normalize,
  getTag,
  getSingleElementValue,
  compareArraysAsSet,
  parseJStoCSS,
}

export const isInputElement = (
  htmlElement: HTMLElement,
): htmlElement is HTMLInputElement => {
  return htmlElement.tagName.toLowerCase() === 'input'
}

export const isSelectElement = (
  htmlElement: HTMLElement,
): htmlElement is HTMLSelectElement => {
  return htmlElement.tagName.toLowerCase() === 'select'
}
