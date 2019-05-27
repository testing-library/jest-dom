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
      <button data-testid="svg-button"><svg><title>Test</title></svg></p>
      <div><svg data-testid="svg-without-title"></svg></div>
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
  expect(queryByTestId('svg-button')).toBeLabelled()
  expect(queryByTestId('svg-without-title')).not.toBeLabelled()

  expect(() =>
    expect(queryByTestId('img-alt')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('img-label')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('img-labelledby')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('img-empty-alt')).toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('svg-title')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('img-text-sibling')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('button-img-alt')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('object')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('img-paragraph')).toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('svg-button')).not.toBeLabelled(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('svg-without-title')).toBeLabelled(),
  ).toThrowError()
})
