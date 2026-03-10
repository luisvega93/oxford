import '@testing-library/jest-dom/vitest'

class ResizeObserverMock {
  observe() {}

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
