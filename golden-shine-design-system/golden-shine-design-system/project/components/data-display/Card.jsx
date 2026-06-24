import React from 'react';

/**
 * Golden Shine — Card
 * Rounded white surface with soft navy-tinted shadow. Optional hover lift.
 */
export function Card({ children, padding = 'md', interactive = false, style = {}, ...rest }) {
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-6)' };
  const base = {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-sm)',
    padding: pads[padding] ?? pads.md,
    transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
    ...style,
  };
  const hover = interactive
    ? {
        onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; },
        onMouseLeave: (e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; },
      }
    : {};
  return <div style={base} {...hover} {...rest}>{children}</div>;
}
