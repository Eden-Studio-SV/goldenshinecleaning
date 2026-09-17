import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { renderWith } from "./helpers";

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("Footer", () => {
  it("muestra aviso de contacto no configurado cuando no hay VITE_CONTACT_*", () => {
    renderWith(<Footer />);
    expect(
      screen.getByText(/Contact info not yet configured|Contacto aún no configurado/),
    ).toBeInTheDocument();
  });

  it("no muestra enlaces de teléfono/WhatsApp/email cuando no hay contacto", () => {
    renderWith(<Footer />);
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
  });

  it("muestra el enlace de acceso personal a /ingresar (no /admin/login)", () => {
    renderWith(<Footer />);
    const link = screen.getByText(/Staff access|Acceso personal/);
    expect(link).toHaveAttribute("href", "/ingresar");
  });

  it("muestra el enlace de solicitar limpieza", () => {
    renderWith(<Footer />);
    const link = screen.getByText(/Request cleaning|Solicitar limpieza/);
    expect(link).toHaveAttribute("href", "/solicitar");
  });

  it("muestra la zona de servicio (Boston)", () => {
    renderWith(<Footer />);
    expect(screen.getByText("Boston, Massachusetts")).toBeInTheDocument();
  });

  it("traduce al español cuando locale es es", () => {
    renderWith(<Footer />, { locale: "es" });
    expect(screen.getByText("Contacto")).toBeInTheDocument();
    expect(screen.getByText("Información")).toBeInTheDocument();
    expect(screen.getByText("Enlaces")).toBeInTheDocument();
  });
});