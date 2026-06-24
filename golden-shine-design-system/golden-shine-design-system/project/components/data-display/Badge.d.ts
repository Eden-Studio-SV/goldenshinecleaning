import * as React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'navy' | 'coral' | 'cream' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Solid fill instead of the default soft tint. */
  solid?: boolean;
  style?: React.CSSProperties;
}

/** Small pill label for status, tags, and highlights. */
export function Badge(props: BadgeProps): JSX.Element;
