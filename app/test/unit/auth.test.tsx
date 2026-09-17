import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Aislamos el módulo firebase para que auth.tsx no arranque Firebase real.
vi.mock("@/firebase", () => ({
  app: null,
  db: null,
  auth: null,
  isFirebaseConfigured: false,
  useEmulators: false,
}));

// Mock de upsertCliente para que no toque Firestore al importar auth.tsx.
vi.mock("@/lib/clientes", () => ({
  upsertCliente: vi.fn().mockResolvedValue(undefined),
  obtenerCliente: vi.fn().mockResolvedValue(null),
  guardarTelefonoCliente: vi.fn().mockResolvedValue(undefined),
}));

import { isAdminEmail, useAuth, AuthProvider, type Rol } from "@/lib/auth";
import { renderHook, act } from "@testing-library/react";

describe("isAdminEmail", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("acepta el admin por defecto info@edenstudio.dev", () => {
    expect(isAdminEmail("info@edenstudio.dev")).toBe(true);
    expect(isAdminEmail("INFO@EDENSTUDIO.DEV")).toBe(true);
  });
  it("rechaza correos no listados", () => {
    expect(isAdminEmail("cliente@correo.com")).toBe(false);
  });
  it("rechaza null/undefined/vacío", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });
});

describe("useAuth sin Firebase configurado", () => {
  it("provee rol null y loading false cuando auth es null", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
    // El efecto onAuthStateChanged no se registra si auth es null, y loading
    // pasa a false de inmediato.
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    const rol: Rol = result.current.rol;
    expect(rol).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it("loginWithGoogle lanza porque auth es null", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
    await expect(result.current.loginWithGoogle()).rejects.toThrow(/Firebase no está configurado/);
  });

  it("logout no lanza cuando auth es null", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
  });
});