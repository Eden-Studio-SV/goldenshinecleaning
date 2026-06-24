import React from 'react';

/**
 * Golden Shine — Input
 * Text field with optional label, helper/error text, and leading icon.
 */
export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  helper,
  leftIcon = null,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const inputId = id || (label ? 'gs-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [focused, setFocused] = React.useState(false);
  const borderColor = error
    ? 'var(--danger-500)'
    : focused ? 'var(--coral-400)' : 'var(--border-default)';

  const wrap = { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style };
  const labelStyle = { fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' };
  const field = {
    display: 'flex', alignItems: 'center', gap: 10,
    height: 50, padding: '0 16px',
    background: disabled ? 'var(--ink-100)' : 'var(--white)',
    border: '1.5px solid ' + borderColor,
    borderRadius: 'var(--radius-md)',
    boxShadow: focused ? '0 0 0 4px rgba(242,107,78,0.15)' : 'var(--shadow-xs)',
    transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
  };
  const inputStyle = {
    flex: 1, border: 'none', outline: 'none', background: 'transparent',
    fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-strong)',
    width: '100%', minWidth: 0,
  };
  const msg = { fontSize: 13, color: error ? 'var(--danger-600)' : 'var(--text-muted)' };

  return (
    <div style={wrap}>
      {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
      <div style={field}>
        {leftIcon && <span style={{ display: 'flex', color: 'var(--text-faint)' }}>{leftIcon}</span>}
        <input
          id={inputId} type={type} placeholder={placeholder} value={value}
          defaultValue={defaultValue} onChange={onChange} disabled={disabled} style={inputStyle}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} {...rest}
        />
      </div>
      {(error || helper) && <span style={msg}>{error || helper}</span>}
    </div>
  );
}
