import document from './document'
import * as extensions from '../../matchers'

function render(html: string) {
  const container = document.createElement('div')
  container.innerHTML = html
  const queryByTestId = (testId: string) =>
    container.querySelector(`[data-testid="${testId}"]`)
  return {container, queryByTestId}
}

type Extensions = typeof extensions

declare global {
  namespace jest {
    interface Matchers<R> extends Extensions {}
  }
}

export {render}
