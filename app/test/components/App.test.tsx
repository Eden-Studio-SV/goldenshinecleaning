import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import App from "@/App";
import { renderWith } from "./helpers";
import { makeAuthMock, mockAuthModule, resetComponentMocks } from "./mocks";

function LocationProbe() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  return <output data-testid="location">{JSON.stringify({ pathname: location.pathname, from })}</output>;
}

function renderApp(initialEntries: string[]) {
  return renderWith(
    <>
      <App />
      <LocationProbe />
    </>,
    { initialEntries },
  );
}

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, "scrollTo", { configurable: true, value: vi.fn() });
  resetComponentMocks();
});

describe("App", () => {
  it("monta landing, navegación y pie públicos en /", () => {
    renderApp(["/"]);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Cleaning for your home, move, or short-term rental")).toBeInTheDocument();
    expect(screen.getAllByText("Boston, Massachusetts")).not.toHaveLength(0);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
  });

  it("redirige /solicitar sin sesión a login y conserva returnTo", async () => {
    mockAuthModule(makeAuthMock({ user: null }));
    renderApp(["/solicitar?servicio=residencial&frecuencia=semanal#formulario"]);
    expect(await screen.findByText("Sign in to your account")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("location")).toHaveTextContent('"pathname":"/ingresar"');
      expect(screen.getByTestId("location")).toHaveTextContent('"search":"?servicio=residencial&frecuencia=semanal"');
      expect(screen.getByTestId("location")).toHaveTextContent('"hash":"#formulario"');
    });
  });

  it("redirige /portal sin sesión a login", async () => {
    mockAuthModule(makeAuthMock({ user: null }));
    renderApp(["/portal"]);
    expect(await screen.findByText("Sign in to your account")).toBeInTheDocument();
  });

  it("niega /admin a un usuario que no es administrador", async () => {
    mockAuthModule(makeAuthMock({ isAdmin: false }));
    renderApp(["/admin"]);
    expect(await screen.findByText("Account without panel access")).toBeInTheDocument();
  });

  it("redirige una ruta desconocida a la landing", async () => {
    renderApp(["/ruta-inexistente"]);
    expect(await screen.findByText("Cleaning for your home, move, or short-term rental")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent('"pathname":"/"');
  });
});
