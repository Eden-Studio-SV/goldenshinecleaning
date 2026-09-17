import { beforeEach, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { getFirestore } from "firebase-admin/firestore";
import { procesarCorreo, RetryableMailError } from "../../src/processor.js";
import type { MailConfig } from "../../src/config.js";
import type { Solicitud } from "../../src/domain.js";

const db = getFirestore();
const config: MailConfig = { enabled: true, host: "smtp.local", port: 587, username: "user@local.test", password: "not-logged", from: "goldenshinecleaning@edenstudio.dev", appBaseUrl: "https://app.example.test", maxAttempts: 3, perUserHour: 10, globalHour: 100 };
const solicitud: Solicitud = { clienteId: "uid-1", clienteEmail: "verified@example.test", nombre: "Ana", tipoServicio: "residencial", fechaDeseada: "2026-10-02", horaDeseada: "10:00" };
const auth = { getUser: async () => ({ emailVerified: true, email: "verified@example.test" }) };
const sink = () => ({ sendMail: async () => ({ messageId: "fake-smtp" }) });
const now = (hour = "2026-10-02T10:00:00.000Z") => () => new Date(hour);
const deliveryId = (event: string, request = "request") => createHash("sha256").update(`${event}:${request}:receipt`).digest("hex");

beforeEach(async () => {
  await Promise.all([db.recursiveDelete(db.collection("mailDeliveries")), db.recursiveDelete(db.collection("mailRateLimits"))]);
});

describe("ledger O(1) con Firestore Emulator y SMTP falso", () => {
  it("deduplica el mismo evento concurrente y no almacena destinatario ni cuerpo", async () => {
    let sent = 0; const transport = { sendMail: async () => { sent++; return {}; } };
    await Promise.all([procesarCorreo("event", "request", "receipt", solicitud, config, { db, auth: auth as never, transport: transport as never, now: now() }), procesarCorreo("event", "request", "receipt", solicitud, config, { db, auth: auth as never, transport: transport as never, now: now() })]);
    const data = (await db.collection("mailDeliveries").doc(deliveryId("event")).get()).data() ?? {};
    expect(sent).toBe(1); expect(data).not.toHaveProperty("recipient"); expect(data).not.toHaveProperty("body"); expect(data.uidHash).not.toBe("uid-1");
  });
  it("aplica límites uid y global para eventos distintos mediante contadores por hora", async () => {
    const limited = { ...config, perUserHour: 1, globalHour: 2 };
    await procesarCorreo("one", "request", "receipt", solicitud, limited, { db, auth: auth as never, transport: sink() as never, now: now() });
    expect((await procesarCorreo("two", "request", "receipt", solicitud, limited, { db, auth: auth as never, transport: sink() as never, now: now() })).status).toBe("skipped");
    const other: Solicitud = { ...solicitud, clienteId: "uid-2", clienteEmail: "other@example.test" };
    const otherAuth = { getUser: async () => ({ emailVerified: true, email: "other@example.test" }) };
    await procesarCorreo("three", "request", "receipt", other, limited, { db, auth: otherAuth as never, transport: sink() as never, now: now() });
    expect((await procesarCorreo("four", "request", "receipt", { ...other, clienteId: "uid-3", clienteEmail: "third@example.test" }, limited, { db, auth: { getUser: async () => ({ emailVerified: true, email: "third@example.test" }) } as never, transport: sink() as never, now: now() })).status).toBe("skipped");
    expect((await procesarCorreo("next-hour", "request", "receipt", solicitud, limited, { db, auth: auth as never, transport: sink() as never, now: now("2026-10-02T11:00:00.000Z") })).status).toBe("sent");
  });
  it("mantiene el tope uid bajo eventos distintos concurrentes", async () => {
    let sent = 0; const transport = { sendMail: async () => { sent++; return {}; } };
    const outcomes = await Promise.all(["a", "b", "c"].map((event) => procesarCorreo(event, "request", "receipt", solicitud, { ...config, perUserHour: 2 }, { db, auth: auth as never, transport: transport as never, now: now() })));
    expect(outcomes.filter((outcome) => outcome.status === "sent")).toHaveLength(2); expect(sent).toBe(2);
  }, 20_000);
  it("falla cerrado sin enviar para disabled, configuración y destinatarios inválidos", async () => {
    let sent = 0; const transport = { sendMail: async () => { sent++; return {}; } };
    expect((await procesarCorreo("disabled", "request", "receipt", solicitud, { ...config, enabled: false }, { db, auth: auth as never, transport: transport as never })).reason).toBe("mail_disabled");
    expect((await procesarCorreo("config", "request", "receipt", solicitud, { ...config, port: 25 }, { db, auth: auth as never, transport: transport as never })).reason).toBe("invalid_smtp_port");
    expect((await procesarCorreo("missing", "request", "receipt", { ...solicitud, clienteId: undefined }, config, { db, auth: auth as never, transport: transport as never })).reason).toBe("unverified_recipient");
    expect((await procesarCorreo("mismatch", "request", "receipt", solicitud, config, { db, auth: { getUser: async () => ({ emailVerified: true, email: "different@example.test" }) } as never, transport: transport as never })).reason).toBe("unverified_recipient");
    expect(sent).toBe(0);
  });
  it("solo usa el email verificado de Auth, admite coincidencia sin mayúsculas y rechaza unverified", async () => {
    const sent: Array<{ to?: string; html?: string }> = [];
    const transport = { sendMail: async (message: { to?: string; html?: string }) => { sent.push(message); return {}; } };
    await procesarCorreo("case", "request", "receipt", { ...solicitud, clienteEmail: "VERIFIED@example.test", email: "formulario-no-usar@example.test" }, config, { db, auth: auth as never, transport: transport as never, now: now() });
    expect(sent).toHaveLength(1); expect(sent[0]?.to).toBe("verified@example.test"); expect(sent[0]?.html).not.toContain("formulario-no-usar");
    expect((await procesarCorreo("unverified", "request", "receipt", solicitud, config, { db, auth: { getUser: async () => ({ emailVerified: false, email: "verified@example.test" }) } as never, transport: transport as never })).reason).toBe("unverified_recipient");
  });
  it("reintenta error transitorio, corta en maxAttempts y conserva lease activa", async () => {
    const transient = { sendMail: async () => { throw { code: "ETIMEDOUT" }; } };
    await expect(procesarCorreo("retry", "request", "receipt", solicitud, { ...config, maxAttempts: 2 }, { db, auth: auth as never, transport: transient as never, now: now() })).rejects.toBeInstanceOf(RetryableMailError);
    await expect(procesarCorreo("retry", "request", "receipt", solicitud, { ...config, maxAttempts: 2 }, { db, auth: auth as never, transport: transient as never, now: now("2026-10-02T10:06:00.000Z") })).resolves.toMatchObject({ status: "suppressed", reason: "smtp_transient" });
    const id = deliveryId("lease");
    await db.collection("mailDeliveries").doc(id).set({ state: "sending", attempts: 1, leaseUntil: new Date(Date.now() + 60_000) });
    await expect(procesarCorreo("lease", "request", "receipt", solicitud, config, { db, auth: auth as never, transport: sink() as never })).rejects.toBeInstanceOf(RetryableMailError);
  });
  it("recupera una lease expirada", async () => {
    const id = deliveryId("expired");
    await db.collection("mailDeliveries").doc(id).set({ state: "sending", attempts: 1, leaseUntil: new Date("2026-10-02T09:00:00.000Z") });
    await expect(procesarCorreo("expired", "request", "receipt", solicitud, config, { db, auth: auth as never, transport: sink() as never, now: now() })).resolves.toMatchObject({ status: "sent" });
  });
  it("suprime SMTP 5xx y omite enlaces cuando APP_BASE_URL no es HTTPS", async () => {
    let message: { html?: string } | undefined;
    const permanent = { sendMail: async (input: { html?: string }) => { message = input; throw { responseCode: 535 }; } };
    await expect(procesarCorreo("permanent", "request", "receipt", solicitud, { ...config, appBaseUrl: "http://not-secure.test" }, { db, auth: auth as never, transport: permanent as never, now: now() })).resolves.toMatchObject({ status: "suppressed", reason: "smtp_permanent" });
    expect(message?.html).not.toContain("href=");
  });
});
