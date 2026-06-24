import * as React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. primary = navy, accent = coral CTA, secondary = outline, ghost = bare. */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Pill-shaped action button in the Golden Shine brand.
 * @startingPoint section="Buttons" subtitle="Navy & coral pill buttons" viewport="700x140"
 */
export function Button(props: ButtonProps): JSX.Element;
