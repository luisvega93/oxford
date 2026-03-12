import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

class ResizeObserverMock {
  callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: {
            width: 1200,
            height: 720,
            top: 0,
            left: 0,
            right: 1200,
            bottom: 720,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver,
    )
  }

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
})

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 1200,
})

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 720,
})

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  value: 1200,
})

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 720,
})

HTMLElement.prototype.getBoundingClientRect = () =>
  ({
    width: 1200,
    height: 720,
    top: 0,
    left: 0,
    right: 1200,
    bottom: 720,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }) as DOMRect

if (!('getBBox' in SVGElement.prototype)) {
  Object.defineProperty(SVGElement.prototype, 'getBBox', {
    writable: true,
    value: () =>
      ({
        x: 0,
        y: 0,
        width: 120,
        height: 32,
      }) as DOMRect,
  })
}

const originalConsoleError = console.error
const originalConsoleWarn = console.warn

vi.spyOn(console, 'error').mockImplementation((message?: unknown, ...args) => {
  if (
    typeof message === 'string' &&
    message.includes(
      'The width(-1) and height(-1) of chart should be greater than 0',
    )
  ) {
    return
  }

  originalConsoleError(message, ...args)
})

vi.spyOn(console, 'warn').mockImplementation((message?: unknown, ...args) => {
  if (
    typeof message === 'string' &&
    message.includes(
      'The width(-1) and height(-1) of chart should be greater than 0',
    )
  ) {
    return
  }

  originalConsoleWarn(message, ...args)
})
