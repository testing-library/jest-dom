import { type TestingLibraryMatchers } from './matchers';

declare module 'bun:test' {
  interface Matchers<T = unknown>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
}