import * as React from 'react';

export interface IconButtonProps {
  /** The icon node (SVG, <i>, etc.) */
  children?: React.ReactNode;
  variant?: 'solid' | 'accent' | 'soft' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible label — required for icon-only buttons. */
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/** Circular, icon-only button. */
export function IconButton(props: IconButtonProps): JSX.Element;
