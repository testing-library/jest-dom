// The actual type definitions live in definitely typed:
import {TestingLibraryMatchers} from '@testing-library/jest-dom/matchers'

declare module 'expect' {
  interface AsymmetricMatchers
    extends TestingLibraryMatchers<typeof expect.stringContaining, void> {}
  interface Matchers<R>
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
