import redent from 'redent'
import {
  RECEIVED_COLOR as receivedColor,
  EXPECTED_COLOR as expectedColor,
  matcherHint,
  printWithType,
  printReceived,
  stringify,
} from 'jest-matcher-utils'

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
      `${receivedColor('received')} value must be an HTMLElement.`,
      printWithType('Received', received, printReceived),
    ].join('\n')
  }
}

function checkHtmlElement(htmlElement, ...args) {
  if (!(htmlElement instanceof HTMLElement)) {
    throw new HtmlElementTypeError(htmlElement, ...args)
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
  if (typeof matcher === 'string') {
    return textToMatch.toLowerCase().includes(matcher.toLowerCase())
  } else {
    return matcher.test(textToMatch)
  }
}

export {checkHtmlElement, getMessage, matches}
