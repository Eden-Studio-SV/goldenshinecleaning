import React from 'react';

/**
 * Golden Shine — IconButton
 * Circular icon-only button. Pass an SVG/icon node as children.
 */
export function IconButton({
  children,
  variant = 'soft',
  size = 'md',
  disabled = false,
  label,
  onClick,
  style = {},
  ...rest
}) {
  const sizes = { sm: 36, md: 44, lg: 52 };
  const dim = sizes[size] || sizes.md;
  const variants = {
    solid: { background: 'var(--navy-700)', color: 'var(--cream-100)', border: 'none' },
    accent: { background: 'var(--coral-500)', color: 'var(--cream-100)', border: 'none' },
    soft: { background: 'var(--navy-100)', color: 'var(--navy-700)', border: 'none' },
    ghost: { background: 'transparent', color: 'var(--navy-700)', border: '1px solid var(--border-default)' },
  };
  const v = variants[variant] || variants.soft;
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: dim, height: dim, borderRadius: 'var(--radius-circle)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
    WebkitTapHighlightColor: 'transparent', padding: 0, ...v, ...style,
  };
  return (
    <button
      type="button" aria-label={label} disabled={disabled} onClick={onClick} style={base}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.92)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
