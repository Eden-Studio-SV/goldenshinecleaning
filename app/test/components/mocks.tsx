import { vi } from "vitest";
import type { Solicitud } from "@/types";

/**
 * Mocks compartidos para pruebas de componentes.
 *
 * Estos helpers construyen objetos mock y factories de `vi.mock` para aislar
 * los componentes de Firebase, Firestore y Auth. Cada test importa lo que
 * necesite y aplica `vi.mock` a nivel módulo.
 */

// ---------------------------------------------------------------------------
// Mock de @/firebase
// ---------------------------------------------------------------------------

const stores = vi.hoisted(() => {
  const solicitudFns = {
    crearSolicitud: vi.fn(), obtenerSolicitud: vi.fn(), observarSolicitudes: vi.fn(),
    observarSolicitudesCliente: vi.fn(), confirmarSolicitud: vi.fn(), rechazarSolicitud: vi.fn(),
    cancelarSolicitud: vi.fn(), proponerCambio: vi.fn(), completarSolicitud: vi.fn(),
    aceptarPropuesta: vi.fn(), rechazarPropuesta: vi.fn(),
  };
  return {
    auth: {
      user: null as MockAuthState["user"], isAdmin: false, loading: false,
      loginWithGoogle: vi.fn(), logout: vi.fn(),
    },
    solicitudes: solicitudFns,
    clientes: {
      upsertCliente: vi.fn().mockResolvedValue(undefined), obtenerCliente: vi.fn().mockResolvedValue(null),
      guardarTelefonoCliente: vi.fn().mockResolvedValue(undefined),
    },
    firebase: { isFirebaseConfigured: true, useEmulators: false },
  };
});

vi.mock("@/lib/auth", () => ({
  useAuth: () => stores.auth,
  isAdminEmail: (email?: string | null) => !!email && stores.auth.isAdmin && email.includes("admin"),
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/lib/solicitudes", () => stores.solicitudes);
vi.mock("@/lib/clientes", () => stores.clientes);
vi.mock("@/firebase", () => ({
  app: null,
  db: null,
  auth: null,
  get isFirebaseConfigured() { return stores.firebase.isFirebaseConfigured; },
  get useEmulators() { return stores.firebase.useEmulators; },
}));

// ---------------------------------------------------------------------------
// Mock de @/lib/auth (useAuth)
// ---------------------------------------------------------------------------

export interface MockAuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: ReturnType<typeof vi.fn>;
  logout: ReturnType<typeof vi.fn>;
}

export function makeAuthMock(overrides: Partial<MockAuthState> = {}): MockAuthState {
  return {
    user: { uid: "uid-1", email: "cliente@test.com", displayName: "Cliente Test" },
    isAdmin: false,
    loading: false,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}

/**
 * Aplica `vi.mock("@/lib/auth")` con un mock controlable. Devuelve un setter
 * para cambiar el estado de auth durante el test.
 *
 * Uso:
 *   const setAuth = mockAuthModule({ user: null });
 *   setAuth({ user: { uid: "x", ... } });
 */
export function mockAuthModule(initial: MockAuthState = makeAuthMock()) {
  Object.assign(stores.auth, initial);
  return (next: Partial<MockAuthState>) => {
    Object.assign(stores.auth, next);
  };
}

export function mockFirebase(overrides: Partial<typeof stores.firebase> = {}) {
  Object.assign(stores.firebase, overrides);
}

export function resetComponentMocks() {
  Object.assign(stores.auth, makeAuthMock({ user: null }));
  Object.assign(stores.firebase, { isFirebaseConfigured: true, useEmulators: false });
  mockSolicitudesModule();
  mockClientesModule();
}

// ---------------------------------------------------------------------------
// Mock de @/lib/solicitudes
// ---------------------------------------------------------------------------

export function makeSolicitud(overrides: Partial<Solicitud> = {}): Solicitud {
  return {
    id: "sol-1",
    clienteId: "uid-1",
    clienteEmail: "cliente@test.com",
    nombre: "Cliente Test",
    telefono: "(617) 123-4567",
    email: "cliente@test.com",
    tipoServicio: "residencial",
    direccion: "123 Main St, Boston, MA",
    ubicacion: null,
    fechaDeseada: "2026-10-15",
    horaDeseada: "10:00",
    frecuencia: "unica",
    serieId: null,
    notas: undefined,
    estado: "pendiente",
    estadoPrevio: null,
    propuesta: null,
    motivo: null,
    creadoEn: null,
    actualizadoEn: null,
    ...overrides,
  };
}

export const mockSolicitudesModule = (overrides: {
  crearSolicitud?: ReturnType<typeof vi.fn>;
  obtenerSolicitud?: ReturnType<typeof vi.fn>;
  observarSolicitudes?: ReturnType<typeof vi.fn>;
  observarSolicitudesCliente?: ReturnType<typeof vi.fn>;
  confirmarSolicitud?: ReturnType<typeof vi.fn>;
  rechazarSolicitud?: ReturnType<typeof vi.fn>;
  cancelarSolicitud?: ReturnType<typeof vi.fn>;
  proponerCambio?: ReturnType<typeof vi.fn>;
  completarSolicitud?: ReturnType<typeof vi.fn>;
  aceptarPropuesta?: ReturnType<typeof vi.fn>;
  rechazarPropuesta?: ReturnType<typeof vi.fn>;
} = {}) => {
  for (const key of Object.keys(stores.solicitudes) as (keyof typeof stores.solicitudes)[]) {
    const target = stores.solicitudes[key];
    const source = overrides[key];
    target.mockReset();
    if (source) target.mockImplementation(source);
  }
};

// ---------------------------------------------------------------------------
// Mock de @/lib/clientes
// ---------------------------------------------------------------------------

export const mockClientesModule = (overrides: {
  upsertCliente?: ReturnType<typeof vi.fn>;
  obtenerCliente?: ReturnType<typeof vi.fn>;
  guardarTelefonoCliente?: ReturnType<typeof vi.fn>;
} = {}) => {
  for (const key of Object.keys(stores.clientes) as (keyof typeof stores.clientes)[]) {
    const target = stores.clientes[key];
    const source = overrides[key];
    target.mockReset();
    if (source) target.mockImplementation(source);
    else if (key === "obtenerCliente") target.mockResolvedValue(null);
    else target.mockResolvedValue(undefined);
  }
};

// ---------------------------------------------------------------------------
// Mock de @/lib/lifecycle (accionesDisponibles, mensajeEstado, ACCION_META)
// ---------------------------------------------------------------------------

export const mockLifecycleModule = () => {
  vi.doMock("@/lib/lifecycle", async () => {
    const actual = await vi.importActual("@/lib/lifecycle");
    return { ...actual };
  });
};

// ---------------------------------------------------------------------------
// Mock de @/lib/validators (hoyISO, schemas)
// ---------------------------------------------------------------------------

export const mockValidatorsModule = () => {
  vi.doMock("@/lib/validators", async () => {
    const actual = await vi.importActual("@/lib/validators");
    return { ...actual };
  });
};

// ---------------------------------------------------------------------------
// Mock de @/lib/format (formatFecha, formatTimestamp)
// ---------------------------------------------------------------------------

export const mockFormatModule = () => {
  vi.doMock("@/lib/format", async () => {
    const actual = await vi.importActual("@/lib/format");
    return { ...actual };
  });
};

// ---------------------------------------------------------------------------
// Mock de react-leaflet (MapaUbicacion usa Leaflet que no funciona en jsdom)
// ---------------------------------------------------------------------------

export const mockLeafletModule = () => {
  vi.doMock("react-leaflet", () => ({
    MapContainer: ({ children }: { children: ReactNode }) => (
      <div data-testid="map-container">{children}</div>
    ),
    TileLayer: () => null,
    Marker: () => null,
    useMap: () => ({ setView: () => undefined, getZoom: () => 13 }),
    useMapEvents: () => null,
  }));
  vi.doMock("leaflet", () => {
    const Icon = { Default: { prototype: {}, mergeOptions: vi.fn() } };
    return { default: { Icon }, Icon, Marker: class {} };
  });
  vi.doMock("leaflet/dist/leaflet.css", () => ({}));
  vi.doMock("leaflet/dist/images/marker-icon.png", () => ({ default: "" }));
  vi.doMock("leaflet/dist/images/marker-icon-2x.png", () => ({ default: "" }));
  vi.doMock("leaflet/dist/images/marker-shadow.png", () => ({ default: "" }));
};

import type { ReactNode } from "react";
