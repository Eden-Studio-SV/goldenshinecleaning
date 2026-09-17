import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Configuración de Vitest para pruebas unitarias (lógica, validators, format,
// auth helpers, clientes, solicitudes) con jsdom + coverage v8.
// Las pruebas de reglas de Firestore corren bajo el emulador y se orquestan
// con `npm run test:rules`; no usan este config de jsdom.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["test/unit/**/*.{test,spec}.{ts,tsx}", "test/components/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["test/rules/**", "e2e/**", "node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/types/**"],
    },
  },
});
