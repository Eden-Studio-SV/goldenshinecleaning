import { describe, it, expect } from "vitest";
import {
  ACCION_META,
  accionesDisponibles,
  mensajeEstado,
  estadoAlRechazarPropuesta,
  esPropuestaContraria,
  tablaAcciones,
  type AccionId,
} from "@/lib/lifecycle";
import type { EstadoSolicitud, Solicitud } from "@/types";

function mk(partial: Partial<Solicitud>): Pick<Solicitud, "estado" | "propuesta" | "estadoPrevio"> {
  return {
    estado: partial.estado ?? "pendiente",
    propuesta: partial.propuesta ?? null,
    estadoPrevio: partial.estadoPrevio ?? null,
  };
}

describe("ACCION_META", () => {
  it("todas las acciones tienen meta", () => {
    const ids: AccionId[] = [
      "confirmar",
      "proponer",
      "rechazar",
      "completar",
      "cancelar",
      "pedirReprogramar",
      "aceptarPropuesta",
      "rechazarPropuesta",
    ];
    for (const id of ids) {
      expect(ACCION_META[id]).toBeDefined();
      expect(ACCION_META[id].label.length).toBeGreaterThan(0);
    }
  });
});

describe("accionesDisponibles — admin", () => {
  it("pendiente: confirmar, proponer, rechazar", () => {
    expect(accionesDisponibles(mk({ estado: "pendiente" }), "admin")).toEqual([
      "confirmar",
      "proponer",
      "rechazar",
    ]);
  });
  it("agendada: completar, proponer, cancelar", () => {
    expect(accionesDisponibles(mk({ estado: "agendada" }), "admin")).toEqual([
      "completar",
      "proponer",
      "cancelar",
    ]);
  });
  it("reprogramacion propuesta por cliente: admin responde", () => {
    const a = accionesDisponibles(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "cliente" } }),
      "admin",
    );
    expect(a).toContain("aceptarPropuesta");
    expect(a).toContain("rechazarPropuesta");
  });
  it("reprogramacion propuesta por admin: admin no responde a la suya", () => {
    const a = accionesDisponibles(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } }),
      "admin",
    );
    expect(a).not.toContain("aceptarPropuesta");
    expect(a).not.toContain("rechazarPropuesta");
  });
  it("estados cerrados: sin acciones", () => {
    for (const e of ["completada", "rechazada", "cancelada"] as EstadoSolicitud[]) {
      expect(accionesDisponibles(mk({ estado: e }), "admin")).toEqual([]);
    }
  });
});

describe("accionesDisponibles — cliente", () => {
  it("pendiente: solo cancelar", () => {
    expect(accionesDisponibles(mk({ estado: "pendiente" }), "cliente")).toEqual(["cancelar"]);
  });
  it("agendada: pedir reprogramar o cancelar", () => {
    expect(accionesDisponibles(mk({ estado: "agendada" }), "cliente")).toEqual([
      "pedirReprogramar",
      "cancelar",
    ]);
  });
  it("reprogramacion propuesta por admin: cliente responde", () => {
    const a = accionesDisponibles(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } }),
      "cliente",
    );
    expect(a).toContain("aceptarPropuesta");
    expect(a).toContain("rechazarPropuesta");
  });
  it("reprogramacion propuesta por cliente: cliente no responde a la suya", () => {
    const a = accionesDisponibles(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "cliente" } }),
      "cliente",
    );
    expect(a).not.toContain("aceptarPropuesta");
    expect(a).not.toContain("rechazarPropuesta");
  });
  it("estados cerrados: sin acciones", () => {
    for (const e of ["completada", "rechazada", "cancelada"] as EstadoSolicitud[]) {
      expect(accionesDisponibles(mk({ estado: e }), "cliente")).toEqual([]);
    }
  });
});

describe("mensajeEstado", () => {
  it("null si no está en reprogramacion", () => {
    expect(mensajeEstado(mk({ estado: "agendada" }), "admin")).toBeNull();
  });
  it("null si no hay propuesta", () => {
    expect(mensajeEstado(mk({ estado: "reprogramacion", propuesta: null }), "admin")).toBeNull();
  });
  it("mensaje 'esperando' si la propuesta es mía", () => {
    const m = mensajeEstado(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } }),
      "admin",
    );
    expect(m).toMatch(/Esperando/);
  });
  it("mensaje de propuesta del admin para el cliente", () => {
    const m = mensajeEstado(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } }),
      "cliente",
    );
    expect(m).toMatch(/Golden Shine propone/);
  });
  it("mensaje de propuesta del cliente para el admin", () => {
    const m = mensajeEstado(
      mk({ estado: "reprogramacion", propuesta: { fecha: "2099-09-18", hora: "10:00", por: "cliente" } }),
      "admin",
    );
    expect(m).toMatch(/cliente solicita/);
  });
});

describe("estadoAlRechazarPropuesta", () => {
  it("usa estadoPrevio si existe", () => {
    expect(estadoAlRechazarPropuesta({ estadoPrevio: "agendada" })).toBe("agendada");
    expect(estadoAlRechazarPropuesta({ estadoPrevio: "pendiente" })).toBe("pendiente");
  });
  it("cae a agendada si no hay estadoPrevio", () => {
    expect(estadoAlRechazarPropuesta({ estadoPrevio: null })).toBe("agendada");
  });
});

describe("esPropuestaContraria", () => {
  it("true si la propuesta la hizo el otro rol", () => {
    expect(
      esPropuestaContraria(
        { propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } },
        "cliente",
      ),
    ).toBe(true);
  });
  it("false si la propuesta la hizo el mismo rol", () => {
    expect(
      esPropuestaContraria(
        { propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } },
        "admin",
      ),
    ).toBe(false);
  });
  it("false si no hay propuesta", () => {
    expect(esPropuestaContraria({ propuesta: null }, "cliente")).toBe(false);
  });
});

describe("tablaAcciones", () => {
  it("cubre todos los estados para ambos roles", () => {
    const t = tablaAcciones([
      "pendiente",
      "agendada",
      "reprogramacion",
      "completada",
      "rechazada",
      "cancelada",
    ]);
    expect(t.admin.pendiente).toEqual(["confirmar", "proponer", "rechazar"]);
    expect(t.cliente.pendiente).toEqual(["cancelar"]);
    expect(t.admin.completada).toEqual([]);
    expect(t.cliente.cancelada).toEqual([]);
  });
});