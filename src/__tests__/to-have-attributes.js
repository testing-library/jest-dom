import {render} from './helpers/test-utils'

const invalidDataErrorBase =
  '.toHaveAttributes() expects object with at least one property, received'

test('.toHaveAttributes', () => {
  const {queryByTestId} = render(`
    <button data-testid="ok-button" type="submit" disabled>
      OK
    </button>
    <svg data-testid="svg-element" width="12"></svg>
  `)

  expect(queryByTestId('ok-button')).toHaveAttributes({
    disabled: '',
    type: 'submit',
    'data-testid': 'ok-button',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    disabled: false,
    type: 'reset',
    'data-testid': 'ok',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    disabled: 'false',
    type: 'reset',
    'data-testid': 'ok',
  })

  expect(queryByTestId('ok-button')).toHaveAttributes({
    type: 'submit',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    type: 'reset',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    type: '',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    type: true,
  })

  expect(queryByTestId('ok-button')).toHaveAttributes({
    disabled: '',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    disabled: 'true',
  })
  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    disabled: true,
  })

  expect(queryByTestId('ok-button')).not.toHaveAttributes({
    value: 'value',
  })

  expect(queryByTestId('svg-element')).toHaveAttributes({width: '12'})
  expect(queryByTestId('svg-element')).not.toHaveAttributes({width: '13'})
  expect(queryByTestId('svg-element')).not.toHaveAttributes({height: '12'})

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes(),
  ).toThrowError(`${invalidDataErrorBase} undefined`)
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes(),
  ).toThrowError(`${invalidDataErrorBase} undefined`)

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes({}),
  ).toThrowError(`${invalidDataErrorBase} {}`)
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes({}),
  ).toThrowError(`${invalidDataErrorBase} {}`)

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes('disabled'),
  ).toThrowError(`${invalidDataErrorBase} "disabled"`)
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes('disabled'),
  ).toThrowError(`${invalidDataErrorBase} "disabled"`)

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes(true),
  ).toThrowError(`${invalidDataErrorBase} true`)
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes(true),
  ).toThrowError(`${invalidDataErrorBase} true`)

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes(false),
  ).toThrowError(`${invalidDataErrorBase} false`)
  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes(false),
  ).toThrowError(`${invalidDataErrorBase} false`)

  // // Asymmetric matchers
  expect(queryByTestId('ok-button')).toHaveAttributes({
    type: expect.stringContaining('sub'),
    disabled: '',
  })

  expect(queryByTestId('ok-button')).toHaveAttributes({
    type: expect.not.stringContaining('res'),
    disabled: '',
  })

  expect(queryByTestId('ok-button')).toHaveAttributes({
    type: expect.anything(),
    disabled: '',
  })

  expect(queryByTestId('ok-button')).toHaveAttributes({
    type: expect.stringMatching(/sub*/),
    disabled: '',
  })

  expect(queryByTestId('ok-button')).toHaveAttributes({
    type: expect.not.stringMatching(/res*/),
    disabled: '',
  })

  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes({
      type: expect.stringContaining('sub'),
    }),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes({
      type: expect.stringContaining('sub'),
      disabled: '',
    }),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes({
      type: expect.not.stringContaining('sub'),
      disabled: '',
    }),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes({
      type: expect.stringContaining('res'),
      disabled: '',
    }),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('ok-button')).toHaveAttributes({
      type: expect.stringContaining('res'),
      disabled: '',
    }),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes({
      type: expect.anything(),
      disabled: '',
    }),
  ).toThrowError()

  expect(() =>
    expect(queryByTestId('ok-button')).not.toHaveAttributes({
      type: expect.stringMatching(/sub*/),
      disabled: '',
    }),
  ).toThrowError()
})
