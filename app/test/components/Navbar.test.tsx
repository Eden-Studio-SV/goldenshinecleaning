import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/layout/Navbar";
import { renderWith } from "./helpers";

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  vi.clearAllMocks();
});

describe("Navbar", () => {
  it("muestra los enlaces de navegación en la landing (/)", () => {
    renderWith(<Navbar />, { initialEntries: ["/"] });
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText("Why choose us")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
  });

  it("no muestra enlaces de anclas fuera de la landing", () => {
    renderWith(<Navbar />, { initialEntries: ["/portal"] });
    expect(screen.queryByText("Services")).not.toBeInTheDocument();
  });

  it("muestra el botón de solicitar limpieza", () => {
    renderWith(<Navbar />, { initialEntries: ["/"] });
    expect(screen.getByRole("button", { name: /Request cleaning/ })).toBeInTheDocument();
  });

  it("muestra el enlace a Mi cuenta", () => {
    renderWith(<Navbar />, { initialEntries: ["/"] });
    expect(screen.getByText("My account")).toBeInTheDocument();
  });

  it("abre y cierra el menú móvil con el botón hamburguesa", () => {
    renderWith(<Navbar />, { initialEntries: ["/"] });
    const toggle = screen.getByRole("button", { name: /Open menu/ });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    // El menú móvil duplica enlaces; debe haber un segundo "Services"
    expect(screen.getAllByText("Services").length).toBeGreaterThanOrEqual(2);
    // Cerrar
    const closeBtn = screen.getByRole("button", { name: /Close menu/ });
    fireEvent.click(closeBtn);
    expect(screen.getAllByText("Services").length).toBe(1);
  });

  it("selector de idioma: abre listbox y cambia a español", async () => {
    renderWith(<Navbar />, { initialEntries: ["/"] });
    const langBtn = screen.getByRole("button", { name: /Language/ });
    fireEvent.click(langBtn);
    expect(langBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Español" }));
    // Tras cambiar, los textos de la navbar deben estar en español.
    // Usamos findByText (espera con timeout) en lugar de waitFor+getByText.
    expect(await screen.findByText("Servicios", {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it("selector de idioma: persiste en localStorage", () => {
    renderWith(<Navbar />, { initialEntries: ["/"], locale: "es" });
    expect(window.localStorage.getItem("gs_locale")).toBe("es");
  });

  it("selector de idioma: cierra con Escape", () => {
    renderWith(<Navbar />, { initialEntries: ["/"] });
    const langBtn = screen.getByRole("button", { name: /Language/ });
    fireEvent.click(langBtn);
    expect(langBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(langBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("selector de idioma: cierra al hacer clic fuera", () => {
    renderWith(
      <div>
        <Navbar />
        <div data-testid="outside">fuera</div>
      </div>,
      { initialEntries: ["/"] },
    );
    const langBtn = screen.getByRole("button", { name: /Language/ });
    fireEvent.click(langBtn);
    expect(langBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(langBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("traduce los enlaces al español cuando locale es es", () => {
    renderWith(<Navbar />, { initialEntries: ["/"], locale: "es" });
    expect(screen.getByText("Servicios")).toBeInTheDocument();
    expect(screen.getByText("Cómo funciona")).toBeInTheDocument();
    expect(screen.getByText("Por qué elegirnos")).toBeInTheDocument();
    expect(screen.getByText("Cobertura")).toBeInTheDocument();
  });
});
