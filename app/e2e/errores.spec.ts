import { test, expect } from "@playwright/test";
import {
  signInEmulator,
  ADMIN_EMAIL,
  CLIENT_EMAIL,
  wipeFirestore,
  seedUser,
} from "./helpers/emulator";

/**
 * Tests de errores: backend caído, red, mapa (geocoding).
 * Intercepta y simula fallos.
 */

test.beforeEach(async () => {
  await wipeFirestore();
  await seedUser(ADMIN_EMAIL, { emailVerified: true, displayName: "Admin Golden" });
  await seedUser(CLIENT_EMAIL, { emailVerified: true, displayName: "Cliente Test" });
});

test.afterEach(async () => {
  await wipeFirestore();
});

test.describe("Errores — mapa y geocoding", () => {
  test("geocoding inverso falla graceful", async ({ page }) => {
    await page.route("**/nominatim.openstreetmap.org/**", (route) =>
      route.fulfill({ status: 500 }),
    );
    await page.route("**/tile.openstreetmap.org/**", (route) =>
      route.fulfill({ status: 200, contentType: "image/png", body: Buffer.alloc(0) }),
    );
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    // El formulario carga sin error fatal
    await expect(page.getByRole("heading", { name: /Request your cleaning|Solicita tu limpieza/i })).toBeVisible();
  });

  test("tiles del mapa interceptados (no red externa)", async ({ page }) => {
    await page.route("**/tile.openstreetmap.org/**", (route) => {
      route.fulfill({ status: 200, contentType: "image/png", body: Buffer.alloc(0) });
    });
    await page.route("**/nominatim.openstreetmap.org/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"display_name":"Boston"}' }),
    );
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    // El mapa carga (tiles interceptados)
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Errores — backend Firestore", () => {
  async function forzarErrorDeListener(page: import("@playwright/test").Page) {
    let solicitudesInterceptadas = 0;
    await page.route("**/google.firestore.v1.Firestore/Listen/**", async (route) => {
      solicitudesInterceptadas += 1;
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: 403, status: "PERMISSION_DENIED" } }),
      });
    });
    await page.reload();
    await expect.poll(() => solicitudesInterceptadas).toBeGreaterThan(0);
  }

  test("portal conserva un estado vacío estable ante un listener reintentable", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await forzarErrorDeListener(page);
    // El SDK reintenta errores transitorios del listener; la UI conserva su
    // snapshot vacío en vez de bloquearse.
    await expect(page.getByText(/haven't requested|no has solicitado/i)).toBeVisible();
  });

  test("admin conserva un estado vacío estable ante un listener reintentable", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await forzarErrorDeListener(page);
    await expect(page.getByText(/No requests|No hay solicitudes/i)).toBeVisible();
  });
});
