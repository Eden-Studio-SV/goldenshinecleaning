// Setup específico para pruebas de componentes.
// Extiende el setup global (test/setup.ts) con polyfills de localStorage
// y matchMedia que jsdom no provee por defecto en algunos entornos.

import "@testing-library/jest-dom/vitest";

// Polyfill de localStorage para jsdom (algunos entornos no lo exponen).
if (typeof window !== "undefined" && !window.localStorage) {
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, String(value));
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      get length() {
        return store.size;
      },
    },
    configurable: true,
  });
}

// matchMedia stub (también en setup.ts, pero por si acaso).
if (typeof window !== "undefined" && !window.matchMedia) {
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

if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
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