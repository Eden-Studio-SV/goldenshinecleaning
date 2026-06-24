import * as React from 'react';

export interface AvatarProps {
  src?: string;
  /** Used for initials fallback and alt text. */
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

/** Circular avatar with image or initials fallback. */
export function Avatar(props: AvatarProps): JSX.Element;
