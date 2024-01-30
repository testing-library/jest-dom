import {elementRoles} from 'aria-query'
import {checkHtmlElement, getMessage} from './utils'

const elementRoleList = buildElementRoleList(elementRoles)

export function toHaveRole(htmlElement, expectedRole) {
  checkHtmlElement(htmlElement, toHaveRole, this)

  const actualRoles = getExplicitOrImplicitRoles(htmlElement)
  const pass = actualRoles.some(el => el === expectedRole)

  return {
    pass,

    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.${toHaveRole.name}`,
          'element',
          '',
        ),
        `Expected element ${to} have role`,
        expectedRole,
        'Received',
        actualRoles.join(', '),
      )
    },
  }
}

function getExplicitOrImplicitRoles(htmlElement) {
  const hasExplicitRole = htmlElement.hasAttribute('role')

  if (hasExplicitRole) {
    const roleValue = htmlElement.getAttribute('role')

    // Handle fallback roles, such as role="switch button"
    // testing-library gates this behind the `queryFallbacks` flag; it is
    // unclear why, but it makes sense to support this pattern out of the box
    // https://testing-library.com/docs/queries/byrole/#queryfallbacks
    return roleValue.split(' ').filter(Boolean)
  }

  const implicitRoles = getImplicitAriaRoles(htmlElement)

  return implicitRoles
}

function getImplicitAriaRoles(currentNode) {
  for (const {match, roles} of elementRoleList) {
    if (match(currentNode)) {
      return [...roles]
    }
  }

  /* istanbul ignore next */
  return [] // this does not get reached in practice, since elements have at least a 'generic' role
}

/**
 * Transform the roles map (with required attributes and constraints) to a list
 * of roles. Each item in the list has functions to match an element against it.
 *
 * Essentially copied over from [dom-testing-library's
 * helpers](https://github.com/testing-library/dom-testing-library/blob/bd04cf95a1ed85a2238f7dfc1a77d5d16b4f59dc/src/role-helpers.js#L80)
 *
 * TODO: If we are truly just copying over stuff, would it make sense to move
 * this to a separate package?
 *
 * TODO: This technique relies on CSS selectors; are those consistently
 * available in all jest-dom environments? Why do other matchers in this package
 * not use them like this?
 */
function buildElementRoleList(elementRolesMap) {
  function makeElementSelector({name, attributes}) {
    return `${name}${attributes
      .map(({name: attributeName, value, constraints = []}) => {
        const shouldNotExist = constraints.indexOf('undefined') !== -1
        if (shouldNotExist) {
          return `:not([${attributeName}])`
        } else if (value) {
          return `[${attributeName}="${value}"]`
        } else {
          return `[${attributeName}]`
        }
      })
      .join('')}`
  }

  function getSelectorSpecificity({attributes = []}) {
    return attributes.length
  }

  function bySelectorSpecificity(
    {specificity: leftSpecificity},
    {specificity: rightSpecificity},
  ) {
    return rightSpecificity - leftSpecificity
  }

  function match(element) {
    let {attributes = []} = element

    // https://github.com/testing-library/dom-testing-library/issues/814
    const typeTextIndex = attributes.findIndex(
      attribute =>
        attribute.value &&
        attribute.name === 'type' &&
        attribute.value === 'text',
    )

    if (typeTextIndex >= 0) {
      // not using splice to not mutate the attributes array
      attributes = [
        ...attributes.slice(0, typeTextIndex),
        ...attributes.slice(typeTextIndex + 1),
      ]
    }

    const selector = makeElementSelector({...element, attributes})

    return node => {
      if (typeTextIndex >= 0 && node.type !== 'text') {
        return false
      }

      return node.matches(selector)
    }
  }

  let result = []

  for (const [element, roles] of elementRolesMap.entries()) {
    result = [
      ...result,
      {
        match: match(element),
        roles: Array.from(roles),
        specificity: getSelectorSpecificity(element),
      },
    ]
  }

  return result.sort(bySelectorSpecificity)
}
