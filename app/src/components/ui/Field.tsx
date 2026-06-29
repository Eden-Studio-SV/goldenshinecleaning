import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, required, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && <span className="ml-1 font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
