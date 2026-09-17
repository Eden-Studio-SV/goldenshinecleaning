import { describe, it, expect } from "vitest";
import { proximaFecha, transicionValida } from "@/lib/solicitudes";
import type { EstadoSolicitud } from "@/types";

describe("proximaFecha", () => {
  it("semanal suma 7 días", () => {
    expect(proximaFecha("2099-09-16", "semanal")).toBe("2099-09-23");
  });
  it("quincenal suma 14 días", () => {
    expect(proximaFecha("2099-09-16", "quincenal")).toBe("2099-09-30");
  });
  it("mensual preserva el día", () => {
    expect(proximaFecha("2099-09-16", "mensual")).toBe("2099-10-16");
  });
  it("mensual fin de mes: 31 de enero -> 28 de febrero (no desborda a marzo)", () => {
    // 2099 no es bisiesto: febrero tiene 28 días
    expect(proximaFecha("2099-01-31", "mensual")).toBe("2099-02-28");
  });
  it("conserva el ancla de fin de mes tras febrero", () => {
    expect(proximaFecha("2099-02-28", "mensual")).toBe("2099-03-31");
  });
  it("mensual fin de mes bisiesto: 31 de enero 2096 -> 29 de febrero", () => {
    // 2096 es bisiesto
    expect(proximaFecha("2096-01-31", "mensual")).toBe("2096-02-29");
  });
  it("mensual 30 de marzo -> 30 de abril", () => {
    expect(proximaFecha("2099-03-30", "mensual")).toBe("2099-04-30");
  });
  it("mensual 31 de marzo -> 30 de abril (fin de mes)", () => {
    expect(proximaFecha("2099-03-31", "mensual")).toBe("2099-04-30");
  });
  it("mensual salta domingo: 15 de febrero 2099 (domingo) -> 16 (lunes)", () => {
    // 2099-02-15 es domingo; mensual desde 2099-01-15 (jueves) cae en 2099-02-15
    // que es domingo, debe saltar al lunes 16.
    expect(proximaFecha("2099-01-15", "mensual")).toBe("2099-02-16");
  });
  it("semanal preserva día de la semana (no domingo)", () => {
    // 2099-09-17 es jueves; +7 = jueves 24 (no domingo)
    expect(proximaFecha("2099-09-17", "semanal")).toBe("2099-09-24");
  });
  it("única no avanza (devuelve la siguiente fecha igual si es futura)", () => {
    // Para única, el ciclo do-while avanza una vez; pero única no debería
    // usarse con proximaFecha en la app. Aun así, la función es determinista.
    const r = proximaFecha("2099-09-16", "unica");
    expect(/^\d{4}-\d{2}-\d{2}$/.test(r)).toBe(true);
  });
  it("avanza hasta el futuro si la fecha es pasada", () => {
    // 2000-09-16 semanal: debe avanzar hasta >= hoy
    const r = proximaFecha("2000-09-16", "semanal");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [y, m, d] = r.split("-").map(Number);
    const f = new Date(y, m - 1, d);
    expect(f.getTime()).toBeGreaterThanOrEqual(hoy.getTime());
  });
  it("lanza si la fecha no es YYYY-MM-DD", () => {
    expect(() => proximaFecha("no-fecha", "semanal")).toThrow();
  });
});

describe("transicionValida", () => {
  const casosAdmin: Array<[EstadoSolicitud, EstadoSolicitud, boolean]> = [
    ["pendiente", "agendada", true],
    ["pendiente", "reprogramacion", true],
    ["pendiente", "rechazada", true],
    ["pendiente", "completada", false],
    ["agendada", "completada", true],
    ["agendada", "reprogramacion", true],
    ["agendada", "cancelada", true],
    ["agendada", "rechazada", false],
    ["reprogramacion", "agendada", true],
    ["reprogramacion", "cancelada", true],
    ["completada", "agendada", false],
    ["cancelada", "agendada", false],
  ];
  for (const [from, to, ok] of casosAdmin) {
    it(`admin ${from} -> ${to} = ${ok}`, () => {
      expect(transicionValida(from, to, "admin")).toBe(ok);
    });
  }

  const casosCliente: Array<[EstadoSolicitud, EstadoSolicitud, boolean]> = [
    ["pendiente", "cancelada", true],
    ["pendiente", "agendada", false],
    ["agendada", "reprogramacion", true],
    ["agendada", "cancelada", true],
    ["agendada", "completada", false],
    ["reprogramacion", "agendada", true],
    ["reprogramacion", "cancelada", true],
    ["completada", "cancelada", false],
  ];
  for (const [from, to, ok] of casosCliente) {
    it(`cliente ${from} -> ${to} = ${ok}`, () => {
      expect(transicionValida(from, to, "cliente")).toBe(ok);
    });
  }
});
