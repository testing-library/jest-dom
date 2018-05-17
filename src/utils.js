import {
  RECEIVED_COLOR as receivedColor,
  EXPECTED_COLOR as expectedColor,
} from 'jest-matcher-utils'

function getDisplayName(subject) {
  if (subject && subject.constructor) {
    return subject.constructor.name
  } else {
    return typeof subject
  }
}

function checkHtmlElement(htmlElement) {
  if (!(htmlElement instanceof HTMLElement)) {
    throw new Error(
      `The given subject is a ${getDisplayName(
        htmlElement,
      )}, not an HTMLElement`,
    )
  }
}

function indent(str) {
  return `  ${str.replace(/\n/g, '\n  ')}`
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
    `${expectedLabel}:\n${expectedColor(indent(expectedValue))}`,
    `${receivedLabel}:\n${receivedColor(indent(receivedValue))}`,
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
