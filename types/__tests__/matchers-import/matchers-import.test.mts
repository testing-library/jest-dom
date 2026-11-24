import {expect} from 'bun:test'
import * as matchers from '@testing-library/jest-dom/matchers'
import type {TestingLibraryMatchers} from '@testing-library/jest-dom/matchers'
import type {MatchersStandalone} from '../../matchers-standalone.js'

expect.extend(matchers)

async function extendAfterDomRegistration() {
  const importedMatchers = await import('@testing-library/jest-dom/matchers')
  expect.extend(importedMatchers)
  const noDefault: 'default' extends keyof typeof importedMatchers
    ? false
    : true = true
  return noDefault
}

void extendAfterDomRegistration

type SameKeys = Exclude<
  keyof MatchersStandalone,
  keyof typeof matchers
> extends never
  ? Exclude<keyof typeof matchers, keyof MatchersStandalone> extends never
    ? true
    : false
  : false
const sameKeys: SameKeys = true
const directMatchers: TestingLibraryMatchers<HTMLElement, void> = {} as never
matchers.toHaveClass(document.body, 'active', {exact: true})
matchers.toHaveClass(document.body, 'active', 'focused')
directMatchers.toHaveClass('active')
void sameKeys
