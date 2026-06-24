import * as React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Option list — strings or {value,label} objects. */
  options?: Array<string | SelectOption>;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Styled native select matching the Input field. */
export function Select(props: SelectProps): JSX.Element;
