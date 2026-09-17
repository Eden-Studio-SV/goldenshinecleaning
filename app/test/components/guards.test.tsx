import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { makeAuthMock, mockAuthModule } from "./mocks";
import { RequireAuth, RequireAdmin } from "@/features/auth/guards";
import { renderWith } from "./helpers";

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  vi.clearAllMocks();
});


describe("RequireAuth", () => {
  it("muestra loader mientras loading", () => {
    mockAuthModule(makeAuthMock({ loading: true, user: null }));
    const { container } = renderWith(
      <RequireAuth>
        <div>contenido protegido</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("contenido protegido")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("redirige a /ingresar si no hay user, preservando la ubicación", () => {
    mockAuthModule(makeAuthMock({ loading: false, user: null }));
    renderWith(
      <Routes>
        <Route path="/solicitar" element={<RequireAuth><div>protegido</div></RequireAuth>} />
        <Route path="/ingresar" element={<LocationProbe />} />
      </Routes>,
      { initialEntries: ["/solicitar?servicio=airbnb#mapa"] },
    );
    expect(screen.queryByText("protegido")).not.toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/ingresar|/solicitar?servicio=airbnb#mapa");
  });

  it("renderiza el contenido si hay user", () => {
    mockAuthModule(makeAuthMock({ loading: false, user: { uid: "u1", email: "a@b.com", displayName: null } }));
    renderWith(
      <RequireAuth>
        <div>protegido</div>
      </RequireAuth>,
    );
    expect(screen.getByText("protegido")).toBeInTheDocument();
  });
});

describe("RequireAdmin", () => {
  it("redirige a /ingresar si no hay user", () => {
    mockAuthModule(makeAuthMock({ loading: false, user: null, isAdmin: false }));
    renderWith(
      <Routes>
        <Route path="/admin" element={<RequireAdmin><div>panel</div></RequireAdmin>} />
        <Route path="/ingresar" element={<LocationProbe />} />
      </Routes>,
      { initialEntries: ["/admin?filtro=pendiente#solicitudes"] },
    );
    expect(screen.queryByText("panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/ingresar|/admin?filtro=pendiente#solicitudes");
  });

  it("muestra pantalla de sin acceso si user no es admin", () => {
    mockAuthModule(
      makeAuthMock({
        loading: false,
        user: { uid: "u1", email: "cliente@test.com", displayName: "Cliente" },
        isAdmin: false,
      }),
    );
    renderWith(
      <RequireAdmin>
        <div>panel</div>
      </RequireAdmin>,
    );
    expect(screen.getByText(/Account without panel access|Cuenta sin acceso al panel/)).toBeInTheDocument();
    expect(screen.queryByText("panel")).not.toBeInTheDocument();
  });

  it("renderiza el contenido si es admin", () => {
    mockAuthModule(
      makeAuthMock({
        loading: false,
        user: { uid: "u1", email: "admin@test.com", displayName: "Admin" },
        isAdmin: true,
      }),
    );
    renderWith(
      <RequireAdmin>
        <div>panel admin</div>
      </RequireAdmin>,
    );
    expect(screen.getByText("panel admin")).toBeInTheDocument();
  });

  it("muestra el email del usuario no admin en el mensaje", () => {
    mockAuthModule(
      makeAuthMock({
        loading: false,
        user: { uid: "u1", email: "noadmin@test.com", displayName: null },
        isAdmin: false,
      }),
    );
    renderWith(
      <RequireAdmin>
        <div>x</div>
      </RequireAdmin>,
    );
    expect(screen.getByText(/noadmin@test.com/)).toBeInTheDocument();
  });
});

function LocationProbe() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  return <output data-testid="location">{`${location.pathname}|${from?.pathname ?? ""}${from?.search ?? ""}${from?.hash ?? ""}`}</output>;
}
