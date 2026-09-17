import { Children, Fragment, cloneElement, isValidElement, type ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, required, hint, children }: FieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  // Inyecta los atributos de accesibilidad solo en el control asociado. El
  // campo puede incluir contenido auxiliar (por ejemplo, un contador) junto al
  // input, incluso dentro de fragments.
  const enhanceControl = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (!isValidElement(child)) return child;

      if (child.type === Fragment) {
        return cloneElement(child, { children: enhanceControl(child.props.children) });
      }

      const isControl =
        typeof child.type === "string" && ["input", "textarea", "select"].includes(child.type);
      const isAssociated = !htmlFor || child.props.id === htmlFor;
      if (!isControl || !isAssociated) return child;

      return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      });
    });

  const enhanced = enhanceControl(children);

  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && (
          <span id={hintId} className="ml-1 font-normal text-gray-400">
            {hint}
          </span>
        )}
      </label>
      {enhanced}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
