import {matcherHint} from 'jest-matcher-utils'
import jestDiff from 'jest-diff'
import {checkHtmlElement} from './utils'

function uniq(value, index, self) {
  return self.indexOf(value) === index
}

function isEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    a = [...a].sort()
    b = [...b].sort()
  }
  return JSON.stringify(a) === JSON.stringify(b)
}

function getSelectValue({multiple, selectedOptions}) {
  if (multiple) {
    return [...selectedOptions].map(opt => opt.value)
  }
  /* istanbul ignore if */
  if (selectedOptions.length === 0) {
    return undefined // Couldn't make this happen, but just in case
  }
  return selectedOptions[0].value
}

function getInputValue(inputElement) {
  switch (inputElement.type) {
    case 'number':
      return inputElement.value === '' ? null : Number(inputElement.value)
    case 'checkbox':
      return inputElement.checked
    default:
      return inputElement.value
  }
}

function getSingleElementValue(element) {
  /* istanbul ignore if */
  if (!element) {
    return undefined
  }
  switch (element.tagName.toLowerCase()) {
    case 'input':
      return getInputValue(element)
    case 'select':
      return getSelectValue(element)
    default:
      return element.value
  }
}

// Returns the combined value of several elements that have the same name
// e.g. radio buttons or groups of checkboxes
function getMultiElementValue(elements) {
  const types = elements.map(element => element.type).filter(uniq)
  if (types.length !== 1) {
    throw new Error(
      'Multiple form elements with the same name must be of the same type',
    )
  }
  switch (types[0]) {
    case 'radio': {
      const theChosenOne = elements.find(radio => radio.checked)
      return theChosenOne ? theChosenOne.value : undefined
    }
    case 'checkbox':
      return elements
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
    default:
      // NOTE: Not even sure this is a valid use case, but just in case...
      return elements.map(element => element.value)
  }
}

function getFormValue(container, name) {
  const elements = [...container.querySelectorAll(`[name="${name}"]`)]
  /* istanbul ignore if */
  if (elements.length === 0) {
    return undefined // shouldn't happen, but just in case
  }
  switch (elements.length) {
    case 1:
      return getSingleElementValue(elements[0])
    default:
      return getMultiElementValue(elements)
  }
}

// Strips the `[]` suffix off a form value name
function getPureName(name) {
  return /\[\]$/.test(name) ? name.slice(0, -2) : name
}

function getAllFormValues(container) {
  const names = [...container.querySelectorAll('[name]')]
    .map(element => element.name)
    .filter(uniq)
  return names.reduce(
    (obj, name) => ({
      ...obj,
      [getPureName(name)]: getFormValue(container, name),
    }),
    {},
  )
}

export function toHaveFormValues(formElement, expectedValues) {
  checkHtmlElement(formElement, toHaveFormValues, this)
  const formValues = getAllFormValues(formElement)
  return {
    pass: Object.entries(expectedValues).every(([name, value]) =>
      isEqual(formValues[name], value),
    ),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const matcher = `${this.isNot ? '.not' : ''}.toHaveFormValues`
      const commonKeyValues = Object.keys(formValues)
        .filter(key => expectedValues.hasOwnProperty(key))
        .reduce((obj, key) => ({...obj, [key]: formValues[key]}), {})
      return [
        matcherHint(matcher, 'element', ''),
        `Expected the element ${to} have form values`,
        jestDiff(expectedValues, commonKeyValues),
      ].join('\n\n')
    },
  }
}
