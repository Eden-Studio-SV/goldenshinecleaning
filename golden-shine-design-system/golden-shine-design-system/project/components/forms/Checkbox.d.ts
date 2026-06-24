import * as React from 'react';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Checkbox with coral fill — controlled or uncontrolled. */
export function Checkbox(props: CheckboxProps): JSX.Element;
