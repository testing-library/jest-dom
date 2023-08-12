import {type expect} from '@jest/globals'
import {type TestingLibraryMatchers} from './matchers'

export {}
declare module '@jest/expect' {
  export interface Matchers<R extends void | Promise<void>>
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
