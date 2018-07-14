import {deprecate, getDepreciationMessage} from '../utils'

test('deprecate', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  const messageWithReplacement = getDepreciationMessage('test', 'test')
  deprecate('test', 'test')
  expect(spy).toHaveBeenCalledWith(messageWithReplacement)

  const messageWithoutReplacement = getDepreciationMessage('test')
  deprecate('test')
  expect(spy).toHaveBeenCalledWith(messageWithoutReplacement)

  spy.mockRestore()
})
