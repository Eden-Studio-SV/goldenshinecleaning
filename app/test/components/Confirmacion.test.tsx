import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
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


async function renderConfirm(opts: {
  obtenerSolicitud?: ReturnType<typeof vi.fn>;
  initialEntries?: string[];
  locale?: "en" | "es";
} = {}) {
  const obtenerSolicitud = opts.obtenerSolicitud ?? vi.fn().mockResolvedValue(null);
  mockSolicitudesModule({ obtenerSolicitud });
  mockAuthModule(makeAuthMock());
  const Confirmacion = (await import("@/features/agendamiento/Confirmacion")).default;
  const result = renderWith(<Confirmacion />, {
    initialEntries: opts.initialEntries ?? ["/solicitud-enviada?id=sol-1"],
    locale: opts.locale,
  });
  await act(async () => {});
  return result;
}

describe("Confirmacion", () => {
  it("muestra loading mientras carga la solicitud por ID", async () => {
    let resolve: (v: unknown) => void;
    const obtenerSolicitud = vi.fn().mockImplementation(
      () => new Promise((r) => { resolve = r; }),
    );
    const result = await renderConfirm({ obtenerSolicitud });
    expect(result.container.querySelector("svg.animate-spin")).toBeInTheDocument();
    await act(async () => { resolve!(null); });
  });

  it("carga la solicitud por ?id= y muestra el resumen", async () => {
    const sol = makeSolicitud({ id: "sol-1", nombre: "Ana López" });
    const obtenerSolicitud = vi.fn().mockResolvedValue(sol);
    const result = await renderConfirm({ obtenerSolicitud });
    await waitFor(() => {
      expect(result.getByText(/Request received|Solicitud recibida/i)).toBeInTheDocument();
    });
    expect(obtenerSolicitud).toHaveBeenCalledWith("sol-1");
    expect(result.getByText(/Ana/)).toBeInTheDocument();
  });

  it("traduce al español", async () => {
    const sol = makeSolicitud({ id: "sol-1", nombre: "Ana López" });
    const obtenerSolicitud = vi.fn().mockResolvedValue(sol);
    const result = await renderConfirm({ obtenerSolicitud, locale: "es" });
    await waitFor(() => {
      expect(result.getByText("¡Solicitud recibida!")).toBeInTheDocument();
    });
  });

  it("muestra 'no encontrada' si la solicitud no pertenece al usuario", async () => {
    const sol = makeSolicitud({ id: "sol-1", clienteId: "otro-uid" });
    const obtenerSolicitud = vi.fn().mockResolvedValue(sol);
    const result = await renderConfirm({ obtenerSolicitud });
    await waitFor(() => {
      expect(
        result.getByText(/couldn't find this request or it doesn't belong|No encontramos esta solicitud o no pertenece/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra 'no encontrada' si obtenerSolicitud devuelve null", async () => {
    const obtenerSolicitud = vi.fn().mockResolvedValue(null);
    const result = await renderConfirm({ obtenerSolicitud });
    await waitFor(() => {
      expect(
        result.getByText(/couldn't find this request or it doesn't belong|No encontramos esta solicitud o no pertenece/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra error si obtenerSolicitud lanza y no hay resumen en state", async () => {
    const obtenerSolicitud = vi.fn().mockRejectedValue(new Error("net"));
    const result = await renderConfirm({ obtenerSolicitud });
    await waitFor(() => {
      expect(
        result.getByText(/couldn't load your request|No pudimos cargar tu solicitud/i),
      ).toBeInTheDocument();
    });
    expect(result.getByRole("button", { name: /Retry|Reintentar/i })).toBeInTheDocument();
  });

  it("muestra 'sin id' si no hay ?id= ni resumen en state", async () => {
    const result = await renderConfirm({ initialEntries: ["/solicitud-enviada"] });
    expect(
      result.getByText(/No request ID was provided|No se proporcionó un ID/i),
    ).toBeInTheDocument();
  });

  it("usa el resumen de location.state si no hay ?id=", async () => {
    mockSolicitudesModule({ obtenerSolicitud: vi.fn() });
    mockAuthModule(makeAuthMock());
    const Confirmacion = (await import("@/features/agendamiento/Confirmacion")).default;
    const result = renderWith(<Confirmacion />, {
      initialEntries: [
        {
          pathname: "/solicitud-enviada",
          state: {
            resumen: {
              nombre: "Carlos",
              tipoServicio: "residencial",
              frecuencia: "unica",
              fechaDeseada: "2026-10-20",
              horaDeseada: "09:00",
            },
          },
        },
      ],
    });
    await waitFor(() => {
      expect(result.getByText(/Request received|Solicitud recibida/i)).toBeInTheDocument();
    });
    expect(result.getByText(/Carlos/)).toBeInTheDocument();
  });

  it("muestra el botón de WhatsApp solo si hay contacto configurado", async () => {
    const sol = makeSolicitud({ id: "sol-1" });
    const obtenerSolicitud = vi.fn().mockResolvedValue(sol);
    const result = await renderConfirm({ obtenerSolicitud });
    await waitFor(() => {
      expect(result.getByText(/Request received|Solicitud recibida/i)).toBeInTheDocument();
    });
    // Sin VITE_CONTACT_WHATSAPP, no debe haber enlace WhatsApp
    expect(result.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
  });

  it("muestra el botón 'Ver mis solicitudes' que enlaza a /portal", async () => {
    const sol = makeSolicitud({ id: "sol-1" });
    const obtenerSolicitud = vi.fn().mockResolvedValue(sol);
    const result = await renderConfirm({ obtenerSolicitud });
    await waitFor(() => {
      const link = result.getByRole("link", { name: /View my requests|Ver mis solicitudes/i });
      expect(link).toHaveAttribute("href", "/portal");
    });
  });
});
