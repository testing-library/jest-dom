import {render} from './helpers/test-utils'

test('.toContainOnlyComment', () => {
  const {queryByTestId} = render(`
        <span data-testid="empty"></span>
        <span data-testid="with-comment"><!-- This Comment --></span>
        <span data-testid="with-multiline-comment">
          <!--<span> 
            i am outcomment
          </span>-->
        </span>
        <span data-testid="with-multiple-comments"><!-- Comment1 --> <!-- Comment2 --></span>
        <span data-testid="with-element"><span></span></span>
        <span data-testid="with-element-and-comment"><!--Comment--><span></span></span>`)

  const empty = queryByTestId('empty')
  const withComment = queryByTestId('with-comment')
  const withMultilineComment = queryByTestId('with-multiline-comment')
  const withMultipleComments = queryByTestId('with-multiple-comments')
  const withElement = queryByTestId('with-element')
  const withElementAndComment = queryByTestId('with-element-and-comment')
  const nonExistantElement = queryByTestId('not-exists')
  const fakeElement = {thisIsNot: 'an html element'}

  expect(empty).not.toContainOnlyComments()
  expect(withComment).toContainOnlyComments()
  expect(withMultilineComment).toContainOnlyComments()
  expect(withMultipleComments).toContainOnlyComments()
  expect(withElement).not.toContainOnlyComments()
  expect(withElementAndComment).not.toContainOnlyComments()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() => expect(empty).toContainOnlyComments()).toThrowError()

  expect(() => expect(withComment).not.toContainOnlyComments()).toThrowError()

  expect(() => expect(withMultilineComment).not.toContainOnlyComments()).toThrowError()

  expect(() => expect(withMultipleComments).not.toContainOnlyComments()).toThrowError()

  expect(() => expect(withElement).toContainOnlyComments()).toThrowError()

  expect(() => expect(withElementAndComment).toContainOnlyComments()).toThrowError()

  expect(() => expect(fakeElement).toContainOnlyComments()).toThrowError()

  expect(() => {
    expect(nonExistantElement).toContainOnlyComments()
  }).toThrowError()
})
