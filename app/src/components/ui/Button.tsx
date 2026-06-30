import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "gold" | "outline" | "ghost" | "peligro" | "exito";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  gold: "btn-gold",
  outline: "btn-outline",
  ghost: "btn-ghost",
  peligro: "btn-peligro",
  exito: "btn-exito",
};

const SIZE: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`btn ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    />
  );
});
