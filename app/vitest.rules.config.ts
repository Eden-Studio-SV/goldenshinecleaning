import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

// Configuración de Vitest para las pruebas de reglas de Firestore que corren
// bajo el emulador (npm run test:rules). No carga jsdom ni setup de DOM.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["test/rules/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["test/unit/**", "e2e/**", "node_modules/**", "dist/**"],
  },
});