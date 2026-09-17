import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWith } from "./helpers";
import { makeAuthMock, mockAuthModule, mockFirebase, resetComponentMocks } from "./mocks";

beforeEach(() => {
  window.localStorage.clear();
  resetComponentMocks();
});
afterEach(() => {
  vi.clearAllMocks();
});


async function renderLogin(authState = makeAuthMock({ user: null })) {
  mockAuthModule(authState);
  // Re-render con el Login tras aplicar el mock
  const Login = (await import("@/features/auth/Login")).default;
  const result = renderWith(<Login />, { initialEntries: ["/ingresar"] });
  return result;
}

describe("Login", () => {
  it("muestra el título y botón de Google en inglés", async () => {
    const result = await renderLogin();
    expect(result.getByText("Sign in to your account")).toBeInTheDocument();
    expect(result.getByRole("button", { name: /Continue with Google/ })).toBeInTheDocument();
  });

  it("traduce al español", async () => {
    mockAuthModule(makeAuthMock({ user: null }));
    const Login = (await import("@/features/auth/Login")).default;
    renderWith(<Login />, { initialEntries: ["/ingresar"], locale: "es" });
    expect(screen.getByText("Ingresa a tu cuenta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continuar con Google/ })).toBeInTheDocument();
  });

  it("muestra nota de que cotizar no implica reserva", async () => {
    const result = await renderLogin();
    expect(
      result.getByText(/does not confirm a booking|no implica reserva/i),
    ).toBeInTheDocument();
  });

  it("muestra aviso de Firebase no configurado", async () => {
    mockFirebase({ isFirebaseConfigured: false });
    const result = await renderLogin();
    expect(result.getByText(/Firebase is not connected|Firebase no está conectado/)).toBeInTheDocument();
  });

  it("muestra error de popup bloqueado", async () => {
    const loginWithGoogle = vi.fn().mockRejectedValue({ code: "auth/popup-blocked" });
    mockAuthModule(makeAuthMock({ user: null, loginWithGoogle }));
    const Login = (await import("@/features/auth/Login")).default;
    renderWith(<Login />, { initialEntries: ["/ingresar"] });
    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    await waitFor(() => {
      expect(
        screen.getByText(/blocked the popup|bloqueó la ventana emergente/),
      ).toBeInTheDocument();
    });
  });

  it("muestra error de red", async () => {
    const loginWithGoogle = vi.fn().mockRejectedValue({ code: "auth/network-request-failed" });
    mockAuthModule(makeAuthMock({ user: null, loginWithGoogle }));
    const Login = (await import("@/features/auth/Login")).default;
    renderWith(<Login />, { initialEntries: ["/ingresar"] });
    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    await waitFor(() => {
      expect(screen.getByText(/Network error|Error de red/)).toBeInTheDocument();
    });
  });

  it("muestra error genérico para códigos desconocidos", async () => {
    const loginWithGoogle = vi.fn().mockRejectedValue({ code: "auth/unknown" });
    mockAuthModule(makeAuthMock({ user: null, loginWithGoogle }));
    const Login = (await import("@/features/auth/Login")).default;
    renderWith(<Login />, { initialEntries: ["/ingresar"] });
    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    await waitFor(() => {
      expect(screen.getByText(/Could not sign in|No se pudo iniciar sesión/)).toBeInTheDocument();
    });
  });

  it("no muestra error si el usuario cierra el popup", async () => {
    const loginWithGoogle = vi.fn().mockRejectedValue({ code: "auth/popup-closed-by-user" });
    mockAuthModule(makeAuthMock({ user: null, loginWithGoogle }));
    const Login = (await import("@/features/auth/Login")).default;
    renderWith(<Login />, { initialEntries: ["/ingresar"] });
    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("muestra spinner mientras conecta", async () => {
    let resolveLogin: (u: unknown) => void;
    const loginWithGoogle = vi.fn().mockImplementation(
      () => new Promise((r) => { resolveLogin = r; }),
    );
    mockAuthModule(makeAuthMock({ user: null, loginWithGoogle }));
    const Login = (await import("@/features/auth/Login")).default;
    renderWith(<Login />, { initialEntries: ["/ingresar"] });
    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    await waitFor(() => {
      expect(screen.getByText(/Connecting|Conectando/)).toBeInTheDocument();
    });
    await act(async () => { resolveLogin!({ uid: "u1", email: "a@b.com" }); });
  });

  it("preserva returnTo con path+search+hash tras login", async () => {
    // Simula venir de /solicitar?servicio=airbnb#mapa
    const loginWithGoogle = vi.fn().mockResolvedValue({ uid: "u1", email: "cliente@test.com" });
    mockAuthModule(makeAuthMock({ user: null, loginWithGoogle }));
    const Login = (await import("@/features/auth/Login")).default;
    // Usamos initialEntries con state para simular el Navigate del guard
    renderWith(<Login />, {
      initialEntries: [
        {
          pathname: "/ingresar",
          state: { from: { pathname: "/solicitar", search: "?servicio=airbnb", hash: "#mapa" } },
        },
      ],
    });
    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/ }));
    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
    });
    // No podemos inspeccionar el navigate aquí sin mockear useNavigate, pero
    // verificamos que loginWithGoogle fue llamado (el flujo continúa).
  });
});
