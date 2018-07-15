import {checkDocumentKey, deprecate} from '../utils'

function matcherMock() {}

test('deprecate', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const name = 'test'
  const replacement = 'test'
  const message = `Warning: ${name} has been deprecated and will be removed in future updates.`

  deprecate(name, replacement)
  expect(spy).toHaveBeenCalledWith(message, replacement)

  deprecate(name)
  expect(spy).toHaveBeenCalledWith(message, undefined)

  spy.mockRestore()
})

test('checkDocumentKey', () => {
  const fakeKey = 'fakeKey'
  const realKey = 'documentElement'
  const badKeyMessage = `${fakeKey} is undefined on document but is required to use ${
    matcherMock.name
  }.`

  const badDocumentMessage =
    'document is undefined on global but is required to use matcherMock.'

  expect(() =>
    checkDocumentKey(document, realKey, matcherMock),
  ).not.toThrowError()

  expect(() => {
    checkDocumentKey(document, fakeKey, matcherMock)
  }).toThrow(badKeyMessage)

  expect(() => {
    //eslint-disable-next-line no-undef
    checkDocumentKey(undefined, realKey, matcherMock)
  }).toThrow(badDocumentMessage)
})
