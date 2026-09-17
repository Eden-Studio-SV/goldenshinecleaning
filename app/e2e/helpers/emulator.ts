/** Helpers exclusivamente para los emuladores locales de E2E. */
import { test as base, type Page, expect } from "@playwright/test";

const PROJECT_ID = "demo-goldenshine";
const AUTH_URL = "http://127.0.0.1:9100";
const FIRESTORE_URL = "http://127.0.0.1:8081";
const REST_DOCUMENTS = `${FIRESTORE_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export const ADMIN_EMAIL = "info@edenstudio.dev";
export const CLIENT_EMAIL = "cliente@test.com";
export const CLIENT_EMAIL_2 = "otro@test.com";

function assertDemoEndpoint(url: string) {
  if (PROJECT_ID !== "demo-goldenshine" || !url.startsWith("http://127.0.0.1:")) {
    throw new Error("Los helpers E2E solo pueden usar el emulador demo local.");
  }
}

async function request(url: string, init?: RequestInit) {
  assertDemoEndpoint(url);
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Emulador respondió ${response.status}: ${await response.text()}`);
  return response;
}

/** Crea la cuenta por REST en Auth Emulator; falla explícitamente si no está disponible. */
export async function seedUser(email: string, opts?: { emailVerified?: boolean; displayName?: string }) {
  const url = `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`;
  assertDemoEndpoint(url);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "e2e-password", returnSecureToken: true }),
  });
  if (!response.ok) {
    const body = await response.text();
    if (response.status === 400 && body.includes("EMAIL_EXISTS")) return;
    throw new Error(`Auth Emulator respondió ${response.status}: ${body}`);
  }
  const account = (await response.json()) as { idToken: string };
  if (opts?.displayName) {
    await request(`${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-api-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: account.idToken, displayName: opts.displayName }),
    });
  }
  if (opts?.emailVerified) {
    await request(`${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=demo-api-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "VERIFY_EMAIL", idToken: account.idToken }),
    });
    const oob = await request(`${AUTH_URL}/emulator/v1/projects/${PROJECT_ID}/oobCodes`);
    const body = (await oob.json()) as { oobCodes?: { oobCode: string; email?: string }[] };
    const entries = body.oobCodes ?? [];
    const code = entries.find((entry) => entry.email === email)?.oobCode;
    if (!code) throw new Error(`No se generó código de verificación para ${email}.`);
    await request(`${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-api-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oobCode: code }),
    });
  }
}

/**
 * El Auth Emulator no ofrece una cuenta seleccionable para Google y deja el
 * iframe OAuth en “Connecting…”. El fixture aislado usa el mismo singleton de
 * Firebase de la SPA para iniciar una credencial local real del emulador.
 */
export async function signInEmulator(page: Page, email: string) {
  await page.goto(`/e2e/fixtures/auth-emulator.html?email=${encodeURIComponent(email)}`);
  await page.getByRole("status").waitFor({ state: "visible" });
  await page.getByRole("status").filter({ hasText: "Sesión del emulador iniciada." }).waitFor();
  await page.goBack();
  await page.reload();
  await page.waitForLoadState("domcontentloaded");
  // `/ingresar` aplica su redirección tras restaurar la sesión. Las rutas
  // públicas (por ejemplo, la confirmación) deben conservarse tal cual.
  if (new URL(page.url()).pathname === "/ingresar") {
    await page.waitForURL(/\/(portal|admin|solicitar)/, { timeout: 15_000 });
  }
}

type FirestoreValue =
  | { stringValue: string } | { booleanValue: boolean } | { integerValue: string }
  | { doubleValue: number } | { nullValue: null } | { timestampValue: string }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values: FirestoreValue[] } };

function encode(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return { timestampValue: (value as { toDate: () => Date }).toDate().toISOString() };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, encode(entry)])) } };
}

function decode(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return value.arrayValue.values.map(decode);
  return Object.fromEntries(Object.entries(value.mapValue.fields).map(([key, entry]) => [key, decode(entry)]));
}

/** Reset REST administrativo del emulador: no existe fuera de localhost/demo. */
export async function wipeFirestore() {
  await request(`${FIRESTORE_URL}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`, { method: "DELETE" });
}

async function seed(collection: string, id: string, data: Record<string, unknown>) {
  const email = collection === "clientes" ? String(data.email) : ADMIN_EMAIL;
  const session = await getEmulatorSession(email);
  const documentId = collection === "clientes" ? session.localId : id;
  await request(`${REST_DOCUMENTS}/${collection}/${encodeURIComponent(documentId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.idToken}` },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encode(value)])) }),
  });
}

async function getEmulatorSession(email: string): Promise<{ idToken: string; localId: string }> {
  const tokenResponse = await request(`${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "e2e-password", returnSecureToken: true }),
  });
  return (await tokenResponse.json()) as { idToken: string; localId: string };
}

export async function emulatorUserId(email: string): Promise<string> {
  return (await getEmulatorSession(email)).localId;
}

export async function firestoreSeedSolicitud(id: string, data: Record<string, unknown>) { await seed("solicitudes", id, data); }
export async function firestoreSeedCliente(uid: string, data: Record<string, unknown>) { await seed("clientes", uid, data); }

export async function firestoreGetSolicitud(id: string): Promise<Record<string, unknown> | null> {
  const session = await getEmulatorSession(ADMIN_EMAIL);
  const response = await fetch(`${REST_DOCUMENTS}/solicitudes/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${session.idToken}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Emulador respondió ${response.status}: ${await response.text()}`);
  const body = (await response.json()) as { fields: Record<string, FirestoreValue> };
  return Object.fromEntries(Object.entries(body.fields).map(([key, value]) => [key, decode(value)]));
}

export const test = base.extend<{ emulatorSeed: void }>({
  emulatorSeed: async ({}, use) => {
    await wipeFirestore();
    await seedUser(ADMIN_EMAIL, { emailVerified: true, displayName: "Admin Golden" });
    await seedUser(CLIENT_EMAIL, { emailVerified: true, displayName: "Cliente Test" });
    await seedUser(CLIENT_EMAIL_2, { emailVerified: true, displayName: "Otro Cliente" });
    await use();
    await wipeFirestore();
  },
});

export { expect };
