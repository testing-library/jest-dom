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
    let withType = ''
    try {
      withType = printWithType('Received', received, printReceived)
    } catch (e) {
      // Can throw for Document:
      // https://github.com/jsdom/jsdom/issues/2304
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
      withType,
    ].join('\n')
  }
}

function checkHasWindow(htmlElement, ...args) {
  if (
    !htmlElement ||
    !htmlElement.ownerDocument ||
    !htmlElement.ownerDocument.defaultView
  ) {
    throw new HtmlElementTypeError(htmlElement, ...args)
  }
}

function checkHtmlElement(htmlElement, ...args) {
  checkHasWindow(htmlElement, ...args)
  const window = htmlElement.ownerDocument.defaultView

  if (
    !(htmlElement instanceof window.HTMLElement) &&
    !(htmlElement instanceof window.SVGElement)
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

function matches(textToMatch, matcher) {
  if (matcher instanceof RegExp) {
    return matcher.test(textToMatch)
  } else {
    return textToMatch.includes(String(matcher))
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

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim()
}

function isElementDisabled(element) {
  // form elements that support 'disabled'
  const FORM_TAGS = [
    'fieldset',
    'input',
    'select',
    'optgroup',
    'option',
    'button',
    'textarea',
  ]

  return FORM_TAGS.includes(getTag(element)) && element.hasAttribute('disabled')
}

function getTag(element) {
  return element.tagName && element.tagName.toLowerCase()
}

function isAncestorDisabled(element) {
  const parent = element.parentElement
  return (
    Boolean(parent) &&
    (isElementDisabledByParent(element, parent) || isAncestorDisabled(parent))
  )
}

function isElementDisabledByParent(element, parent) {
  return (
    isElementDisabled(parent) && !isFirstLegendChildOfFieldset(element, parent)
  )
}

/*
 * According to specification:
 * If <fieldset> is disabled, the form controls that are its descendants,
 * except descendants of its first optional <legend> element, are disabled
 *
 * https://html.spec.whatwg.org/multipage/form-elements.html#concept-fieldset-disabled
 *
 * This method tests whether element is first legend child of fieldset parent
 */
function isFirstLegendChildOfFieldset(element, parent) {
  return (
    getTag(element) === 'legend' &&
    getTag(parent) === 'fieldset' &&
    element.isSameNode(
      Array.from(parent.children).find(child => getTag(child) === 'legend'),
    )
  )
}

function checkDisabledElement(element) {
  return isElementDisabled(element) || isAncestorDisabled(element)
}

export {
  HtmlElementTypeError,
  checkHtmlElement,
  checkValidCSS,
  deprecate,
  getMessage,
  matches,
  normalize,
  checkDisabledElement,
}
