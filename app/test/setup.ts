import "@testing-library/jest-dom/vitest";

// jsdom no implementa matchMedia ni IntersectionObserver, usados por Leaflet
// y por componentes de UI en pruebas. Se proveen stubs seguros.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });
}

if (!("IntersectionObserver" in window)) {
  // @ts-expect-error stub mínimo para jsdom
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}