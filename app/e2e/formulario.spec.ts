import { test, expect } from "@playwright/test";
import {
  signInEmulator,
  ADMIN_EMAIL,
  CLIENT_EMAIL,
  wipeFirestore,
  seedUser,
  firestoreGetSolicitud,
} from "./helpers/emulator";
import { fechaFuturaDiaUTC } from "./helpers/dates";

/**
 * Tests del formulario de solicitud: validaciones, preselección, envío real
 * al emulador, confirmación tras reload/ajena/no encontrada.
 */

function fechaFuturaViernes(): string {
  return fechaFuturaDiaUTC(5);
}

test.beforeEach(async ({ page }) => {
  await wipeFirestore();
  await seedUser(ADMIN_EMAIL, { emailVerified: true, displayName: "Admin Golden" });
  await seedUser(CLIENT_EMAIL, { emailVerified: true, displayName: "Cliente Test" });
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

test.describe("Formulario — validaciones", () => {
  test("muestra errores de validación al submit vacío", async ({ page }) => {
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    await expect(page).toHaveURL(/\/solicitar/);

    // Submit sin rellenar
    await page.locator("form").getByRole("button", { name: /Request cleaning|Solicitar limpieza/i }).click();

    // Deben aparecer mensajes de error (al menos nombre/teléfono/email/dirección/fecha/hora)
    const errors = page.locator("[role='alert'], .field-error");
    await expect(errors.first()).toBeVisible({ timeout: 5000 });
  });

  test("rechaza fecha pasada", async ({ page }) => {
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    await page.getByLabel(/Full name|Nombre completo/i).fill("Ana López");
    await page.getByLabel(/Phone|Teléfono/i).fill("(617) 555-1234");
    await page.getByLabel(/Email|Correo/i).fill("ana@correo.com");
    await page.getByLabel(/Address|Dirección/i).fill("123 Beacon St, Boston, MA");
    await page.locator('label[for="tipo-residencial"]').click();
    await page.getByLabel(/Preferred date|Fecha deseada/i).fill("2000-01-01");
    await page.getByLabel(/Preferred time|Hora deseada/i).fill("10:00");
    await page.locator("form").getByRole("button", { name: /Request cleaning|Solicitar limpieza/i }).click();
    await expect(page.getByText(/past|pasada|Sunday|domingo/i)).toBeVisible({ timeout: 5000 });
  });

  test("rechaza hora fuera de rango", async ({ page }) => {
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    await page.getByLabel(/Full name|Nombre completo/i).fill("Ana López");
    await page.getByLabel(/Phone|Teléfono/i).fill("(617) 555-1234");
    await page.getByLabel(/Email|Correo/i).fill("ana@correo.com");
    await page.getByLabel(/Address|Dirección/i).fill("123 Beacon St, Boston, MA");
    await page.locator('label[for="tipo-residencial"]').click();
    const fecha = fechaFuturaViernes();
    await page.getByLabel(/Preferred date|Fecha deseada/i).fill(fecha);
    await page.getByLabel(/Preferred time|Hora deseada/i).fill("20:00");
    await page.locator("form").getByRole("button", { name: /Request cleaning|Solicitar limpieza/i }).click();
    await expect(page.getByText(/08:00|19:00|Monday to Saturday|lunes a sábado/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Formulario — preselección", () => {
  test("preselección de servicio via ?servicio=airbnb", async ({ page }) => {
    await page.goto("/solicitar?servicio=airbnb");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar?servicio=airbnb");
    // El radio de airbnb debe estar seleccionado
    const airbnbRadio = page.locator("#tipo-airbnb");
    await expect(airbnbRadio).toBeChecked();
  });

  test("preselección de post_construccion", async ({ page }) => {
    await page.goto("/solicitar?servicio=post_construccion");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar?servicio=post_construccion");
    await expect(page.locator("#tipo-post_construccion")).toBeChecked();
  });
});

test.describe("Formulario — envío y confirmación", () => {
  test("envía y crea documento real en emulador", async ({ page }) => {
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    await expect(page).toHaveURL(/\/solicitar/);

    await page.getByLabel(/Full name|Nombre completo/i).fill("Ana López");
    await page.getByLabel(/Phone|Teléfono/i).fill("(617) 555-1234");
    await page.getByLabel(/Email|Correo/i).fill("ana@correo.com");
    await page.getByLabel(/Address|Dirección/i).fill("123 Beacon St, Boston, MA");
    await page.locator('label[for="tipo-residencial"]').click();
    const fecha = fechaFuturaViernes();
    await page.getByLabel(/Preferred date|Fecha deseada/i).fill(fecha);
    await page.getByLabel(/Preferred time|Hora deseada/i).fill("10:00");
    await page.locator("form").getByRole("button", { name: /Request cleaning|Solicitar limpieza/i }).click();

    // Confirmación
    await expect(page).toHaveURL(/\/solicitud-enviada\?id=/);
    await expect(page.getByRole("heading", { name: /Request received|Solicitud recibida/i })).toBeVisible();

    // Verificar que el documento existe en el emulador
    const url = new URL(page.url());
    const id = url.searchParams.get("id");
    expect(id).toBeTruthy();
    const doc = await firestoreGetSolicitud(id!);
    expect(doc).not.toBeNull();
    expect(doc?.["nombre"]).toBe("Ana López");
    expect(doc?.["estado"]).toBe("pendiente");
    expect(doc?.["tipoServicio"]).toBe("residencial");
  });

  test("confirmación tras reload carga la solicitud via ?id=", async ({ page }) => {
    await page.goto("/solicitar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitar");
    await page.getByLabel(/Full name|Nombre completo/i).fill("Carlos Ruiz");
    await page.getByLabel(/Phone|Teléfono/i).fill("(617) 555-9999");
    await page.getByLabel(/Email|Correo/i).fill("carlos@correo.com");
    await page.getByLabel(/Address|Dirección/i).fill("456 Park St, Boston, MA");
    await page.locator('label[for="tipo-residencial"]').click();
    const fecha = fechaFuturaViernes();
    await page.getByLabel(/Preferred date|Fecha deseada/i).fill(fecha);
    await page.getByLabel(/Preferred time|Hora deseada/i).fill("11:00");
    await page.locator("form").getByRole("button", { name: /Request cleaning|Solicitar limpieza/i }).click();
    await expect(page).toHaveURL(/\/solicitud-enviada\?id=/);

    // Reload: debe seguir mostrando la confirmación cargando via ?id=
    await page.reload();
    await expect(page.getByRole("heading", { name: /Request received|Solicitud recibida/i })).toBeVisible();
    await expect(page.getByText("Carlos")).toBeVisible();
  });

  test("confirmación con id inexistente respeta los permisos de lectura", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    // Ir a confirmación con un id inexistente
    await page.goto("/solicitud-enviada?id=inexistente-xyz");
    await expect(page.getByText(/couldn't load|no pudimos cargar/i)).toBeVisible({ timeout: 10000 });
  });

  test("confirmación sin id muestra noId", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.goto("/solicitud-enviada");
    await expect(page.getByText(/No request ID|no se proporcionó/i)).toBeVisible({ timeout: 10000 });
  });
});
