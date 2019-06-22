import {matcherHint, printReceived} from 'jest-matcher-utils'
import {checkHtmlElement, getTag} from './utils'

/*
 * Lists all tags accepting alt as an attribute
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
const TAGS_WITH_ALT = ['applet', 'area', 'img']

const TAGS_WITH_TITLE = ['svg']

const TAGS_WITH_TITLE_ATTR = ['input', 'select', 'textarea', 'abbr']

const TAGS_IMAGES = ['img', 'svg']

const TAGS_WITH_TEXT_CONTENT = ['a', 'button', 'object']

/*
 * Checks if the element is labelled by `aria-label`
 *
 * e.g. `<button aria-label="Add new item"></button>`
 *
 * @link https://www.w3.org/TR/WCAG20-TECHS/ARIA6.html
 */
function isHavingARIALabel(element) {
  return element.hasAttribute('aria-label')
}

/*
 * Checks if the element is labelled by `aria-labelledby`
 *
 * e.g. `<svg aria-labelledby="refId"></svg>`
 *
 * @link https://www.w3.org/TR/WCAG20-TECHS/ARIA10.html
 */
function isHavingARIALabelledBy(element) {
  return element.hasAttribute('aria-labelledby')
}

/*
 * Checks if meaningful images are having an alt attribute
 *
 * e.g. `<img src="" alt="Text alternative" />`
 *
 * @link https://www.w3.org/TR/WCAG20-TECHS/H37.html
 */
function isHavingMeaningfulAlt(element) {
  return (
    TAGS_WITH_ALT.includes(getTag(element)) &&
    element.hasAttribute('alt') &&
    element.getAttribute('alt') !== ''
  )
}

/*
 * Checks if there is a title tag as a child
 *
 * e.g. `<svg><title>Title for this non-text content</title></svg>`
 *
 * @link https://www.w3.org/TR/WCAG20-TECHS/H65.html
 */
function isHavingMeaningfulTitle(element) {
  const titleTag = element.querySelector('title')

  return (
    TAGS_WITH_TITLE.includes(getTag(element)) &&
    titleTag !== null &&
    titleTag.textContent !== null
  )
}

/*
 * Checks if there is a title attribute
 *
 * e.g. `<abbr title="United Nations">UN</abbr>`
 */
function isHavingMeaningfulTitleAttribute(element) {
  return (
    TAGS_WITH_TITLE_ATTR.includes(getTag(element)) &&
    element.hasAttribute('title') &&
    element.getAttribute('title') !== null
  )
}

/*
 * Checks if there is an adjacent image and text
 *
 * e.g. `<button><img src="" alt="">Add new item</button>`
 *
 * @link https://www.w3.org/TR/WCAG20-TECHS/G95.html
 */
function isHavingASiblingLabel(element) {
  return (
    TAGS_IMAGES.includes(getTag(element)) &&
    TAGS_WITH_TEXT_CONTENT.includes(getTag(element.parentElement)) &&
    element.parentElement.textContent !== ''
  )
}

/*
 * Checks if the image is having a meaningful content with with ARIA, an alt attribute or a title attribute
 *
 * @link https://www.w3.org/TR/WCAG20-TECHS/H2.html
 */
function isHavingAContentText(element) {
  const isHavingLabelledImg =
    element.querySelector('img') &&
    (isHavingARIALabel(element.querySelector('img')) ||
      isHavingARIALabelledBy(element.querySelector('img')) ||
      isHavingMeaningfulAlt(element.querySelector('img')))

  const isHavingLabelledSVG =
    element.querySelector('svg') &&
    (isHavingARIALabel(element.querySelector('svg')) ||
      isHavingARIALabelledBy(element.querySelector('svg')) ||
      isHavingMeaningfulTitle(element.querySelector('svg')))

  return (
    TAGS_WITH_TEXT_CONTENT.includes(getTag(element)) &&
    (element.textContent !== '' || isHavingLabelledImg || isHavingLabelledSVG)
  )
}

export function toBeLabelled(element) {
  checkHtmlElement(element, toBeLabelled, this)

  const isLabelled =
    isHavingARIALabel(element) ||
    isHavingARIALabelledBy(element) ||
    isHavingMeaningfulAlt(element) ||
    isHavingMeaningfulTitle(element) ||
    isHavingMeaningfulTitleAttribute(element) ||
    isHavingASiblingLabel(element) ||
    isHavingAContentText(element)

  return {
    pass: isLabelled,
    message: () => {
      const is = isLabelled ? 'is' : 'is not'
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeLabelled`, 'element', ''),
        '',
        `Received element ${is} labelled:`,
        `  ${printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
