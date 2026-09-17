import { describe, expect, it } from "vitest";
import { configValida, correoValido, crearTransport, esTransitorio } from "../../src/mail.js";
import { plantilla } from "../../src/templates.js";
import type { MailConfig } from "../../src/config.js";

const config: MailConfig = { enabled: true, host: "smtp.example.test", port: 587, username: "user@example.test", password: "secret", from: "goldenshinecleaning@edenstudio.dev", appBaseUrl: "", maxAttempts: 4, perUserHour: 10, globalHour: 100 };
describe("correo seguro", () => {
  it("rechaza direcciones y cabeceras CRLF", () => {
    expect(correoValido("person@example.test\r\nBcc:x@example.test")).toBe(false);
    expect(configValida({ ...config, port: 25 })).toBe("invalid_smtp_port");
    expect(configValida({ ...config, from: "other@example.test" })).toBe("invalid_from");
  });
  it("configura TLS según el puerto", () => {
    const transport = crearTransport(config) as unknown as { options: { secure: boolean; requireTLS: boolean; auth: { user: string } } };
    expect(transport.options).toMatchObject({ secure: false, requireTLS: true, auth: { user: "user@example.test" } });
    expect((crearTransport({ ...config, port: 465 }) as unknown as { options: { secure: boolean } }).options.secure).toBe(true);
  });
  it("distingue errores reintentables sin exponer datos", () => {
    expect(esTransitorio({ responseCode: 421 })).toBe(true); expect(esTransitorio({ responseCode: 401 })).toBe(true); expect(esTransitorio({ responseCode: 535 })).toBe(false); expect(esTransitorio({ responseCode: 500 })).toBe(false); expect(esTransitorio({ code: "ETIMEDOUT" })).toBe(true);
  });
  it("escapa HTML, limpia saltos de línea y aplica locale legado en inglés", () => {
    const mail = plantilla("receipt", { nombre: "<Ana>\r\nBcc", tipoServicio: "<script>", fechaDeseada: "2026-10-02", horaDeseada: "10:00" });
    expect(mail.subject).toContain("received"); expect(mail.html).toContain("&lt;Ana&gt;"); expect(mail.html).not.toContain("<script>"); expect(mail.text).not.toContain("\r");
    expect(plantilla("receipt", { locale: "es" }).subject).toContain("Recibimos");
  });
  it("no inyecta host ni enlace desde una base no HTTPS", () => {
    expect(plantilla("confirmation", { locale: "en", nombre: "Ana" }, undefined).html).not.toContain("href=");
    expect(configValida({ ...config, host: "smtp.example.test\r\nX: bad" })).toBe("invalid_smtp_config");
    expect(configValida({ ...config, username: "bad\r\n@example.test" })).toBe("invalid_smtp_config");
  });
});
