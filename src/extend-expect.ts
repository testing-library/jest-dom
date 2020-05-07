import * as extensions from './matchers'

expect.extend(extensions)

type Extensions = typeof extensions

declare global {
  namespace jest {
    interface Matchers<R, T> extends Extensions {}
  }
}
