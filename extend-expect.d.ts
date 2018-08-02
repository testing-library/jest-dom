declare namespace jest {
  interface Matchers<R> {
    /**
     * @deprecated
     */
    toBeInTheDOM(container?: HTMLElement | SVGElement): R
    toBeInTheDocument(): R
    toBeVisible(): R
    toBeEmpty(): R
    toBeDisabled(): R
    toContainElement(element: HTMLElement | SVGElement | null): R
    toContainHTML(htmlText: string): R
    toHaveAttribute(attr: string, value?: string): R
    toHaveClass(...classNames: string[]): R
    toHaveStyle(css: string): R
    toHaveTextContent(text: string | RegExp): R
    toHaveFocus(): R
  }
}
