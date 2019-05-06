declare namespace jest {
  interface InverseStringAsymmetricMatchers {
    stringMatching(str: string | RegExp): any
    stringContaining(str: string): any
  }
  interface Expect {
    stringMatching(str: string | RegExp): any
    stringContaining(str: string): any
    anything(): any
    any(classType: any): any
    not: InverseStringAsymmetricMatchers
  }

  type attributeValueType =
    | string
    | Expect.stringContaining
    | Expect.stringMatching
    | Expect.any
    | Expect.anything
    | Expect.not

  interface Matchers<R> {
    /**
     * @deprecated
     */
    toBeInTheDOM(container?: HTMLElement | SVGElement): R
    toBeInTheDocument(): R
    toBeVisible(): R
    toBeEmpty(): R
    toBeDisabled(): R
    toBeEnabled(): R
    toContainElement(element: HTMLElement | SVGElement | null): R
    toContainHTML(htmlText: string): R
    toHaveAttribute(attr: string, value?: attributeValueType): R
    toHaveClass(...classNames: string[]): R
    toHaveFocus(): R
    toHaveFormValues(expectedValues: {[name: string]: any}): R
    toHaveStyle(css: string): R
    toHaveTextContent(
      text: string | RegExp,
      options?: {normalizeWhitespace: boolean},
    ): R
  }
}
