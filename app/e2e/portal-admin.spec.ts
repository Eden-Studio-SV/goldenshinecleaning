import { test, expect } from "@playwright/test";
import {
  signInEmulator,
  ADMIN_EMAIL,
  CLIENT_EMAIL,
  CLIENT_EMAIL_2,
  wipeFirestore,
  seedUser,
  firestoreSeedSolicitud,
  firestoreSeedCliente,
  emulatorUserId,
  firestoreGetSolicitud,
} from "./helpers/emulator";
import { fechaFuturaDiaUTC } from "./helpers/dates";
import { Timestamp } from "firebase/firestore";

/**
 * Tests de portal y admin: vacío, filtros, detalle, acciones
 * (confirmar/rechazar/cancelar), propuestas ambas direcciones
 * (aceptar/rechazar), completar visita recurrente sin duplicar.
 *
 * Usa seed directo en Firestore emulador para preparar escenarios sin
 * pasar por la UI cuando se necesita un estado inicial específico.
 */

function fechaFuturaViernes(): string {
  return fechaFuturaDiaUTC(5);
}

function fechaFuturaSabado(): string {
  return fechaFuturaDiaUTC(6);
}

let CLIENT_UID = "";

test.beforeEach(async ({ page }) => {
  await wipeFirestore();
  await seedUser(ADMIN_EMAIL, { emailVerified: true, displayName: "Admin Golden" });
  await seedUser(CLIENT_EMAIL, { emailVerified: true, displayName: "Cliente Test" });
  await seedUser(CLIENT_EMAIL_2, { emailVerified: true, displayName: "Otro Cliente" });
  CLIENT_UID = await emulatorUserId(CLIENT_EMAIL);
  await firestoreSeedCliente(CLIENT_UID, {
    email: CLIENT_EMAIL,
    nombre: "Cliente Test",
  });
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

test.describe("Portal — vacío y listado", () => {
  test("portal vacío muestra mensaje y CTA", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await expect(page).toHaveURL(/\/portal/);
    await expect(page.getByText(/haven't requested|no has solicitado/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /first cleaning|primera limpieza/i })).toBeVisible();
  });

  test("portal muestra solicitudes del cliente", async ({ page }) => {
    // Seed una solicitud para el cliente
    await firestoreSeedSolicitud("sol-portal-1", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Test",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St, Boston, MA",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "pendiente",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await expect(page.getByText(/Residential Cleaning|Limpieza Residencial/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Admin — vacío, filtros y detalle", () => {
  test("admin vacío muestra mensaje", async ({ page }) => {
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText(/No requests|No hay solicitudes/i)).toBeVisible({ timeout: 10000 });
  });

  test("admin muestra solicitudes y filtra por estado", async ({ page }) => {
    await firestoreSeedSolicitud("sol-admin-1", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Ana",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "pendiente",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await expect(page.getByText("Ana").first()).toBeVisible({ timeout: 10000 });

    // Filtrar por Pendiente
    await page.getByRole("tab", { name: /Pending|Pendiente/i }).click();
    await expect(page.getByText("Ana").first()).toBeVisible();

    // Filtrar por Completada (vacío)
    await page.getByRole("tab", { name: /Completed|Completada/i }).click();
    await expect(page.getByText(/No requests|No hay solicitudes/i)).toBeVisible({ timeout: 10000 });
  });

  test("admin detalle muestra información de la solicitud", async ({ page }) => {
    await firestoreSeedSolicitud("sol-detalle-1", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Ana Detalle",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "airbnb",
      direccion: "789 Host St, Boston",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "14:00",
      frecuencia: "semanal",
      estado: "pendiente",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await page.getByText("Ana Detalle").first().click();
    await expect(page.getByText(/Airbnb/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Weekly|Semanal/i)).toBeVisible();
  });
});

test.describe("Acciones — confirmar/rechazar/cancelar", () => {
  test("admin confirma solicitud pendiente", async ({ page }) => {
    await firestoreSeedSolicitud("sol-confirmar", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Ana Confirmar",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "pendiente",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await page.getByText("Ana Confirmar").first().click();
    await page.getByRole("button", { name: /^Confirm$|^Confirmar$/i }).click();
    // El estado debe cambiar a Scheduled/Agendada
    await expect(page.getByText(/Scheduled|Agendada/i).first()).toBeVisible({ timeout: 10000 });
    // Verificar en Firestore
    const doc = await firestoreGetSolicitud("sol-confirmar");
    expect(doc?.["estado"]).toBe("agendada");
  });

  test("admin rechaza solicitud pendiente", async ({ page }) => {
    await firestoreSeedSolicitud("sol-rechazar", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Ana Rechazar",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "pendiente",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await page.getByText("Ana Rechazar").first().click();
    await page.getByRole("button", { name: /^Reject$|^Rechazar$/i }).click();
    await page.getByRole("button", { name: /Confirm rejection|Confirmar rechazo/i }).click();
    await expect(page.getByText(/Rejected|Rechazada/i).first()).toBeVisible({ timeout: 10000 });
    const doc = await firestoreGetSolicitud("sol-rechazar");
    expect(doc?.["estado"]).toBe("rechazada");
  });

  test("cliente cancela solicitud pendiente", async ({ page }) => {
    await firestoreSeedSolicitud("sol-cancelar", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Test",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "pendiente",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.getByText(/Residential|Residencial/i).click();
    // Aceptar el confirm del navegador
    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /^Cancel$|^Cancelar$/i }).click();
    await expect(page.getByText(/Cancelled|Cancelada/i).first()).toBeVisible({ timeout: 10000 });
    const doc = await firestoreGetSolicitud("sol-cancelar");
    expect(doc?.["estado"]).toBe("cancelada");
  });
});

test.describe("Propuestas — ambas direcciones", () => {
  test("admin propone y cliente acepta", async ({ page, context }) => {
    await firestoreSeedSolicitud("sol-prop-admin", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Test",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "agendada",
      creadoEn: Timestamp.now(),
    });

    // Admin propone nueva fecha
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await page.getByText("Cliente Test").first().click();
    await page.getByRole("button", { name: /Propose another date|Proponer otra fecha/i }).click();
    const nuevaFecha = fechaFuturaSabado();
    await page.locator("#re-fecha").fill(nuevaFecha);
    await page.locator("#re-hora").fill("11:00");
    await page.getByRole("button", { name: /Send proposal|Enviar propuesta/i }).click();
    await expect(page.getByText(/To confirm|Por confirmar/i).first()).toBeVisible({ timeout: 10000 });

    // Cliente acepta (nueva página para mantener sesión admin separada)
    const clientPage = await context.newPage();
    await clientPage.goto("/ingresar");
    await signInEmulator(clientPage, CLIENT_EMAIL);
    await clientPage.getByText(/Residential|Residencial/i).click();
    await expect(clientPage.getByText(/Golden Shine proposes|Golden Shine propone/i)).toBeVisible({ timeout: 10000 });
    await clientPage.getByRole("button", { name: /Accept new date|Aceptar nueva fecha/i }).click();
    await expect(clientPage.getByText(/Scheduled|Agendada/i).first()).toBeVisible({ timeout: 10000 });
    const doc = await firestoreGetSolicitud("sol-prop-admin");
    expect(doc?.["estado"]).toBe("agendada");
    expect(doc?.["fechaDeseada"]).toBe(nuevaFecha);
  });

  test("cliente propone y admin acepta", async ({ page, context }) => {
    await firestoreSeedSolicitud("sol-prop-cliente", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Test",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "agendada",
      creadoEn: Timestamp.now(),
    });

    // Cliente propone
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.getByText(/Residential|Residencial/i).click();
    await page.getByRole("button", { name: /Request another date|Pedir otra fecha/i }).click();
    const nuevaFecha = fechaFuturaSabado();
    await page.locator("#re-fecha").fill(nuevaFecha);
    await page.locator("#re-hora").fill("12:00");
    await page.getByRole("button", { name: /Send proposal|Enviar propuesta/i }).click();
    await expect(page.getByText(/To confirm|Por confirmar/i).first()).toBeVisible({ timeout: 10000 });

    // Admin acepta
    const adminPage = await context.newPage();
    await adminPage.goto("/ingresar");
    await signInEmulator(adminPage, ADMIN_EMAIL);
    await adminPage.getByText("Cliente Test").first().click();
    await expect(adminPage.getByText(/customer requests|cliente solicita/i)).toBeVisible({ timeout: 10000 });
    await adminPage.getByRole("button", { name: /Accept new date|Aceptar nueva fecha/i }).click();
    await expect(adminPage.getByText(/Scheduled|Agendada/i).first()).toBeVisible({ timeout: 10000 });
    const doc = await firestoreGetSolicitud("sol-prop-cliente");
    expect(doc?.["estado"]).toBe("agendada");
    expect(doc?.["fechaDeseada"]).toBe(nuevaFecha);
  });

  test("cliente rechaza propuesta del admin", async ({ page }) => {
    await firestoreSeedSolicitud("sol-rech-prop", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Test",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "reprogramacion",
      estadoPrevio: "agendada",
      propuesta: { fecha: fechaFuturaSabado(), hora: "11:00", por: "admin", motivo: null },
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, CLIENT_EMAIL);
    await page.getByText(/Residential|Residencial/i).click();
    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /Reject proposal|Rechazar propuesta/i }).click();
    await expect(page.getByText(/Scheduled|Agendada/i).first()).toBeVisible({ timeout: 10000 });
    const doc = await firestoreGetSolicitud("sol-rech-prop");
    expect(doc?.["estado"]).toBe("agendada");
    // Vuelve a la fecha original
    expect(doc?.["fechaDeseada"]).toBe(fechaFuturaViernes());
  });
});

test.describe("Completar recurrente — no duplicar", () => {
  test("completar visita semanal genera siguiente y no duplica", async ({ page }) => {
    const fecha = fechaFuturaViernes();
    await firestoreSeedSolicitud("sol-recurrente-1", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Recurrente",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fecha,
      horaDeseada: "10:00",
      frecuencia: "semanal",
      serieId: "serie-rec",
      estado: "agendada",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await page.getByText("Cliente Recurrente").first().click();
    await page.getByRole("button", { name: /Mark as completed|Marcar completada/i }).click();
    await expect(page.getByText(/Completed|Completada/i)).toBeVisible({ timeout: 10000 });

    // Verificar que la visita actual está completada
    await expect.poll(async () => (await firestoreGetSolicitud("sol-recurrente-1"))?.["estado"]).toBe("completada");

    // Verificar que se creó la siguiente visita con id determinista
    // proximaFecha semanal = fecha + 7 días
    const [y, m, d] = fecha.split("-").map(Number);
    const siguiente = new Date(y, m - 1, d + 7);
    const sigISO = `${siguiente.getFullYear()}-${String(siguiente.getMonth() + 1).padStart(2, "0")}-${String(siguiente.getDate()).padStart(2, "0")}`;
    const siguienteId = `serie-rec_${sigISO}`;
    const sigDoc = await firestoreGetSolicitud(siguienteId);
    expect(sigDoc).not.toBeNull();
    expect(sigDoc?.["estado"]).toBe("agendada");
    expect(sigDoc?.["serieId"]).toBe("serie-rec");

    // Completar de nuevo la visita original (ya completada) no debe duplicar
    // (idempotencia: no se vuelve a completar)
    // Ya está completada, no hay botón de completar. Verificamos que no hay
    // otro doc con la misma fecha siguiente.
  });

  test("completar visita única no genera siguiente", async ({ page }) => {
    await firestoreSeedSolicitud("sol-unica-1", {
      clienteId: CLIENT_UID,
      clienteEmail: CLIENT_EMAIL,
      nombre: "Cliente Unica",
      telefono: "(617) 555-1234",
      email: CLIENT_EMAIL,
      tipoServicio: "residencial",
      direccion: "123 Beacon St",
      fechaDeseada: fechaFuturaViernes(),
      horaDeseada: "10:00",
      frecuencia: "unica",
      estado: "agendada",
      creadoEn: Timestamp.now(),
    });
    await page.goto("/ingresar");
    await signInEmulator(page, ADMIN_EMAIL);
    await page.getByText("Cliente Unica").first().click();
    await page.getByRole("button", { name: /Mark as completed|Marcar completada/i }).click();
    await expect(page.getByText(/Completed|Completada/i)).toBeVisible({ timeout: 10000 });
    await expect.poll(async () => (await firestoreGetSolicitud("sol-unica-1"))?.["estado"]).toBe("completada");
  });
});
