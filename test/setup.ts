import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Polyfill missing DOM APIs used in components
// mock scrollIntoView which JSDOM doesn't implement
;(Element.prototype as any).scrollIntoView = function () {};
// mock window.scrollTo
;(window as any).scrollTo = () => {};
