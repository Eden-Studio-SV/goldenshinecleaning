import { describe, expect, it } from "vitest";
import { fechaFuturaDiaUTC } from "../../e2e/helpers/dates";

describe("fechaFuturaDiaUTC", () => {
  const ahora = new Date("2026-09-16T23:30:00.000Z");

  it("genera un viernes de calendario UTC con al menos siete días de margen", () => {
    const fecha = fechaFuturaDiaUTC(5, ahora);
    expect(fecha).toBe("2026-09-25");
    expect(new Date(`${fecha}T00:00:00.000Z`).getUTCDay()).toBe(5);
  });

  it("genera un sábado de calendario UTC sin desplazarlo al domingo", () => {
    const fecha = fechaFuturaDiaUTC(6, ahora);
    expect(fecha).toBe("2026-09-26");
    expect(new Date(`${fecha}T00:00:00.000Z`).getUTCDay()).toBe(6);
  });
});
