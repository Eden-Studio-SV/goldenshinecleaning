import { describe, expect, it } from "vitest";
import { clasificarEvento } from "../../src/events.js";
import type { Solicitud } from "../../src/domain.js";

const base = (estado: string): Solicitud => ({ estado, clienteId: "uid", clienteEmail: "person@example.com", nombre: "Ana", tipoServicio: "residencial", fechaDeseada: "2026-10-02", horaDeseada: "10:00" });
describe("clasificarEvento", () => {
  it("clasifica las creaciones permitidas", () => {
    expect(clasificarEvento(undefined, base("pendiente"))).toBe("receipt");
    expect(clasificarEvento(undefined, { ...base("agendada"), serieId: "serie" })).toBe("next_visit_scheduled");
    expect(clasificarEvento(undefined, base("agendada"))).toBeNull();
  });
  it("clasifica cada transición de negocio", () => {
    expect(clasificarEvento(base("pendiente"), base("agendada"))).toBe("confirmation");
    expect(clasificarEvento(base("pendiente"), base("rechazada"))).toBe("rejection");
    expect(clasificarEvento(base("agendada"), base("cancelada"))).toBe("cancellation");
    expect(clasificarEvento(base("agendada"), { ...base("reprogramacion"), propuesta: { fecha: "2026-10-03", hora: "11:00", por: "admin" } })).toBe("reschedule_proposed");
    expect(clasificarEvento(base("agendada"), { ...base("reprogramacion"), propuesta: { fecha: "2026-10-03", hora: "11:00", por: "cliente" } })).toBe("reschedule_requested");
    const before = { ...base("reprogramacion"), propuesta: { fecha: "2026-10-03", hora: "11:00", por: "admin" } };
    expect(clasificarEvento(before, { ...base("agendada"), fechaDeseada: "2026-10-03", horaDeseada: "11:00" })).toBe("reschedule_accepted");
    expect(clasificarEvento(before, base("agendada"))).toBe("reschedule_rejected");
    expect(clasificarEvento({ ...before, fechaDeseada: "2026-10-03", horaDeseada: "11:00" }, { ...base("agendada"), fechaDeseada: "2026-10-03", horaDeseada: "11:00" })).toBe("schedule_resolved");
    expect(clasificarEvento(base("agendada"), base("completada"))).toBe("completion");
  });
  it("ignora cambios no semánticos", () => expect(clasificarEvento(base("pendiente"), { ...base("pendiente"), notas: "actualizada" })).toBeNull());
  it("cubre cancelación activa, ambigüedad y transiciones no permitidas", () => {
    expect(clasificarEvento(base("reprogramacion"), base("cancelada"))).toBe("cancellation");
    expect(clasificarEvento(base("rechazada"), base("agendada"))).toBeNull();
    expect(clasificarEvento({ ...base("reprogramacion"), propuesta: { fecha: "2026-10-03", hora: "11:00", por: "admin" } }, { ...base("agendada"), fechaDeseada: "2026-10-04", horaDeseada: "12:00" })).toBe("schedule_resolved");
  });
});
