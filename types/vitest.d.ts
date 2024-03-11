/* eslint-disable @typescript-eslint/no-shadow */

import {type Assertion, type AsymmetricMatchersContaining} from 'vitest'
import {type TestingLibraryMatchers} from './matchers'

export {}

// https://vitest.dev/guide/extending-matchers.html
declare module 'vitest' {
  interface Assertion<T = any>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers {}
}
