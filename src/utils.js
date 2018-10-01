import redent from 'redent'
import {
  RECEIVED_COLOR as receivedColor,
  EXPECTED_COLOR as expectedColor,
  matcherHint,
  printWithType,
  printReceived,
  stringify,
} from 'jest-matcher-utils'
import {parse} from 'css'

class HtmlElementTypeError extends Error {
  constructor(received, matcherFn, context) {
    super()

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn)
    }
    this.message = [
      matcherHint(
        `${context.isNot ? '.not' : ''}.${matcherFn.name}`,
        'received',
        '',
      ),
      '',
      `${receivedColor(
        'received',
      )} value must be an HTMLElement or an SVGElement.`,
      printWithType('Received', received, printReceived),
    ].join('\n')
  }
}

function checkHtmlElement(htmlElement, ...args) {
  if (
    !(htmlElement instanceof HTMLElement) &&
    !(htmlElement instanceof SVGElement)
  ) {
    throw new HtmlElementTypeError(htmlElement, ...args)
  }
}

class InvalidCSSError extends Error {
  constructor(received, matcherFn) {
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

function checkValidCSS(css, ...args) {
  const ast = parse(`selector { ${css} }`, {silent: true}).stylesheet

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
}

class InvalidDocumentError extends Error {
  constructor(message, matcherFn) {
    super()

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn)
    }

    this.message = message
  }
}

function checkDocumentKey(document, key, matcherFn) {
  if (typeof document === 'undefined') {
    throw new InvalidDocumentError(
      `document is undefined on global but is required to use ${
        matcherFn.name
      }.`,
      matcherFn,
    )
  }

  if (typeof document[key] === 'undefined') {
    throw new InvalidDocumentError(
      `${key} is undefined on document but is required to use ${
        matcherFn.name
      }.`,
      matcherFn,
    )
  }
}

function display(value) {
  return typeof value === 'string' ? value : stringify(value)
}

function getMessage(
  matcher,
  expectedLabel,
  expectedValue,
  receivedLabel,
  receivedValue,
) {
  return [
    `${matcher}\n`,
    `${expectedLabel}:\n${expectedColor(redent(display(expectedValue), 2))}`,
    `${receivedLabel}:\n${receivedColor(redent(display(receivedValue), 2))}`,
  ].join('\n')
}

function matches(textToMatch, node, matcher) {
  if (matcher instanceof RegExp) {
    return matcher.test(textToMatch)
  } else {
    return textToMatch.toLowerCase().includes(String(matcher).toLowerCase())
  }
}

function deprecate(name, replacementText) {
  // Notify user that they are using deprecated functionality.
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: ${name} has been deprecated and will be removed in future updates.`,
    replacementText,
  )
}

export {
  checkDocumentKey,
  checkHtmlElement,
  checkValidCSS,
  deprecate,
  getMessage,
  matches,
}
