import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWith } from "./helpers";
import {
  makeAuthMock,
  mockAuthModule,
  mockSolicitudesModule,
  makeSolicitud,
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
// PortalLayout
// ---------------------------------------------------------------------------

describe("PortalLayout", () => {
  it("muestra el badge 'Mi portal' y el nombre del usuario", async () => {
    mockAuthModule(makeAuthMock());
    const PortalLayout = (await import("@/features/portal/PortalLayout")).default;
    renderWith(
      <Routes>
        <Route path="/portal" element={<PortalLayout />}><Route index element={<div>contenido portal</div>} /></Route>
      </Routes>,
      { initialEntries: ["/portal"] },
    );
    expect(screen.getByText("My portal")).toBeInTheDocument();
    expect(screen.getByText(/Hi, Cliente/)).toBeInTheDocument();
    expect(screen.getByText("contenido portal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My portal" })).toHaveAttribute("href", "/portal");
    expect(document.querySelector("a a")).toBeNull();
  });

  it("traduce al español", async () => {
    mockAuthModule(makeAuthMock());
    const PortalLayout = (await import("@/features/portal/PortalLayout")).default;
    renderWith(
      <Routes>
        <Route path="/portal" element={<PortalLayout />}><Route index element={<div>x</div>} /></Route>
      </Routes>,
      { initialEntries: ["/portal"], locale: "es" },
    );
    expect(screen.getByText("Mi portal")).toBeInTheDocument();
    expect(screen.getByText(/Hola, Cliente/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// MisLimpiezas
// ---------------------------------------------------------------------------

async function renderMisLimpiezas(opts: {
  observarSolicitudesCliente?: ReturnType<typeof vi.fn>;
  locale?: "en" | "es";
} = {}) {
  const fn =
    opts.observarSolicitudesCliente ??
    vi.fn((_uid, onData) => {
      onData([]);
      return () => undefined;
    });
  mockSolicitudesModule({ observarSolicitudesCliente: fn });
  mockAuthModule(makeAuthMock());
  const MisLimpiezas = (await import("@/features/portal/MisLimpiezas")).default;
  return renderWith(<MisLimpiezas />, { initialEntries: ["/portal"], locale: opts.locale });
}

describe("MisLimpiezas", () => {
  it("muestra estado vacío cuando no hay solicitudes", async () => {
    const result = await renderMisLimpiezas();
    await waitFor(() => {
      expect(
        result.getByText(/haven't requested any cleaning|Aún no has solicitado ninguna limpieza/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra loading mientras carga", async () => {
    const fn = vi.fn((_uid, _onData) => () => undefined); // no llama onData
    const result = await renderMisLimpiezas({ observarSolicitudesCliente: fn });
    expect(result.container.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  it("muestra error si la suscripción falla", async () => {
    const fn = vi.fn((_uid, _onData, onError) => {
      onError(new Error("fail"));
      return () => undefined;
    });
    const result = await renderMisLimpiezas({ observarSolicitudesCliente: fn });
    await waitFor(() => {
      expect(
        result.getByText(/Could not load your requests|No se pudieron cargar tus solicitudes/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra las solicitudes activas e historial", async () => {
    const items = [
      makeSolicitud({ id: "1", estado: "agendada" }),
      makeSolicitud({ id: "2", estado: "completada" }),
    ];
    const fn = vi.fn((_uid, onData) => {
      onData(items);
      return () => undefined;
    });
    const result = await renderMisLimpiezas({ observarSolicitudesCliente: fn });
    await waitFor(() => {
      expect(result.getByText("Upcoming")).toBeInTheDocument();
      expect(result.getByText("History")).toBeInTheDocument();
    });
  });

  it("traduce al español", async () => {
    const result = await renderMisLimpiezas({ locale: "es" });
    await waitFor(() => {
      expect(result.getByText("Mis limpiezas")).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// DetalleCliente
// ---------------------------------------------------------------------------

async function renderDetalleCliente(opts: {
  obtenerSolicitud?: ReturnType<typeof vi.fn>;
  id?: string;
} = {}) {
  const obtenerSolicitud = opts.obtenerSolicitud ?? vi.fn().mockResolvedValue(null);
  mockSolicitudesModule({ obtenerSolicitud });
  mockAuthModule(makeAuthMock());
  const DetalleCliente = (await import("@/features/portal/DetalleCliente")).default;
  const result = renderWith(
    <Routes><Route path="/portal/solicitud/:id" element={<DetalleCliente />} /></Routes>,
    { initialEntries: [`/portal/solicitud/${opts.id ?? "sol-1"}`] },
  );
  await act(async () => {});
  return result;
}

describe("DetalleCliente", () => {
  it("muestra loading mientras carga", async () => {
    let resolve: (v: unknown) => void;
    const obtenerSolicitud = vi.fn().mockImplementation(
      () => new Promise((r) => { resolve = r; }),
    );
    const result = await renderDetalleCliente({ obtenerSolicitud });
    expect(result.container.querySelector("svg.animate-spin")).toBeInTheDocument();
    await act(async () => { resolve!(null); });
  });

  it("muestra 'no encontrada' si la solicitud no pertenece al usuario", async () => {
    const sol = makeSolicitud({ clienteId: "otro-uid" });
    const result = await renderDetalleCliente({
      obtenerSolicitud: vi.fn().mockResolvedValue(sol),
    });
    await waitFor(() => {
      expect(
        result.getByText(/couldn't find this request or it doesn't belong|No encontramos esta solicitud o no pertenece/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra el detalle si la solicitud pertenece al usuario", async () => {
    const sol = makeSolicitud({ id: "sol-1", clienteId: "uid-1" });
    const result = await renderDetalleCliente({
      obtenerSolicitud: vi.fn().mockResolvedValue(sol),
    });
    await waitFor(() => {
      expect(result.getByText("Your request")).toBeInTheDocument();
    });
  });

  it("traduce al español", async () => {
    const sol = makeSolicitud({ id: "sol-1", clienteId: "uid-1" });
    mockSolicitudesModule({ obtenerSolicitud: vi.fn().mockResolvedValue(sol) });
    mockAuthModule(makeAuthMock());
    const DetalleCliente = (await import("@/features/portal/DetalleCliente")).default;
    const result = renderWith(
      <Routes><Route path="/portal/solicitud/:id" element={<DetalleCliente />} /></Routes>,
      { initialEntries: ["/portal/solicitud/sol-1"], locale: "es" },
    );
    await waitFor(() => {
      expect(result.getByText("Tu solicitud")).toBeInTheDocument();
    });
  });
});
