declare namespace jest {
  interface Matchers<R> {
    toBeInTheDOM(container?: HTMLElement | SVGElement): R
    toBeVisible(): R
    toBeEmpty(): R
    toBeDisabled(): R
    toContainElement(element: HTMLElement | SVGElement): R
    toHaveAttribute(attr: string, value?: string): R
    toHaveClass(...classNames: string[]): R
    toHaveStyle(css: string): R
    toHaveTextContent(text: string | RegExp): R
    toHaveFocus(): R
  }
}
