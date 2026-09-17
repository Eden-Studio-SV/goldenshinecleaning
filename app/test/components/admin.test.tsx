import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWith } from "./helpers";
import {
  makeAuthMock,
  mockAuthModule,
  mockSolicitudesModule,
  makeSolicitud,
  mockFirebase,
  resetComponentMocks,
} from "./mocks";

beforeEach(() => {
  window.localStorage.clear();
  resetComponentMocks();
});
afterEach(() => {
  vi.clearAllMocks();
});


// ---------------------------------------------------------------------------
// PanelLayout
// ---------------------------------------------------------------------------

describe("PanelLayout", () => {
  it("muestra el badge 'Panel' y el email del admin", async () => {
    mockAuthModule(makeAuthMock({ isAdmin: true, user: { uid: "a1", email: "admin@test.com", displayName: null } }));
    const PanelLayout = (await import("@/features/admin/PanelLayout")).default;
    renderWith(
      <Routes>
        <Route path="/admin" element={<PanelLayout />}><Route index element={<div>contenido admin</div>} /></Route>
      </Routes>,
      { initialEntries: ["/admin"] },
    );
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(screen.getByText("admin@test.com")).toBeInTheDocument();
    expect(screen.getByText("contenido admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
    expect(document.querySelector("a a")).toBeNull();
  });

  it("traduce al español", async () => {
    mockAuthModule(makeAuthMock({ isAdmin: true }));
    const PanelLayout = (await import("@/features/admin/PanelLayout")).default;
    renderWith(
      <Routes>
        <Route path="/admin" element={<PanelLayout />}><Route index element={<div>x</div>} /></Route>
      </Routes>,
      { initialEntries: ["/admin"], locale: "es" },
    );
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ListaSolicitudes
// ---------------------------------------------------------------------------

async function renderListaSolicitudes(opts: {
  observarSolicitudes?: ReturnType<typeof vi.fn>;
  locale?: "en" | "es";
} = {}) {
  const fn =
    opts.observarSolicitudes ??
    vi.fn((_estado, onData) => {
      onData([]);
      return () => undefined;
    });
  mockSolicitudesModule({ observarSolicitudes: fn });
  mockAuthModule(makeAuthMock({ isAdmin: true }));
  const ListaSolicitudes = (await import("@/features/admin/ListaSolicitudes")).default;
  return renderWith(<ListaSolicitudes />, { initialEntries: ["/admin"], locale: opts.locale });
}

describe("ListaSolicitudes", () => {
  it("muestra estado vacío cuando no hay solicitudes", async () => {
    const result = await renderListaSolicitudes();
    await waitFor(() => {
      expect(
        result.getByText(/No requests in this category|No hay solicitudes en esta categoría/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra loading mientras carga", async () => {
    const fn = vi.fn((_estado, _onData) => () => undefined);
    const result = await renderListaSolicitudes({ observarSolicitudes: fn });
    expect(result.container.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("muestra error si la suscripción falla", async () => {
    const fn = vi.fn((_estado, _onData, onError) => {
      onError(new Error("fail"));
      return () => undefined;
    });
    const result = await renderListaSolicitudes({ observarSolicitudes: fn });
    await waitFor(() => {
      expect(
        result.getByText(/Could not load requests|No se pudieron cargar las solicitudes/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra aviso de Firebase no configurado", async () => {
    const fn = vi.fn((_estado, onData) => {
      onData([]);
      return () => undefined;
    });
    mockSolicitudesModule({ observarSolicitudes: fn });
    mockAuthModule(makeAuthMock({ isAdmin: true }));
    mockFirebase({ isFirebaseConfigured: false });
    const ListaSolicitudes = (await import("@/features/admin/ListaSolicitudes")).default;
    const result = renderWith(<ListaSolicitudes />, { initialEntries: ["/admin"] });
    await waitFor(() => {
      expect(
        result.getByText(/Firebase is not connected|Firebase no está conectado/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra la tabla con solicitudes (desktop)", async () => {
    const items = [
      makeSolicitud({ id: "1", nombre: "Ana", estado: "pendiente" }),
      makeSolicitud({ id: "2", nombre: "Bob", estado: "agendada" }),
    ];
    const fn = vi.fn((_estado, onData) => {
      onData(items);
      return () => undefined;
    });
    const result = await renderListaSolicitudes({ observarSolicitudes: fn });
    await waitFor(() => {
      expect(result.getAllByText("Ana")).not.toHaveLength(0);
      expect(result.getAllByText("Bob")).not.toHaveLength(0);
    });
  });

  it("renderiza los tabs de filtro con aria-selected", async () => {
    const result = await renderListaSolicitudes();
    const tablist = result.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    const allTab = result.getByRole("tab", { name: /All|Todas/ });
    expect(allTab).toHaveAttribute("aria-selected", "true");
  });

  it("cambia el filtro al clic en un tab", async () => {
    const fn = vi.fn((_estado, onData) => {
      onData([]);
      return () => undefined;
    });
    const result = await renderListaSolicitudes({ observarSolicitudes: fn });
    const pendingTab = result.getByRole("tab", { name: /Pending|Pendiente/ });
    fireEvent.click(pendingTab);
    expect(pendingTab).toHaveAttribute("aria-selected", "true");
    // El último llamado a observarSolicitudes debe ser con "pendiente"
    expect(fn.mock.calls[fn.mock.calls.length - 1][0]).toBe("pendiente");
  });

  it("permite cambiar el filtro con las flechas del teclado", async () => {
    const fn = vi.fn((_estado, onData) => {
      onData([]);
      return () => undefined;
    });
    const result = await renderListaSolicitudes({ observarSolicitudes: fn });
    const allTab = result.getByRole("tab", { name: /All|Todas/ });
    allTab.focus();
    fireEvent.keyDown(allTab, { key: "ArrowRight" });

    await waitFor(() => {
      expect(result.getByRole("tab", { name: /Pending|Pendiente/ })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
    expect(fn.mock.calls[fn.mock.calls.length - 1][0]).toBe("pendiente");
  });

  it("traduce al español", async () => {
    const result = await renderListaSolicitudes({ locale: "es" });
    await waitFor(() => {
      expect(result.getByText("Solicitudes")).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// DetalleSolicitud
// ---------------------------------------------------------------------------

async function renderDetalleSolicitud(opts: {
  obtenerSolicitud?: ReturnType<typeof vi.fn>;
  id?: string;
} = {}) {
  const obtenerSolicitud = opts.obtenerSolicitud ?? vi.fn().mockResolvedValue(null);
  mockSolicitudesModule({ obtenerSolicitud });
  mockAuthModule(makeAuthMock({ isAdmin: true }));
  const DetalleSolicitud = (await import("@/features/admin/DetalleSolicitud")).default;
  const result = renderWith(
    <Routes><Route path="/admin/solicitud/:id" element={<DetalleSolicitud />} /></Routes>,
    { initialEntries: [`/admin/solicitud/${opts.id ?? "sol-1"}`] },
  );
  await act(async () => {});
  return result;
}

describe("DetalleSolicitud", () => {
  it("muestra loading mientras carga", async () => {
    let resolve: (v: unknown) => void;
    const obtenerSolicitud = vi.fn().mockImplementation(
      () => new Promise((r) => { resolve = r; }),
    );
    const result = await renderDetalleSolicitud({ obtenerSolicitud });
    expect(result.container.querySelector("svg.animate-spin")).toBeInTheDocument();
    await act(async () => { resolve!(null); });
  });

  it("muestra 'no encontrada' si obtenerSolicitud devuelve null", async () => {
    const result = await renderDetalleSolicitud({
      obtenerSolicitud: vi.fn().mockResolvedValue(null),
    });
    await waitFor(() => {
      expect(
        result.getByText(/couldn't find this request|No encontramos esta solicitud/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra el detalle con datos del cliente cuando existe", async () => {
    const sol = makeSolicitud({ id: "sol-1", nombre: "Ana López", telefono: "(617) 123-4567" });
    const result = await renderDetalleSolicitud({
      obtenerSolicitud: vi.fn().mockResolvedValue(sol),
    });
    await waitFor(() => {
      expect(result.getByRole("heading", { name: "Ana López" })).toBeInTheDocument();
    });
    expect(result.getByText(/Contact the customer|Contactar al cliente/)).toBeInTheDocument();
    expect(result.getByText(/Call · \(617\) 123-4567|Llamar · \(617\) 123-4567/)).toBeInTheDocument();
  });

  it("traduce al español", async () => {
    const sol = makeSolicitud({ id: "sol-1", nombre: "Ana" });
    mockSolicitudesModule({ obtenerSolicitud: vi.fn().mockResolvedValue(sol) });
    mockAuthModule(makeAuthMock({ isAdmin: true }));
    const DetalleSolicitud = (await import("@/features/admin/DetalleSolicitud")).default;
    const result = renderWith(
      <Routes><Route path="/admin/solicitud/:id" element={<DetalleSolicitud />} /></Routes>,
      { initialEntries: ["/admin/solicitud/sol-1"], locale: "es" },
    );
    await waitFor(() => {
      expect(result.getByRole("heading", { name: "Ana" })).toBeInTheDocument();
      expect(result.getByText("Contactar al cliente")).toBeInTheDocument();
    });
  });
});
