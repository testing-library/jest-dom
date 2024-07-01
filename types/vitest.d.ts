import {type expect} from 'vitest'
import {type TestingLibraryMatchers} from './matchers'

export {}
declare module '@vitest/expect' {
  interface JestAssertion<T = any>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
}
