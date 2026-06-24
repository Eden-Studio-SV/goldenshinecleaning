import React from 'react';

/**
 * Golden Shine — Checkbox
 * Square check with coral fill when selected. Use for service add-ons, consents.
 */
export function Checkbox({ label, checked, defaultChecked, onChange, disabled = false, id, style = {} }) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  const inputId = id || (label ? 'gs-cb-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const wrap = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-body)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, ...style,
  };
  const box = {
    width: 22, height: 22, flex: 'none', borderRadius: 'var(--radius-xs)',
    border: on ? '1.5px solid var(--coral-500)' : '1.5px solid var(--border-strong)',
    background: on ? 'var(--coral-500)' : 'var(--white)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all var(--dur-fast) var(--ease-out)',
  };
  return (
    <label htmlFor={inputId} style={wrap}>
      <input id={inputId} type="checkbox" checked={on} onChange={toggle} disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={box}>
        {on && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-100)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
