import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWith } from "./helpers";
import {
  makeAuthMock,
  mockAuthModule,
  mockSolicitudesModule,
  mockLeafletModule,
  resetComponentMocks,
} from "./mocks";

beforeEach(() => {
  window.localStorage.clear();
  resetComponentMocks();
});
afterEach(() => {
  vi.clearAllMocks();
});

mockLeafletModule();

async function renderForm(opts: {
  crearSolicitud?: ReturnType<typeof vi.fn>;
  authState?: ReturnType<typeof makeAuthMock>;
  initialEntries?: string[];
} = {}) {
  const crearSolicitud = opts.crearSolicitud ?? vi.fn().mockResolvedValue("sol-123");
  mockSolicitudesModule({ crearSolicitud });
  mockAuthModule(opts.authState ?? makeAuthMock());
  const Form = (await import("@/features/agendamiento/FormularioSolicitud")).default;
  return renderWith(<Form />, { initialEntries: opts.initialEntries ?? ["/solicitar"] });
}

describe("FormularioSolicitud", () => {
  it("muestra el título y campos en inglés", async () => {
    const result = await renderForm();
    expect(result.getByText("Request your cleaning")).toBeInTheDocument();
    expect(result.getByText("Full name")).toBeInTheDocument();
    expect(result.getByText("Phone")).toBeInTheDocument();
    expect(result.getByText("Email")).toBeInTheDocument();
    expect(result.getByText("Address")).toBeInTheDocument();
  });

  it("traduce al español", async () => {
    mockSolicitudesModule({ crearSolicitud: vi.fn().mockResolvedValue("sol-123") });
    mockAuthModule(makeAuthMock());
    const Form = (await import("@/features/agendamiento/FormularioSolicitud")).default;
    renderWith(<Form />, { initialEntries: ["/solicitar"], locale: "es" });
    expect(screen.getByText("Solicita tu limpieza")).toBeInTheDocument();
    expect(screen.getByText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByText("Teléfono")).toBeInTheDocument();
  });

  it("muestra nota de que cotizar no implica reserva", async () => {
    const result = await renderForm();
    expect(
      result.getByText(/does not confirm a booking|no implica reserva/i),
    ).toBeInTheDocument();
  });

  it("muestra error de validación al enviar vacío", async () => {
    const result = await renderForm();
    const submit = result.getByRole("button", { name: /Request cleaning/ });
    fireEvent.click(submit);
    await waitFor(() => {
      // Al menos un mensaje de error de validación
      const alerts = result.container.querySelectorAll('[role="alert"]');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it("envía correctamente con datos válidos y navega a confirmación", async () => {
    const crearSolicitud = vi.fn().mockResolvedValue("sol-999");
    const result = await renderForm({ crearSolicitud });
    // Llenar campos
    fireEvent.change(result.getByLabelText(/Full name/), { target: { value: "Ana Pérez" } });
    fireEvent.change(result.getByLabelText(/Phone/), { target: { value: "(617) 123-4567" } });
    fireEvent.change(result.getByLabelText(/Email/), { target: { value: "ana@test.com" } });
    fireEvent.change(result.getByLabelText(/Address/), { target: { value: "123 Main St, Boston" } });
    fireEvent.change(result.getByLabelText(/Preferred date/), { target: { value: "2026-10-16" } });
    fireEvent.change(result.getByLabelText(/Preferred time/), { target: { value: "10:00" } });
    // Seleccionar tipo de servicio (radio)
    const residencialInput = result.container.querySelector('input[value="residencial"]');
    fireEvent.click(residencialInput!);
    // Enviar
    fireEvent.click(result.getByRole("button", { name: /Request cleaning/ }));
    await waitFor(() => {
      expect(crearSolicitud).toHaveBeenCalled();
    });
    // El primer argumento debe incluir los datos del formulario
    const arg = crearSolicitud.mock.calls[0][0];
    expect(arg.nombre).toBe("Ana Pérez");
    expect(arg.email).toBe("ana@test.com");
    expect(arg.locale).toBe("en");
  });

  it("envía el locale español actual", async () => {
    const crearSolicitud = vi.fn().mockResolvedValue("sol-es");
    mockSolicitudesModule({ crearSolicitud });
    mockAuthModule(makeAuthMock());
    const Form = (await import("@/features/agendamiento/FormularioSolicitud")).default;
    const result = renderWith(<Form />, { initialEntries: ["/solicitar"], locale: "es" });
    fireEvent.change(result.getByLabelText(/Nombre completo/), { target: { value: "Ana Pérez" } });
    fireEvent.change(result.getByLabelText(/Teléfono/), { target: { value: "(617) 123-4567" } });
    fireEvent.change(result.getByLabelText(/Correo/), { target: { value: "ana@test.com" } });
    fireEvent.change(result.getByLabelText(/Dirección/), { target: { value: "123 Main St, Boston" } });
    fireEvent.change(result.getByLabelText(/Fecha deseada/), { target: { value: "2026-10-16" } });
    fireEvent.change(result.getByLabelText(/Hora deseada/), { target: { value: "10:00" } });
    fireEvent.click(result.container.querySelector('input[value="residencial"]')!);
    fireEvent.click(result.getByRole("button", { name: /Solicitar limpieza/ }));

    await waitFor(() => expect(crearSolicitud).toHaveBeenCalled());
    expect(crearSolicitud.mock.calls[0][0].locale).toBe("es");
  });

  it("muestra error de servidor si crearSolicitud falla", async () => {
    const crearSolicitud = vi.fn().mockRejectedValue(new Error("fail"));
    const result = await renderForm({ crearSolicitud });
    fireEvent.change(result.getByLabelText(/Full name/), { target: { value: "Ana Pérez" } });
    fireEvent.change(result.getByLabelText(/Phone/), { target: { value: "(617) 123-4567" } });
    fireEvent.change(result.getByLabelText(/Email/), { target: { value: "ana@test.com" } });
    fireEvent.change(result.getByLabelText(/Address/), { target: { value: "123 Main St, Boston" } });
    fireEvent.change(result.getByLabelText(/Preferred date/), { target: { value: "2026-10-16" } });
    fireEvent.change(result.getByLabelText(/Preferred time/), { target: { value: "10:00" } });
    fireEvent.click(result.container.querySelector('input[value="residencial"]')!);
    fireEvent.click(result.getByRole("button", { name: /Request cleaning/ }));
    await waitFor(() => {
      expect(
        result.getByText(/couldn't send|No pudimos enviar/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra error de sesión si no hay user al enviar", async () => {
    const crearSolicitud = vi.fn().mockResolvedValue("sol-1");
    mockSolicitudesModule({ crearSolicitud });
    mockAuthModule(makeAuthMock({ user: null }));
    const Form = (await import("@/features/agendamiento/FormularioSolicitud")).default;
    const result = renderWith(<Form />, { initialEntries: ["/solicitar"] });
    fireEvent.change(result.getByLabelText(/Full name/), { target: { value: "Ana Pérez" } });
    fireEvent.change(result.getByLabelText(/Phone/), { target: { value: "(617) 123-4567" } });
    fireEvent.change(result.getByLabelText(/Email/), { target: { value: "ana@test.com" } });
    fireEvent.change(result.getByLabelText(/Address/), { target: { value: "123 Main St, Boston" } });
    fireEvent.change(result.getByLabelText(/Preferred date/), { target: { value: "2026-10-16" } });
    fireEvent.change(result.getByLabelText(/Preferred time/), { target: { value: "10:00" } });
    fireEvent.click(result.container.querySelector('input[value="residencial"]')!);
    fireEvent.click(result.getByRole("button", { name: /Request cleaning/ }));
    await waitFor(() => {
      expect(
        result.getByText(/session expired|sesión expiró/i),
      ).toBeInTheDocument();
    });
  });

  it("muestra el mapa como fallback de ubicación (opcional)", async () => {
    const result = await renderForm();
    // El mapa se mockea con data-testid="map-container"
    expect(result.getByTestId("map-container")).toBeInTheDocument();
    // El texto de "sin ubicación" debe aparecer
    expect(
      result.getByText(/No map location yet|Aún sin ubicación/i),
    ).toBeInTheDocument();
  });

  it("email es obligatorio (validación)", async () => {
    const result = await renderForm({
      authState: makeAuthMock({ user: { uid: "uid-1", email: null, displayName: null } }),
    });
    fireEvent.change(result.getByLabelText(/Full name/), { target: { value: "Ana" } });
    fireEvent.change(result.getByLabelText(/Phone/), { target: { value: "(617) 123-4567" } });
    fireEvent.change(result.getByLabelText(/Address/), { target: { value: "123 Main St, Boston" } });
    fireEvent.change(result.getByLabelText(/Preferred date/), { target: { value: "2026-10-16" } });
    fireEvent.change(result.getByLabelText(/Preferred time/), { target: { value: "10:00" } });
    fireEvent.click(result.container.querySelector('input[value="residencial"]')!);
    // Email vacío
    fireEvent.click(result.getByRole("button", { name: /Request cleaning/ }));
    await waitFor(() => {
      expect(
        result.getByText(/Enter your email|Ingresa tu correo/i),
      ).toBeInTheDocument();
    });
  });

  it("aplica una frecuencia válida desde la URL y descarta una inválida", async () => {
    const semanal = await renderForm({
      initialEntries: ["/solicitar?servicio=residencial&frecuencia=semanal"],
    });
    expect(semanal.container.querySelector('input[name="frecuencia"][value="semanal"]')).toBeChecked();
    semanal.unmount();

    const invalida = await renderForm({ initialEntries: ["/solicitar?frecuencia=diaria"] });
    expect(invalida.container.querySelector('input[name="frecuencia"][value="unica"]')).toBeChecked();
  });
});
