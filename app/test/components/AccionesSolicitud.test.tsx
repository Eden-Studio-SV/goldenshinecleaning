import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { makeSolicitud, mockSolicitudesModule } from "./mocks";
import { AccionesSolicitud } from "@/features/agendamiento/AccionesSolicitud";
import { renderWith } from "./helpers";

beforeEach(() => {
  window.localStorage.clear();
  mockSolicitudesModule();
});
afterEach(() => {
  vi.clearAllMocks();
});

// Las funciones de solicitudes se mockean en mocks.tsx para no tocar Firestore.

describe("AccionesSolicitud — rol admin", () => {
  it("muestra Confirmar, Proponer y Rechazar en estado pendiente", () => {
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" />);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Propose another date")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("traduce al español", () => {
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" />, { locale: "es" });
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
    expect(screen.getByText("Proponer otra fecha")).toBeInTheDocument();
    expect(screen.getByText("Rechazar")).toBeInTheDocument();
  });

  it("ejecuta confirmarSolicitud al clic en Confirm", async () => {
    const { confirmarSolicitud } = await import("@/lib/solicitudes");
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" onDone={vi.fn()} />);
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => {
      expect(confirmarSolicitud).toHaveBeenCalledWith("sol-1");
    });
  });

  it("muestra formulario de rechazo al clic en Reject", async () => {
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" />);
    fireEvent.click(screen.getByText("Reject"));
    expect(screen.getByText(/Reason \(optional\)|Motivo \(opcional\)/)).toBeInTheDocument();
    expect(screen.getByText(/Confirm rejection|Confirmar rechazo/)).toBeInTheDocument();
  });

  it("muestra formulario de proponer fecha al clic en Propose", async () => {
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" />);
    fireEvent.click(screen.getByText("Propose another date"));
    expect(screen.getByText(/New date|Nueva fecha/)).toBeInTheDocument();
    expect(screen.getByText(/New time|Nueva hora/)).toBeInTheDocument();
    expect(screen.getByText(/Send proposal|Enviar propuesta/)).toBeInTheDocument();
  });

  it("muestra Marcar completada y Cancelar en estado agendada", () => {
    const s = makeSolicitud({ estado: "agendada" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" />);
    expect(screen.getByText("Mark as completed")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("no muestra acciones en estado completada", () => {
    const s = makeSolicitud({ estado: "completada" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" />);
    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });
});

describe("AccionesSolicitud — rol cliente", () => {
  it("muestra solo Cancelar en estado pendiente", () => {
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
  });

  it("muestra Pedir otra fecha y Cancelar en estado agendada", () => {
    const s = makeSolicitud({ estado: "agendada" });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />);
    expect(screen.getByText("Request another date")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("traduce al español en rol cliente", () => {
    const s = makeSolicitud({ estado: "agendada" });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />, { locale: "es" });
    expect(screen.getByText("Pedir otra fecha")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });
});

describe("AccionesSolicitud — propuestas", () => {
  it("muestra Aceptar/Rechazar propuesta cuando el admin propuso y el cliente responde", () => {
    const s = makeSolicitud({
      estado: "reprogramacion",
      propuesta: { fecha: "2026-11-01", hora: "11:00", por: "admin" },
    });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />);
    expect(screen.getByText("Accept new date")).toBeInTheDocument();
    expect(screen.getByText("Reject proposal")).toBeInTheDocument();
  });

  it("muestra aviso de 'esperando confirmación' cuando el cliente propuso", () => {
    const s = makeSolicitud({
      estado: "reprogramacion",
      propuesta: { fecha: "2026-11-01", hora: "11:00", por: "cliente" },
    });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />);
    expect(screen.getByText(/Waiting for the other party|Esperando confirmación/)).toBeInTheDocument();
  });

  it("muestra aviso 'Golden Shine propone' cuando el admin propuso y el cliente ve", () => {
    const s = makeSolicitud({
      estado: "reprogramacion",
      propuesta: { fecha: "2026-11-01", hora: "11:00", por: "admin" },
    });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />);
    expect(screen.getByText(/Golden Shine proposes|Golden Shine propone/)).toBeInTheDocument();
  });

  it("ejecuta aceptarPropuesta con rol explícito", async () => {
    const { aceptarPropuesta } = await import("@/lib/solicitudes");
    const s = makeSolicitud({
      estado: "reprogramacion",
      propuesta: { fecha: "2026-11-01", hora: "11:00", por: "admin" },
    });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" onDone={vi.fn()} />);
    fireEvent.click(screen.getByText("Accept new date"));
    await waitFor(() => {
      expect(aceptarPropuesta).toHaveBeenCalledWith(s, "cliente");
    });
  });

  it("ejecuta rechazarPropuesta con rol explícito (tras confirmar)", async () => {
    const { rechazarPropuesta } = await import("@/lib/solicitudes");
    const s = makeSolicitud({
      estado: "reprogramacion",
      propuesta: { fecha: "2026-11-01", hora: "11:00", por: "admin" },
    });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" onDone={vi.fn()} />);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByText("Reject proposal"));
    await waitFor(() => {
      expect(rechazarPropuesta).toHaveBeenCalledWith(s, "cliente");
    });
    confirmSpy.mockRestore();
  });
});

describe("AccionesSolicitud — cancelar con confirmación", () => {
  it("no cancela si el usuario rechaza el confirm", async () => {
    const { cancelarSolicitud } = await import("@/lib/solicitudes");
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" />);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    fireEvent.click(screen.getByText("Cancel"));
    expect(cancelarSolicitud).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("cancela si el usuario acepta el confirm", async () => {
    const { cancelarSolicitud } = await import("@/lib/solicitudes");
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="cliente" onDone={vi.fn()} />);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(cancelarSolicitud).toHaveBeenCalled();
    });
    confirmSpy.mockRestore();
  });
});

describe("AccionesSolicitud — errores", () => {
  it("muestra error si la acción falla", async () => {
    mockSolicitudesModule({ confirmarSolicitud: vi.fn().mockRejectedValue(new Error("fail")) });
    const s = makeSolicitud({ estado: "pendiente" });
    renderWith(<AccionesSolicitud solicitud={s} rol="admin" onDone={vi.fn()} />);
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => {
      expect(
        screen.getByText(/Could not complete the action|No se pudo completar la acción/),
      ).toBeInTheDocument();
    });
  });
});
