import { defineConfig, devices } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));

/**
 * Configuración Playwright.
 *
 * - `globalSetup` levanta los emuladores de Firebase (Auth 9100, Firestore
 *   8081) y `webServer` inicia `vite` en el puerto fijo 5174. Los datos de Firebase
 *   del demo se inyectan por variables de entorno de proceso (sin leer .env).
 * - No reutiliza un servidor ajeno: Playwright gestiona su propio webServer.
 * - Las pruebas E2E usan Auth/Firestore emulados reales (no bypass).
 * - Para detener: Playwright mata el webServer al terminar; los emuladores
 *   se detienen con el proceso padre.
 */
export default defineConfig({
  testDir: resolve(appDir, "e2e"),
  globalSetup: resolve(appDir, "e2e/global-setup.ts"),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "on-first-retry",
    actionTimeout: 15_000,
    navigationTimeout: 20_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Vite se limita al loopback y falla si el puerto fijo no está disponible.
    command: `node ${resolve(appDir, "node_modules/vite/bin/vite.js")} --host 127.0.0.1 --port 5174 --strictPort`,
    cwd: appDir,
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
    timeout: 120_000,
    // Datos Firebase del demo inyectados por proceso, sin leer .env.
    // VITE_USE_EMULATORS=true => la SPA conecta a Auth 9100 / Firestore 8081.
    env: {
      VITE_FIREBASE_API_KEY: "demo-api-key",
      VITE_FIREBASE_AUTH_DOMAIN: "demo-goldenshine.firebaseapp.com",
      VITE_FIREBASE_PROJECT_ID: "demo-goldenshine",
      VITE_FIREBASE_STORAGE_BUCKET: "demo-goldenshine.appspot.com",
      VITE_FIREBASE_MESSAGING_SENDER_ID: "000000000000",
      VITE_FIREBASE_APP_ID: "1:000000000000:web:demo",
      VITE_ADMIN_EMAILS: "info@edenstudio.dev",
      VITE_USE_EMULATORS: "true",
      VITE_FIRESTORE_EMULATOR_PORT: "8081",
      VITE_AUTH_EMULATOR_PORT: "9100",
    },
  },
});
