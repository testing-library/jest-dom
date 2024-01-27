import {elementRoles} from 'aria-query'
import {checkHtmlElement, getMessage} from './utils'

const elementRoleList = buildElementRoleList(elementRoles)

export function toHaveRole(htmlElement, expectedRole) {
  checkHtmlElement(htmlElement, toHaveRole, this)

  const actualRoles = getExplicitOrImplicitRoles(htmlElement)

  // TODO: There might be a helper on this. to check `some`
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
  const isRoleSpecifiedExplicitly = htmlElement.hasAttribute('role')

  if (isRoleSpecifiedExplicitly) {
    const roleValue = htmlElement.getAttribute('role')

    // TODO: For explicit role, we will have to handle fallbacks, since more than one role can be provided.
    // if (queryFallbacks) {
    //   return roleValue
    //     .split(' ')
    //     .filter(Boolean)
    //     .some(roleAttributeToken => roleAttributeToken === role)
    // }

    // For now, only return the first matching token
    const [firstRoleAttributeToken] = roleValue.split(' ')
    return [firstRoleAttributeToken]
  }

  // TODO: The implicit roles have a series of attributes and constraints, that
  // quantify extra conditions for an implicit role to be assigned. We should
  // handle them.
  const implicitRoles = getImplicitAriaRoles(htmlElement)
  console.log({implicitRoles})

  return implicitRoles
}

function getImplicitAriaRoles(currentNode) {
  for (const {match, roles} of elementRoleList) {
    if (match(currentNode)) {
      return [...roles]
    }
  }

  return []
}

/**
 * Transform the standard role mapping to a list of roles, paired with functions
 * to match an element against them. The list is sorted by specificity, so that
 * a search from the start of the array will find the more specific role.
 *
 * Copied over from dom-testing-library:
 * @see
 * {@link https://github.com/testing-library/dom-testing-library/blob/bd04cf95a1ed85a2238f7dfc1a77d5d16b4f59dc/src/role-helpers.js#L80}
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

      // TODO: This technique relies on CSS selectors; are those consistently
      // available in all jest-dom environments? Why do other matchers in this
      // package not use them like this?
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
