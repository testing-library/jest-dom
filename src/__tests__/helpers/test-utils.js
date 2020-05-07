import document from './document'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const queryByTestId = testId =>
    container.querySelector(`[data-testid="${testId}"]`)

  // Some tests need to look up global ids with document.getElementById()
  // so we need to be inside an actual document.
  document.body.innerHTML = ''
  document.body.appendChild(container)

  return {container, queryByTestId}
}

export {render}
