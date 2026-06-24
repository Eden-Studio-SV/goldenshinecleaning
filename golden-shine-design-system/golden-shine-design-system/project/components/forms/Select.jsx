import React from 'react';

/**
 * Golden Shine — Select
 * Native select styled to match the Input field, with a chevron.
 */
export function Select({ label, value, defaultValue, onChange, options = [], placeholder, disabled = false, id, style = {} }) {
  const [focused, setFocused] = React.useState(false);
  const selectId = id || (label ? 'gs-sel-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const wrap = { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style };
  const labelStyle = { fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' };
  const field = {
    position: 'relative', display: 'flex', alignItems: 'center',
    height: 50, background: disabled ? 'var(--ink-100)' : 'var(--white)',
    border: '1.5px solid ' + (focused ? 'var(--coral-400)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focused ? '0 0 0 4px rgba(242,107,78,0.15)' : 'var(--shadow-xs)',
    transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
  };
  const selectStyle = {
    appearance: 'none', WebkitAppearance: 'none', border: 'none', outline: 'none',
    background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 15,
    color: 'var(--text-strong)', padding: '0 40px 0 16px', height: '100%', width: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
  return (
    <div style={wrap}>
      {label && <label htmlFor={selectId} style={labelStyle}>{label}</label>}
      <div style={field}>
        <select id={selectId} value={value} defaultValue={defaultValue} onChange={onChange}
          disabled={disabled} style={selectStyle}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: 14, pointerEvents: 'none' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
