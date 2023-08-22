import {type expect} from '@jest/globals'
import {type TestingLibraryMatchers} from './matchers'

export {}
declare module '@jest/expect' {
  export interface Matchers<R extends void | Promise<void>>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      R
    > {}
}

declare global {
  namespace jest {
    interface Matchers<R = void | Promise<void>>
      extends TestingLibraryMatchers<
        typeof expect.stringContaining,
        R
      > {}
  }
}
