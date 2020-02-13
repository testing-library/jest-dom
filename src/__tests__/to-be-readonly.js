import {render} from './helpers/test-utils'

test('.toBeReadonly', () => {
  const {queryByTestId} = render(`
    <div>
      <textarea readonly={true} data-testid="textarea-element"></textarea>
      <textarea data-testid="textarea-element-writable"></textarea>

      <input type="text" readonly={true} data-testid="input-text-element" />
      <input type="text" data-testid="input-text-element-writable" />
    </div>
    `)

  expect(queryByTestId('textarea-element')).toBeReadonly()
  expect(queryByTestId('textarea-element')).not.toBeWritable()
  expect(queryByTestId('textarea-element-writable')).toBeWritable()
  expect(queryByTestId('textarea-element-writable')).not.toBeReadonly()

  expect(queryByTestId('input-text-element')).toBeReadonly()
  expect(queryByTestId('input-text-element')).not.toBeWritable()
  expect(queryByTestId('input-text-element-writable')).toBeWritable()
  expect(queryByTestId('input-text-element-writable')).not.toBeReadonly()
})
