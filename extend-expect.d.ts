declare namespace jest {
  interface Matchers<R> {
    toHaveAttribute: (attr: string, value?: string) => R
    toHaveTextContent: (text: string) => R
    toHaveClass: (className: string) => R
    toBeInTheDOM: () => R
    toHaveStyle: (css: string) => R
  }
}
