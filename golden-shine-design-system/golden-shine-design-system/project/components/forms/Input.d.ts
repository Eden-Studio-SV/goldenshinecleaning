import * as React from 'react';

export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error message — turns the field red and shows below. */
  error?: string;
  /** Helper text shown below when there is no error. */
  helper?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Labeled text input with focus ring, helper and error states. */
export function Input(props: InputProps): JSX.Element;
