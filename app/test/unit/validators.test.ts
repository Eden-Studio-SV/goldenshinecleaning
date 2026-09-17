import { describe, it, expect, expectTypeOf } from "vitest";
import {
  solicitudSchema,
  reprogramarSchema,
  hoyISO,
  diaSemanaISO,
  esDomingoISO,
  esFechaISOValida,
  esHorarioValido,
  TIPOS_SERVICIO_VALIDOS,
  FRECUENCIAS_VALIDAS,
} from "@/lib/validators";

describe("hoyISO", () => {
  it("devuelve YYYY-MM-DD de hoy en zona local", () => {
    const hoy = hoyISO();
    expect(/^\d{4}-\d{2}-\d{2}$/.test(hoy)).toBe(true);
    const [y, m, d] = hoy.split("-").map(Number);
    const ahora = new Date();
    expect(y).toBe(ahora.getFullYear());
    // mes/día pueden coincidir (salvo cambio justo de medianoche)
    expect(m).toBeGreaterThanOrEqual(1);
    expect(m).toBeLessThanOrEqual(12);
    expect(d).toBeGreaterThanOrEqual(1);
    expect(d).toBeLessThanOrEqual(31);
  });
  it("usa America/New_York aunque el navegador esté en otro huso", () => {
    // Aún es 15 de septiembre en Boston, aunque UTC ya sea día 16.
    expect(hoyISO(new Date("2026-09-16T03:30:00.000Z"))).toBe("2026-09-15");
  });
});

describe("diaSemanaISO / esDomingoISO", () => {
  it("2026-09-20 es domingo", () => {
    expect(diaSemanaISO("2026-09-20")).toBe(0);
    expect(esDomingoISO("2026-09-20")).toBe(true);
  });
  it("2026-09-16 es miércoles (3)", () => {
    expect(diaSemanaISO("2026-09-16")).toBe(3);
    expect(esDomingoISO("2026-09-16")).toBe(false);
  });
  it("rechaza fechas de calendario normalizadas por Date", () => {
    expect(esFechaISOValida("2026-02-29")).toBe(false);
    expect(esFechaISOValida("2028-02-29")).toBe(true);
    expect(esFechaISOValida("2026-02-30")).toBe(false);
  });
});

describe("esHorarioValido", () => {
  it("acepta 08:00 y 19:00 inclusive", () => {
    expect(esHorarioValido("08:00")).toBe(true);
    expect(esHorarioValido("19:00")).toBe(true);
    expect(esHorarioValido("13:30")).toBe(true);
  });
  it("rechaza fuera de rango", () => {
    expect(esHorarioValido("07:59")).toBe(false);
    expect(esHorarioValido("19:01")).toBe(false);
    expect(esHorarioValido("23:00")).toBe(false);
    expect(esHorarioValido("00:00")).toBe(false);
  });
  it("rechaza formatos inválidos", () => {
    expect(esHorarioValido("8:00")).toBe(false);
    expect(esHorarioValido("08:60")).toBe(false);
    expect(esHorarioValido("24:00")).toBe(false);
    expect(esHorarioValido("")).toBe(false);
    expect(esHorarioValido("08:0")).toBe(false);
  });
});

describe("solicitudSchema", () => {
  const base = {
    nombre: "María López",
    telefono: "+1 617 555 1234",
    email: "maria@correo.com",
    tipoServicio: "residencial" as const,
    frecuencia: "unica" as const,
    direccion: "123 Beacon St, Boston, MA",
    ubicacion: null,
    fechaDeseada: "2099-09-18", // viernes futuro
    horaDeseada: "10:00",
    notas: "",
  };

  it("acepta un payload válido", () => {
    const r = solicitudSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("acepta los nuevos tipos de servicio", () => {
    for (const t of ["post_construccion", "mudanza", "airbnb"] as const) {
      const r = solicitudSchema.safeParse({ ...base, tipoServicio: t });
      expect(r.success).toBe(true);
    }
  });

  it("rechaza email vacío (obligatorio)", () => {
    const r = solicitudSchema.safeParse({ ...base, email: "" });
    expect(r.success).toBe(false);
  });

  it("rechaza email inválido", () => {
    const r = solicitudSchema.safeParse({ ...base, email: "no-arroba" });
    expect(r.success).toBe(false);
  });

  it("rechaza dirección demasiado corta", () => {
    const r = solicitudSchema.safeParse({ ...base, direccion: "abc" });
    expect(r.success).toBe(false);
  });

  it("rechaza fecha pasada", () => {
    const r = solicitudSchema.safeParse({ ...base, fechaDeseada: "2000-01-01" });
    expect(r.success).toBe(false);
  });

  it("rechaza domingo", () => {
    // 2099-09-20 es domingo
    const r = solicitudSchema.safeParse({ ...base, fechaDeseada: "2099-09-20" });
    expect(r.success).toBe(false);
  });

  it("rechaza hora fuera de 08-19", () => {
    const r = solicitudSchema.safeParse({ ...base, horaDeseada: "20:00" });
    expect(r.success).toBe(false);
  });

  it("rechaza formato de hora no HH:mm", () => {
    const r = solicitudSchema.safeParse({ ...base, horaDeseada: "8:00" });
    expect(r.success).toBe(false);
  });

  it("rechaza tipo de servicio desconocido", () => {
    const r = solicitudSchema.safeParse({ ...base, tipoServicio: "industrial" });
    expect(r.success).toBe(false);
  });

  it("rechaza frecuencia desconocida", () => {
    const r = solicitudSchema.safeParse({ ...base, frecuencia: "anual" });
    expect(r.success).toBe(false);
  });

  it("recorta y valida nombre mínimo 2", () => {
    const r = solicitudSchema.safeParse({ ...base, nombre: "  a  " });
    expect(r.success).toBe(false);
  });

  it("rechaza teléfono con menos de 8 dígitos", () => {
    const r = solicitudSchema.safeParse({ ...base, telefono: "123-456" });
    expect(r.success).toBe(false);
  });

  it("limita notas a 500 caracteres", () => {
    const r = solicitudSchema.safeParse({ ...base, notas: "x".repeat(501) });
    expect(r.success).toBe(false);
  });
});

describe("reprogramarSchema", () => {
  const base = { fecha: "2099-09-18", hora: "09:30", motivo: "" };

  it("acepta propuesta válida", () => {
    expect(reprogramarSchema.safeParse(base).success).toBe(true);
  });
  it("rechaza domingo", () => {
    expect(reprogramarSchema.safeParse({ ...base, fecha: "2099-09-20" }).success).toBe(false);
  });
  it("rechaza hora fuera de rango", () => {
    expect(reprogramarSchema.safeParse({ ...base, hora: "07:00" }).success).toBe(false);
  });
  it("rechaza fecha pasada", () => {
    expect(reprogramarSchema.safeParse({ ...base, fecha: "2000-01-01" }).success).toBe(false);
  });
  it("limita motivo a 300", () => {
    expect(reprogramarSchema.safeParse({ ...base, motivo: "x".repeat(301) }).success).toBe(false);
  });
});

describe("catálogos validados", () => {
  it("incluye los servicios nuevos", () => {
    expect(TIPOS_SERVICIO_VALIDOS).toContain("post_construccion");
    expect(TIPOS_SERVICIO_VALIDOS).toContain("mudanza");
    expect(TIPOS_SERVICIO_VALIDOS).toContain("airbnb");
  });
  it("frecuencias no incluyen 'recurrente' (es frecuencia, no servicio)", () => {
    expect(FRECUENCIAS_VALIDAS).not.toContain("recurrente");
    expectTypeOf(FRECUENCIAS_VALIDAS).toEqualTypeOf<
      readonly ["unica", "semanal", "quincenal", "mensual"]
    >();
  });
});
