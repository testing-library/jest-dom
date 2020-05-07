import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement} from './utils'

function isStyleVisible(element: HTMLElement) {
  const {getComputedStyle} = element.ownerDocument!.defaultView!

  const {display, visibility, opacity} = getComputedStyle(element)
  return (
    display !== 'none' &&
    visibility !== 'hidden' &&
    visibility !== 'collapse' &&
    opacity !== '0'
  )
}

function isAttributeVisible(
  element: HTMLElement,
  previousElement?: HTMLElement,
) {
  return (
    !element.hasAttribute('hidden') &&
    (element.nodeName === 'DETAILS' && previousElement!.nodeName !== 'SUMMARY'
      ? element.hasAttribute('open')
      : true)
  )
}

function isElementVisible(
  element: HTMLElement,
  previousElement?: HTMLElement,
): boolean {
  return (
    isStyleVisible(element) &&
    isAttributeVisible(element, previousElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  )
}

export function toBeVisible<T>(this: T) {
  const context = (this as unknown) as jest.MatcherContext
  const element = arguments[0] as HTMLElement
  checkHtmlElement(element, toBeVisible, this)
  const isVisible = isElementVisible(element)
  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? 'is' : 'is not'
      return [
        matcherHint(
          `${context.isNot ? '.not' : ''}.toBeVisible`,
          'element',
          '',
        ),
        '',
        `Received element ${is} visible:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
