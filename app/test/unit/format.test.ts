import { describe, it, expect } from "vitest";
import { formatFecha, formatTimestamp } from "@/lib/format";

describe("formatFecha", () => {
  it("devuelve — para vacío", () => {
    expect(formatFecha("")).toBe("—");
  });
  it("formatea en español por defecto", () => {
    const out = formatFecha("2026-09-16");
    expect(out).toMatch(/2026/);
    expect(out).not.toBe("—");
  });
  it("acepta locale opcional sin romper", () => {
    const es = formatFecha("2026-09-16");
    const en = formatFecha("2026-09-16", undefined, "en-US");
    expect(es).toBeTruthy();
    expect(en).toBeTruthy();
    // Ambos devuelven algo distinto de —
    expect(es).not.toBe("—");
    expect(en).not.toBe("—");
  });
  it("acepta opciones + locale", () => {
    const out = formatFecha(
      "2026-09-16",
      { weekday: "long", day: "numeric", month: "long", year: "numeric" },
      "es",
    );
    expect(out.length).toBeGreaterThan(0);
  });
  it("cae al valor crudo si la fecha es inválida", () => {
    // new Date('NaN-NaN') lanza o devuelve Invalid; el catch retorna iso
    expect(formatFecha("no-es-fecha")).toBe("no-es-fecha");
  });
});

describe("formatTimestamp", () => {
  it("devuelve — para null/undefined", () => {
    expect(formatTimestamp(null)).toBe("—");
    expect(formatTimestamp(undefined)).toBe("—");
  });
  it("formatea un Timestamp con toDate", () => {
    const ts = {
      toDate: () => new Date("2026-09-16T10:30:00Z"),
    } as unknown as Parameters<typeof formatTimestamp>[0];
    const out = formatTimestamp(ts);
    expect(out).not.toBe("—");
    expect(out).toMatch(/2026/);
  });
  it("acepta locale opcional", () => {
    const ts = {
      toDate: () => new Date("2026-09-16T10:30:00Z"),
    } as unknown as Parameters<typeof formatTimestamp>[0];
    const en = formatTimestamp(ts, "en-US");
    expect(en).not.toBe("—");
  });
});