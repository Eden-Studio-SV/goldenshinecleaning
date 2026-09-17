import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { ResumenSolicitud } from "@/features/agendamiento/ResumenSolicitud";
import { renderWith } from "./helpers";
import { makeSolicitud } from "./mocks";

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("ResumenSolicitud", () => {
  it("muestra los campos básicos en inglés", () => {
    const s = makeSolicitud({ nombre: "Ana", direccion: "123 Main St" });
    renderWith(<ResumenSolicitud s={s} />);
    expect(screen.getByText("Request details")).toBeInTheDocument();
    expect(screen.getByText("Residential Cleaning")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
  });

  it("traduce al español", () => {
    const s = makeSolicitud();
    renderWith(<ResumenSolicitud s={s} />, { locale: "es" });
    expect(screen.getByText("Detalle de la solicitud")).toBeInTheDocument();
    expect(screen.getByText("Limpieza Residencial")).toBeInTheDocument();
  });

  it("muestra el cliente cuando mostrarCliente=true", () => {
    const s = makeSolicitud({ nombre: "Ana", clienteEmail: "ana@test.com" });
    renderWith(<ResumenSolicitud s={s} mostrarCliente />);
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText(/ana@test.com/)).toBeInTheDocument();
  });

  it("no muestra el cliente cuando mostrarCliente no se pasa", () => {
    const s = makeSolicitud({ nombre: "Ana" });
    renderWith(<ResumenSolicitud s={s} />);
    expect(screen.queryByText("Customer")).not.toBeInTheDocument();
  });

  it("muestra la propuesta de reprogramación cuando existe", () => {
    const s = makeSolicitud({
      estado: "reprogramacion",
      propuesta: {
        fecha: "2026-11-01",
        hora: "11:00",
        por: "admin",
        motivo: "Cambio de disponibilidad",
      },
    });
    renderWith(<ResumenSolicitud s={s} />);
    expect(screen.getByText("Proposed new date")).toBeInTheDocument();
    expect(screen.getByText(/Cambio de disponibilidad/)).toBeInTheDocument();
    expect(screen.getByText(/proposed by Golden Shine/)).toBeInTheDocument();
  });

  it("muestra el motivo de rechazo cuando estado es rechazada", () => {
    const s = makeSolicitud({ estado: "rechazada", motivo: "No disponibilidad" });
    renderWith(<ResumenSolicitud s={s} />);
    expect(screen.getByText("Rejection reason")).toBeInTheDocument();
    expect(screen.getByText("No disponibilidad")).toBeInTheDocument();
  });

  it("muestra 'Ver en mapa' cuando hay ubicación", () => {
    const s = makeSolicitud({ ubicacion: { lat: 42.36, lng: -71.06 } });
    renderWith(<ResumenSolicitud s={s} />);
    const link = screen.getByText("View on map");
    expect(link).toHaveAttribute("href", expect.stringContaining("openstreetmap.org"));
  });

  it("muestra las notas cuando existen", () => {
    const s = makeSolicitud({ notas: "Tener cuidado con la mascota" });
    renderWith(<ResumenSolicitud s={s} />);
    expect(screen.getByText("Tener cuidado con la mascota")).toBeInTheDocument();
  });
});