import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---- Mock aislado de Firestore para solicitudes.ts ----------------------------
// vi.hoisted garantiza que los mocks existan antes del hoisting de vi.mock.
const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  runTransaction: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
  db: { _db: true },
}));

vi.mock("firebase/firestore", () => ({
  addDoc: (...a: unknown[]) => mocks.addDoc(...a),
  collection: (...a: unknown[]) => mocks.collection(...a),
  doc: (...a: unknown[]) => mocks.doc(...a),
  getDoc: (...a: unknown[]) => mocks.getDoc(...a),
  onSnapshot: (...a: unknown[]) => mocks.onSnapshot(...a),
  query: (...a: unknown[]) => mocks.query(...a),
  orderBy: (...a: unknown[]) => mocks.orderBy(...a),
  where: (...a: unknown[]) => mocks.where(...a),
  runTransaction: (...a: unknown[]) => mocks.runTransaction(...a),
  serverTimestamp: () => mocks.serverTimestamp(),
}));

vi.mock("@/firebase", () => ({
  app: null,
  db: mocks.db,
  auth: null,
  isFirebaseConfigured: true,
  useEmulators: false,
}));

import {
  crearSolicitud,
  obtenerSolicitud,
  observarSolicitudes,
  observarSolicitudesCliente,
  confirmarSolicitud,
  rechazarSolicitud,
  cancelarSolicitud,
  proponerCambio,
  aceptarPropuesta,
  rechazarPropuesta,
  completarSolicitud,
} from "@/lib/solicitudes";
import type { Solicitud } from "@/types";

const {
  addDoc: addDocMock,
  collection: collectionMock,
  doc: docMock,
  getDoc: getDocMock,
  onSnapshot: onSnapshotMock,
  query: queryMock,
  orderBy: orderByMock,
  where: whereMock,
  runTransaction: runTransactionMock,
} = mocks;

const solicitudBase: Solicitud = {
  id: "s1",
  clienteId: "uid1",
  clienteEmail: "a@b.com",
  nombre: "Ana",
  telefono: "5551234567",
  email: "a@b.com",
  tipoServicio: "residencial",
  direccion: "123 Beacon St",
  ubicacion: null,
  fechaDeseada: "2099-09-18",
  horaDeseada: "10:00",
  frecuencia: "unica",
  locale: "en",
  serieId: null,
  estado: "pendiente",
  estadoPrevio: null,
  propuesta: null,
  motivo: null,
  creadoEn: null,
  actualizadoEn: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  collectionMock.mockReturnValue({ _coll: true });
  docMock.mockReturnValue({ _doc: true });
  queryMock.mockReturnValue({ _q: true });
  orderByMock.mockReturnValue({ _ob: true });
  whereMock.mockReturnValue({ _w: true });
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("crearSolicitud", () => {
  it("crea con locale inglés por defecto, estado pendiente y email obligatorio", async () => {
    addDocMock.mockResolvedValue({ id: "new1" });
    const id = await crearSolicitud(
      {
        nombre: "Ana",
        telefono: "5551234567",
        email: "a@b.com",
        tipoServicio: "residencial",
        frecuencia: "unica",
        direccion: "123 Beacon St",
        ubicacion: null,
        fechaDeseada: "2099-09-18",
        horaDeseada: "10:00",
        notas: undefined,
      },
      { uid: "uid1", email: "a@b.com" },
    );
    expect(id).toBe("new1");
    const payload = addDocMock.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("pendiente");
    expect(payload.email).toBe("a@b.com");
    expect(payload.clienteId).toBe("uid1");
    expect(payload.locale).toBe("en");
    expect(payload.creadoEn).toBeDefined();
  });

  it("conserva locale español y normaliza un locale inválido a inglés", async () => {
    addDocMock.mockResolvedValue({ id: "new-locale" });
    const datos = {
      nombre: "Ana",
      telefono: "5551234567",
      email: "a@b.com",
      tipoServicio: "residencial" as const,
      frecuencia: "unica" as const,
      direccion: "123 Beacon St",
      fechaDeseada: "2099-09-18",
      horaDeseada: "10:00",
    };

    await crearSolicitud({ ...datos, locale: "es" }, { uid: "uid1", email: "a@b.com" });
    await crearSolicitud(
      { ...datos, locale: "fr" as never },
      { uid: "uid1", email: "a@b.com" },
    );

    expect(addDocMock.mock.calls[0][1]).toMatchObject({ locale: "es" });
    expect(addDocMock.mock.calls[1][1]).toMatchObject({ locale: "en" });
  });

  it("incluye ubicacion y notas cuando se proveen", async () => {
    addDocMock.mockResolvedValue({ id: "new2" });
    await crearSolicitud(
      {
        nombre: "Ana",
        telefono: "5551234567",
        email: "a@b.com",
        tipoServicio: "airbnb",
        frecuencia: "mensual",
        direccion: "123 Beacon St",
        ubicacion: { lat: 1, lng: 2 },
        fechaDeseada: "2099-09-18",
        horaDeseada: "10:00",
        notas: "dejar llave en conserjería",
      },
      { uid: "uid1", email: "a@b.com" },
    );
    const payload = addDocMock.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.ubicacion).toEqual({ lat: 1, lng: 2 });
    expect(payload.notas).toBe("dejar llave en conserjería");
  });
});

describe("obtenerSolicitud", () => {
  it("devuelve null si no existe", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => undefined });
    const r = await obtenerSolicitud("x");
    expect(r).toBeNull();
  });
  it("mapea documentos históricos sin locale a inglés", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      id: "s1",
      data: () => ({
        clienteId: "uid1",
        clienteEmail: "a@b.com",
        nombre: "Ana",
        telefono: "555",
        tipoServicio: "residencial",
        direccion: "dir",
        fechaDeseada: "2099-09-18",
        horaDeseada: "10:00",
        frecuencia: "unica",
        estado: "pendiente",
      }),
    });
    const r = await obtenerSolicitud("s1");
    expect(r?.id).toBe("s1");
    expect(r?.estado).toBe("pendiente");
    expect(r?.locale).toBe("en");
  });

  it("mapea locale español", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      id: "s-es",
      data: () => ({ ...solicitudBase, locale: "es" }),
    });
    const r = await obtenerSolicitud("s-es");
    expect(r?.locale).toBe("es");
  });
});

describe("observarSolicitudes", () => {
  it("suscribe con query de estado o todas", () => {
    onSnapshotMock.mockReturnValue(() => undefined);
    const unsub = observarSolicitudes("todas", () => undefined);
    expect(typeof unsub).toBe("function");
    expect(queryMock).toHaveBeenCalled();
    expect(orderByMock).toHaveBeenCalledWith("creadoEn", "desc");
  });
  it("filtra por estado cuando se indica", () => {
    onSnapshotMock.mockReturnValue(() => undefined);
    observarSolicitudes("agendada", () => undefined);
    expect(whereMock).toHaveBeenCalledWith("estado", "==", "agendada");
  });
});

describe("observarSolicitudesCliente", () => {
  it("filtra por clienteId", () => {
    onSnapshotMock.mockReturnValue(() => undefined);
    observarSolicitudesCliente("uid1", () => undefined);
    expect(whereMock).toHaveBeenCalledWith("clienteId", "==", "uid1");
  });
});

describe("transacciones — confirmarSolicitud", () => {
  it("confirma si el estado actual es pendiente", async () => {
    const updateSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({ estado: "pendiente" }),
        }),
        update: updateSpy,
      };
      return fn(tx);
    });
    await confirmarSolicitud("s1");
    expect(updateSpy).toHaveBeenCalledTimes(1);
    const payload = updateSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("agendada");
  });

  it("lanza si el estado actual no permite confirmar", async () => {
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({ estado: "completada" }),
        }),
        update: vi.fn(),
      };
      return fn(tx);
    });
    await expect(confirmarSolicitud("s1")).rejects.toThrow();
  });

  it("lanza si el doc no existe", async () => {
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = { get: async () => ({ exists: () => false }), update: vi.fn() };
      return fn(tx);
    });
    await expect(confirmarSolicitud("s1")).rejects.toThrow(/no existe/);
  });
});

describe("rechazarSolicitud", () => {
  it("rechaza desde pendiente con motivo", async () => {
    const updateSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({ exists: () => true, data: () => ({ estado: "pendiente" }) }),
        update: updateSpy,
      };
      return fn(tx);
    });
    await rechazarSolicitud("s1", "Sin disponibilidad");
    const payload = updateSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("rechazada");
    expect(payload.motivo).toBe("Sin disponibilidad");
  });
});

describe("cancelarSolicitud", () => {
  it("cancela desde agendada", async () => {
    const updateSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({ exists: () => true, data: () => ({ estado: "agendada" }) }),
        update: updateSpy,
      };
      return fn(tx);
    });
    await cancelarSolicitud("s1", "Cancelada por el cliente");
    const payload = updateSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("cancelada");
  });
  it("lanza si ya está completada", async () => {
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({ exists: () => true, data: () => ({ estado: "completada" }) }),
        update: vi.fn(),
      };
      return fn(tx);
    });
    await expect(cancelarSolicitud("s1")).rejects.toThrow();
  });
});

describe("proponerCambio", () => {
  it("valida fecha no domingo y hora en rango antes de escribir", async () => {
    await expect(
      proponerCambio(solicitudBase, { fecha: "2099-09-20", hora: "10:00" }, "admin"),
    ).rejects.toThrow(/domingo/);
    await expect(
      proponerCambio(solicitudBase, { fecha: "2099-09-18", hora: "20:00" }, "admin"),
    ).rejects.toThrow(/08:00 y 19:00/);
  });
  it("propone desde agendada y guarda estadoPrevio", async () => {
    const updateSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({ exists: () => true, data: () => ({ estado: "agendada" }) }),
        update: updateSpy,
      };
      return fn(tx);
    });
    await proponerCambio(
      { ...solicitudBase, estado: "agendada" },
      { fecha: "2099-09-18", hora: "10:00", motivo: "x" },
      "admin",
    );
    const payload = updateSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("reprogramacion");
    expect(payload.estadoPrevio).toBe("agendada");
    expect((payload.propuesta as Record<string, unknown>).por).toBe("admin");
  });
});

describe("aceptarPropuesta", () => {
  it("lanza si no hay propuesta", async () => {
    await expect(aceptarPropuesta(solicitudBase, "cliente")).rejects.toThrow(/No hay propuesta/);
  });
  it("lanza si el rol es el autor (no puede aceptar la suya)", async () => {
    await expect(
      aceptarPropuesta(
        { ...solicitudBase, propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } },
        "admin",
      ),
    ).rejects.toThrow(/propia propuesta/);
  });
  it("acepta la propuesta contraria dentro de la transacción", async () => {
    const updateSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({
            estado: "reprogramacion",
            propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" },
          }),
        }),
        update: updateSpy,
      };
      return fn(tx);
    });
    await aceptarPropuesta(
      { ...solicitudBase, propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } },
      "cliente",
    );
    const payload = updateSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("agendada");
    expect(payload.fechaDeseada).toBe("2099-09-18");
    expect(payload.propuesta).toBeNull();
  });
  it("lanza si en la transacción ya no hay propuesta vigente", async () => {
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({ estado: "agendada", propuesta: null }),
        }),
        update: vi.fn(),
      };
      return fn(tx);
    });
    await expect(
      aceptarPropuesta(
        { ...solicitudBase, propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } },
        "cliente",
      ),
    ).rejects.toThrow();
  });
});

describe("rechazarPropuesta", () => {
  it("lanza si no hay propuesta", async () => {
    await expect(rechazarPropuesta(solicitudBase, "cliente")).rejects.toThrow(/No hay propuesta/);
  });
  it("rechaza la propuesta contraria y vuelve a estadoPrevio", async () => {
    const updateSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({
            estado: "reprogramacion",
            estadoPrevio: "agendada",
            propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" },
          }),
        }),
        update: updateSpy,
      };
      return fn(tx);
    });
    await rechazarPropuesta(
      { ...solicitudBase, propuesta: { fecha: "2099-09-18", hora: "10:00", por: "admin" } },
      "cliente",
    );
    const payload = updateSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("agendada");
    expect(payload.propuesta).toBeNull();
  });
});

describe("completarSolicitud", () => {
  it("completa una visita única sin generar siguiente", async () => {
    const updateSpy = vi.fn();
    const setSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({ estado: "agendada", frecuencia: "unica" }),
        }),
        update: updateSpy,
        set: setSpy,
      };
      return fn(tx);
    });
    const r = await completarSolicitud({ ...solicitudBase, estado: "agendada", frecuencia: "unica" });
    expect(r).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it("idempotente: no vuelve a completar si ya está completada", async () => {
    const updateSpy = vi.fn();
    const setSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async () => ({
          exists: () => true,
          data: () => ({ estado: "completada", frecuencia: "semanal" }),
        }),
        update: updateSpy,
        set: setSpy,
      };
      return fn(tx);
    });
    const r = await completarSolicitud({ ...solicitudBase, estado: "completada", frecuencia: "semanal" });
    expect(r).toBeNull();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(setSpy).not.toHaveBeenCalled();
  });

  it("recurrente: genera siguiente visita con id determinista si no existe", async () => {
    const updateSpy = vi.fn();
    const setSpy = vi.fn();
    const operaciones: string[] = [];
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async (ref: { _doc?: boolean }) => {
          operaciones.push(ref && (ref as Record<string, unknown>)._nextDoc ? "get-siguiente" : "get-origen");
          // Primera llamada (doc de la solicitud actual) -> existe
          // Segunda llamada (doc determinista siguiente) -> no existe
          if (ref && (ref as Record<string, unknown>)._nextDoc) {
            return { exists: () => false, data: () => undefined };
          }
          return {
            exists: () => true,
            data: () => ({
              estado: "agendada",
              frecuencia: "semanal",
              fechaDeseada: "2099-09-18",
              horaDeseada: "10:00",
              clienteId: "uid1",
              clienteEmail: "a@b.com",
              nombre: "Ana",
              telefono: "555",
              tipoServicio: "residencial",
              direccion: "dir",
              serieId: "serie-1",
              locale: "es",
            }),
          };
        },
        update: (...args: unknown[]) => { operaciones.push("update"); return updateSpy(...args); },
        set: (...args: unknown[]) => { operaciones.push("set"); return setSpy(...args); },
      };
      // Marcamos el ref del doc siguiente para distinguirlo en tx.get
      docMock.mockImplementation((_db: unknown, _col: string, id: string) => {
        if (id === "s1") return { _doc: true };
        return { _nextDoc: true };
      });
      return fn(tx);
    });
    const r = await completarSolicitud({
      ...solicitudBase,
      estado: "agendada",
      frecuencia: "semanal",
      serieId: "serie-1",
      fechaDeseada: "2099-09-18",
    });
    // Id determinista: serieId_fechaSiguiente
    expect(r).toBe("serie-1_2099-09-25");
    expect(setSpy).toHaveBeenCalledTimes(1);
    const payload = setSpy.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.estado).toBe("agendada");
    expect(payload.serieId).toBe("serie-1");
    expect(payload.fechaDeseada).toBe("2099-09-25"); // +7 días
    expect(payload.locale).toBe("es");
    expect(operaciones).toEqual(["get-origen", "get-siguiente", "update", "set"]);
  });

  it("recurrente histórico sin locale crea la siguiente visita en inglés", async () => {
    const setSpy = vi.fn();
    let lecturas = 0;
    runTransactionMock.mockImplementation(async (_db, fn) => fn({
      get: async () => {
        lecturas += 1;
        return lecturas === 1
          ? {
              exists: () => true,
              data: () => ({
                estado: "agendada", frecuencia: "semanal", fechaDeseada: "2099-09-18",
                horaDeseada: "10:00", clienteId: "uid1", clienteEmail: "a@b.com",
                nombre: "Ana", telefono: "555", tipoServicio: "residencial", direccion: "dir",
              }),
            }
          : { exists: () => false };
      },
      update: vi.fn(),
      set: setSpy,
    }));

    await completarSolicitud({ ...solicitudBase, estado: "agendada", frecuencia: "semanal" });
    expect(setSpy.mock.calls[0][1]).toMatchObject({ locale: "en" });
  });

  it("recurrente: no duplica si el doc determinista ya existe (idempotencia en tx)", async () => {
    const updateSpy = vi.fn();
    const setSpy = vi.fn();
    runTransactionMock.mockImplementation(async (_db, fn) => {
      const tx = {
        get: async (ref: { _doc?: boolean }) => {
          if (ref && (ref as Record<string, unknown>)._nextDoc) {
            // El doc determinista ya existe -> no duplicar
            return { exists: () => true, data: () => ({ estado: "agendada" }) };
          }
          return {
            exists: () => true,
            data: () => ({
              estado: "agendada",
              frecuencia: "semanal",
              fechaDeseada: "2099-09-18",
              serieId: "serie-1",
            }),
          };
        },
        update: updateSpy,
        set: setSpy,
      };
      docMock.mockImplementation((_db: unknown, _col: string, id: string) => {
        if (id === "s1") return { _doc: true };
        return { _nextDoc: true };
      });
      return fn(tx);
    });
    const r = await completarSolicitud({
      ...solicitudBase,
      estado: "agendada",
      frecuencia: "semanal",
      serieId: "serie-1",
      fechaDeseada: "2099-09-18",
    });
    expect(r).toBeNull();
    expect(setSpy).not.toHaveBeenCalled();
    // Aun así completa la visita actual
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
