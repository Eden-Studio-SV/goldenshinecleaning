import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { EstadoBadge } from "@/components/ui/Badge";
import { renderWith } from "./helpers";
import type { EstadoSolicitud } from "@/types";

describe("EstadoBadge", () => {
  it("muestra el label en inglés por defecto (locale en)", () => {
    renderWith(<EstadoBadge estado="pendiente" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("muestra el label en español cuando locale es", () => {
    renderWith(<EstadoBadge estado="agendada" />, { locale: "es" });
    expect(screen.getByText("Agendada")).toBeInTheDocument();
  });

  it("traduce todos los estados en inglés", () => {
    const casos: [EstadoSolicitud, string][] = [
      ["pendiente", "Pending"],
      ["agendada", "Scheduled"],
      ["reprogramacion", "To confirm"],
      ["completada", "Completed"],
      ["rechazada", "Rejected"],
      ["cancelada", "Cancelled"],
    ];
    for (const [estado, label] of casos) {
      const { unmount } = renderWith(<EstadoBadge estado={estado} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it("traduce todos los estados en español", () => {
    const casos: [EstadoSolicitud, string][] = [
      ["pendiente", "Pendiente"],
      ["agendada", "Agendada"],
      ["reprogramacion", "Por confirmar"],
      ["completada", "Completada"],
      ["rechazada", "Rechazada"],
      ["cancelada", "Cancelada"],
    ];
    for (const [estado, label] of casos) {
      const { unmount } = renderWith(<EstadoBadge estado={estado} />, { locale: "es" });
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it("aplica clases de estilo según el estado", () => {
    const { container } = renderWith(<EstadoBadge estado="completada" />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("bg-green-100");
  });
});