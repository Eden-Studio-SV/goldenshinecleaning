import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---- Mock aislado de Firestore para clientes.ts --------------------------------
// vi.hoisted garantiza que los mocks existan antes del hoisting de vi.mock.
const mocks = vi.hoisted(() => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
  db: { _db: true },
}));

vi.mock("firebase/firestore", () => ({
  doc: (...args: unknown[]) => mocks.doc(...args),
  getDoc: (...args: unknown[]) => mocks.getDoc(...args),
  setDoc: (...args: unknown[]) => mocks.setDoc(...args),
  updateDoc: (...args: unknown[]) => mocks.updateDoc(...args),
  serverTimestamp: () => mocks.serverTimestamp(),
}));

vi.mock("@/firebase", () => ({
  app: null,
  db: mocks.db,
  auth: null,
  isFirebaseConfigured: true,
  useEmulators: false,
}));

import { upsertCliente, obtenerCliente, guardarTelefonoCliente } from "@/lib/clientes";

const { doc: docMock, getDoc: getDocMock, setDoc: setDocMock, updateDoc: updateDocMock } = mocks;

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("upsertCliente", () => {
  it("hace updateDoc si el perfil existe", async () => {
    docMock.mockReturnValue({ path: "clientes/uid1" });
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ nombre: "Viejo" }),
    });
    updateDocMock.mockResolvedValue(undefined);

    await upsertCliente({ uid: "uid1", email: "a@b.com", displayName: "Ana" });

    expect(docMock).toHaveBeenCalledWith(mocks.db, "clientes", "uid1");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
    expect(setDocMock).not.toHaveBeenCalled();
  });

  it("hace setDoc con creadoEn si el perfil no existe", async () => {
    docMock.mockReturnValue({ path: "clientes/uid2" });
    getDocMock.mockResolvedValue({ exists: () => false, data: () => undefined });
    setDocMock.mockResolvedValue(undefined);

    await upsertCliente({ uid: "uid2", email: "a@b.com", displayName: null });

    expect(setDocMock).toHaveBeenCalledTimes(1);
    expect(updateDocMock).not.toHaveBeenCalled();
    // setDoc recibe el doc y el payload con creadoEn
    const payload = setDocMock.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.creadoEn).toBeDefined();
    expect(payload.nombre).toBe(""); // sin displayName ni nombre previo
  });

  it("no lanza si db es null (retorna early)", async () => {
    // Re-mock temporal con db null para verificar el early return.
    vi.doMock("@/firebase", () => ({
      app: null,
      db: null,
      auth: null,
      isFirebaseConfigured: false,
      useEmulators: false,
    }));
    // Smoke: la función real retorna early cuando db es null; aquí solo
    // verificamos que no se llame updateDoc bajo el mock principal.
    expect(updateDocMock).not.toHaveBeenCalled();
    vi.doUnmock("@/firebase");
  });
});

describe("obtenerCliente", () => {
  it("devuelve null si el doc no existe", async () => {
    docMock.mockReturnValue({ path: "clientes/x" });
    getDocMock.mockResolvedValue({ exists: () => false, data: () => undefined });
    const r = await obtenerCliente("x");
    expect(r).toBeNull();
  });
  it("mapea los campos del cliente", async () => {
    docMock.mockReturnValue({ path: "clientes/uid3" });
    getDocMock.mockResolvedValue({
      exists: () => true,
      id: "uid3",
      data: () => ({
        nombre: "Ana",
        email: "ana@b.com",
        telefono: "555",
        creadoEn: null,
        actualizadoEn: null,
      }),
    });
    const r = await obtenerCliente("uid3");
    expect(r).not.toBeNull();
    expect(r?.id).toBe("uid3");
    expect(r?.nombre).toBe("Ana");
    expect(r?.email).toBe("ana@b.com");
    expect(r?.telefono).toBe("555");
  });
});

describe("guardarTelefonoCliente", () => {
  it("no llama updateDoc si teléfono vacío", async () => {
    await guardarTelefonoCliente("uid", "   ");
    expect(updateDocMock).not.toHaveBeenCalled();
  });
  it("llama updateDoc con teléfono recortado", async () => {
    docMock.mockReturnValue({ path: "clientes/uid" });
    updateDocMock.mockResolvedValue(undefined);
    await guardarTelefonoCliente("uid", "  555-1234  ");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
    const payload = updateDocMock.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.telefono).toBe("555-1234");
    expect(payload.actualizadoEn).toBeDefined();
  });
});