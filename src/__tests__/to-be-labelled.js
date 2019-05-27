import {render} from './helpers/test-utils'

test('.toBeLabelled', () => {
  const {queryByTestId} = render(`
    <div>
      <img data-testid="img-alt" src="" alt="Test alt" />
      <img data-testid="img-label" src="" alt="" aria-label="Test alt" />
      <img data-testid="img-labelledby" src="" alt="" aria-labelledby="testId" />
      <img data-testid="img-empty-alt" src="" alt="" />
      <svg data-testid="svg-title"><title>Test title</title></svg>
      <button><img data-testid="img-text-sibling" src="" alt="" /><span>Test content</span></button>
      <button data-testid="button-img-alt"><img src="" alt="Test" /></button>
      <object data-testid="object" data="companylogo.gif" type="image/gif"><p>Company Name</p></object>
      <p><img data-testid="img-paragraph" src="" alt="" />Test content</p>
      <svg data-testid="svg-without-title"></svg>
    </div>
  `)

  expect(queryByTestId('img-alt')).toBeLabelled()
  expect(queryByTestId('img-label')).toBeLabelled()
  expect(queryByTestId('img-labelledby')).toBeLabelled()
  expect(queryByTestId('img-empty-alt')).not.toBeLabelled()
  expect(queryByTestId('svg-title')).toBeLabelled()
  expect(queryByTestId('img-text-sibling')).toBeLabelled()
  expect(queryByTestId('button-img-alt')).toBeLabelled()
  expect(queryByTestId('object')).toBeLabelled()
  expect(queryByTestId('img-paragraph')).not.toBeLabelled()
  expect(queryByTestId('svg-without-title')).not.toBeLabelled()
})
