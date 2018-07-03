import { toContainElement } from "./src";

declare namespace jest {
  interface Matchers<R> {
    toHaveAttribute: (attr: string, value?: string) => R
    toHaveTextContent: (text: string) => R
    toHaveClass: (className: string) => R
    toBeInTheDOM: (container: HTMLElement) => R
    toContainElement: (element: HTMLElement) => R
    toHaveStyle: (css: string) => R
  }
}
