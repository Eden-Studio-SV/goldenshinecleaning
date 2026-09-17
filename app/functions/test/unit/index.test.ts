import { beforeEach, describe, expect, it, vi } from "vitest";

const handler = vi.fn();
const process = vi.fn();
const info = vi.fn(); const warn = vi.fn(); const error = vi.fn();

vi.mock("firebase-functions", () => ({ logger: { info, warn, error } }));
vi.mock("firebase-functions/v2/firestore", () => ({ onDocumentWritten: vi.fn((options, callback) => { handler(options, callback); return { options, callback }; }) }));
vi.mock("../../src/config.js", () => ({ configActual: () => ({ enabled: false }), SMTP_EMAIL: {}, SMTP_PASSWORD: {} }));
vi.mock("../../src/processor.js", () => ({ RetryableMailError: class RetryableMailError extends Error {}, procesarCorreo: process }));

const module = await import("../../src/index.js");
const event = (before: object | undefined, after: object | undefined) => ({ id: "event-id", params: { solicitudId: "request-id" }, data: { before: { exists: Boolean(before), data: () => before }, after: { exists: Boolean(after), data: () => after } } });

describe("binding onDocumentWritten", () => {
  beforeEach(() => { process.mockClear(); info.mockClear(); warn.mockClear(); error.mockClear(); process.mockResolvedValue({ status: "sent" }); });
  it("registra trigger Gen2 con retry y despacha event.id clasificado", async () => {
    expect(module.enviarCorreoSolicitud).toBeTruthy();
    const [options, callback] = handler.mock.calls[0] as [{ document: string; retry: boolean }, (value: ReturnType<typeof event>) => Promise<void>];
    expect(options).toMatchObject({ document: "solicitudes/{solicitudId}", retry: true });
    await callback(event(undefined, { estado: "pendiente" }));
    expect(process).toHaveBeenCalledWith("event-id", "request-id", "receipt", { estado: "pendiente" }, { enabled: false });
  });
  it("no despacha cambios sin transición y registra supresión sin PII", async () => {
    const callback = handler.mock.calls[0][1] as (value: ReturnType<typeof event>) => Promise<void>;
    await callback(event({ estado: "pendiente" }, { estado: "pendiente", notas: "x" }));
    expect(process).not.toHaveBeenCalled();
    process.mockResolvedValueOnce({ status: "suppressed", reason: "invalid_smtp_config" });
    await callback(event(undefined, { estado: "pendiente" }));
    expect(warn).toHaveBeenCalledWith("mail_event_suppressed", { type: "receipt", status: "suppressed", code: "invalid_smtp_config" });
  });
});
