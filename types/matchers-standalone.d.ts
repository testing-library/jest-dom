import {type TestingLibraryMatchers} from './matchers'

type TLM = TestingLibraryMatchers<any, void>

interface MatcherReturnType {
  pass: boolean
  message: () => string
}

interface OverloadedMatchers {
  toHaveClass: (expected: any, ...rest: string[]) => MatcherReturnType
  toHaveClass: (
    expected: any,
    className: string,
    options?: {exact: boolean},
  ) => MatcherReturnType
}

declare namespace matchersStandalone {
  type MatchersStandalone = {
    [T in keyof TLM]: (
      expected: any,
      ...rest: Parameters<TLM[T]>
    ) => MatcherReturnType
  } & OverloadedMatchers
}

declare const matchersStandalone: matchersStandalone.MatchersStandalone &
  Record<string, any>
export = matchersStandalone
