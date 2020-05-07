import document from './document'

function render(html: string) {
  const container = document.createElement('div')
  container.innerHTML = html
  const queryByTestId = (testId: string) =>
    container.querySelector(`[data-testid="${testId}"]`)
  return {container, queryByTestId}
}

export {render}
