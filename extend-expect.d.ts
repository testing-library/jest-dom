import {toContainElement} from './src'

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDOM: (container?: HTMLElement) => R
    toBeVisible: () => R
    toContainElement: (element: HTMLElement) => R
    toHaveAttribute: (attr: string, value?: string) => R
    toHaveClass: (className: string) => R
    toHaveStyle: (css: string) => R
    toHaveTextContent: (text: string) => R
  }
}
