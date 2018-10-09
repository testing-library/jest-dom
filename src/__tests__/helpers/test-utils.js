import document from './document'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const queryByTestId = testId =>
    container.querySelector(`[data-testid="${testId}"]`)
  return {container, queryByTestId}
}

export {render}
