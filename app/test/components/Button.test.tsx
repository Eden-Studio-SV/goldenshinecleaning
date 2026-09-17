import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { renderWith } from "./helpers";

describe("Button", () => {
  it("renderiza con texto y tipo button por defecto", () => {
    renderWith(<Button>Enviar</Button>);
    const btn = screen.getByRole("button", { name: "Enviar" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("respeta type=submit", () => {
    renderWith(<Button type="submit">Guardar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("aplica variant y size como clases", () => {
    renderWith(<Button variant="gold" size="lg">Grande</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("btn-gold");
    expect(btn.className).toContain("btn-lg");
  });

  it("invoca onClick al hacer clic", () => {
    const onClick = vi.fn();
    renderWith(<Button onClick={onClick}>Clic</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("no invoca onClick cuando disabled", () => {
    const onClick = vi.fn();
    renderWith(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("acepta className adicional", () => {
    renderWith(<Button className="extra-class">X</Button>);
    expect(screen.getByRole("button").className).toContain("extra-class");
  });
});