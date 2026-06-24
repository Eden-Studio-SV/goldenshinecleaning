import * as React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds a hover lift — use for clickable cards. */
  interactive?: boolean;
  style?: React.CSSProperties;
}

/** Rounded white surface with soft elevation. */
export function Card(props: CardProps): JSX.Element;
