import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Field } from "@/components/ui/Field";
import { renderWith } from "./helpers";

describe("Field", () => {
  it("renderiza label y asocia htmlFor con el input", () => {
    renderWith(
      <Field label="Nombre" htmlFor="nombre">
        <input id="nombre" type="text" />
      </Field>,
    );
    const input = screen.getByLabelText("Nombre");
    expect(input).toHaveAttribute("id", "nombre");
  });

  it("muestra el asterisco de requerido", () => {
    renderWith(
      <Field label="Teléfono" htmlFor="tel" required>
        <input id="tel" type="tel" />
      </Field>,
    );
    expect(screen.getByText(/Teléfono/)).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("muestra la pista (hint) con id asociado", () => {
    renderWith(
      <Field label="Correo" htmlFor="email" hint="(opcional)">
        <input id="email" type="email" />
      </Field>,
    );
    expect(screen.getByText("(opcional)")).toHaveAttribute("id", "email-hint");
  });

  it("muestra el error con role=alert y aria-describedby en el input", () => {
    renderWith(
      <Field label="Dirección" htmlFor="dir" error="Ingresa la dirección o ciudad">
        <input id="dir" type="text" />
      </Field>,
    );
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Ingresa la dirección o ciudad");
    expect(error).toHaveAttribute("id", "dir-error");
    const input = screen.getByLabelText("Dirección");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "dir-error");
  });

  it("no marca aria-invalid cuando no hay error", () => {
    renderWith(
      <Field label="Notas" htmlFor="notas">
        <textarea id="notas" />
      </Field>,
    );
    const textarea = screen.getByLabelText("Notas");
    expect(textarea).not.toHaveAttribute("aria-invalid", "true");
  });

  it("acepta controles y contenido auxiliar como children múltiples", () => {
    renderWith(
      <Field label="Notas" htmlFor="notas" error="Máximo 500 caracteres">
        <>
          <textarea id="notas" />
          <p>0/500</p>
        </>
      </Field>,
    );
    const textarea = screen.getByLabelText("Notas");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "notas-error");
    expect(screen.getByText("0/500")).not.toHaveAttribute("aria-invalid");
  });
});
