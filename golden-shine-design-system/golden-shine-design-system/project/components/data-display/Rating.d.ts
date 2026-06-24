import * as React from 'react';

export interface RatingProps {
  /** Rating value, supports halves (e.g. 4.5). */
  value?: number;
  max?: number;
  /** Star size in px. */
  size?: number;
  /** Show the numeric value beside the stars. */
  showValue?: boolean;
  style?: React.CSSProperties;
}

/** Coral star rating display (read-only). */
export function Rating(props: RatingProps): JSX.Element;
