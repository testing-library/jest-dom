import '../extend-expect'
import {plugins} from 'pretty-format'
import {render} from './helpers/test-utils'

expect.addSnapshotSerializer(plugins.ConvertAnsi)

test('.toContainElement', () => {
  const {queryByTestId} = render(`
  <span data-testid="grandparent">
    <span data-testid="parent">
      <span data-testid="child"></span>
    </span>
  </span>
  `)

  const grandparent = queryByTestId('grandparent')
  const parent = queryByTestId('parent')
  const child = queryByTestId('child')

  expect(grandparent).toContainElement(parent)
  expect(grandparent).toContainElement(child)
  expect(parent).toContainElement(child)
  expect(parent).not.toContainElement(grandparent)
  expect(child).not.toContainElement(parent)
  expect(child).not.toContainElement(grandparent)
})
