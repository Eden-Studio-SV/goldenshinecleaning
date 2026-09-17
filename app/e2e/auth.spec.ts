import { test, expect } from "@playwright/test";
import {
  signInEmulator,
  ADMIN_EMAIL,
  CLIENT_EMAIL,
  wipeFirestore,
  seedUser,
} from "./helpers/emulator";

/**
 * Tests de autenticación: login cliente/admin, guards, logout, returnTo.
 * Usa el Auth Emulator real (popup simulado).
 */

test.beforeEach(async ({ page }) => {
  await wipeFirestore();
  await seedUser(ADMIN_EMAIL, { emailVerified: true, displayName: "Admin Golden" });
  await seedUser(CLIENT_EMAIL, { emailVerified: true, displayName: "Cliente Test" });
  // Intercepta tiles
  await page.route("**/tile.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: Buffer.alloc(0) }),
  );
  await page.route("**/nominatim.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"display_name":"Boston, MA"}' }),
  );
});

test.afterEach(async () => {
  await wipeFirestore();
});

test.describe("Auth — login", () => {
  test("login cliente redirige a /portal", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await expect(page).toHaveURL(/\/portal/);
    await expect(page.getByRole("heading", { name: /My cleanings|Mis limpiezas/i })).toBeVisible();
  });

  test("login admin redirige a /admin", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: /Requests|Solicitudes/i })).toBeVisible();
  });

  test("guard RequireAuth redirige a /ingresar sin sesión", async ({ page }) => {
    await page.goto("/solicitar");
    await expect(page).toHaveURL(/\/ingresar/);
  });

  test("guard RequireAdmin muestra bloqueo a cliente", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    // Ir a /admin como cliente
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: /without panel access|sin acceso al panel/i })).toBeVisible();
  });

  test("logout desde portal", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await expect(page).toHaveURL(/\/portal/);
    await page.getByRole("button", { name: /Sign out|Salir|Cerrar sesión/i }).click();
    await expect(page).toHaveURL(/\/ingresar$/);
  });

  test("returnTo: tras login vuelve a la ruta protegida", async ({ page }) => {
    // Visitar /solicitar sin sesión -> redirige a /ingresar con state.from
    await page.goto("/solicitar");
    await expect(page).toHaveURL(/\/ingresar/);
    await signInEmulator(page, CLIENT_EMAIL);
    // Tras login, vuelve a /solicitar
    await expect(page).toHaveURL(/\/solicitar/);
  });
});
