import React from 'react';

/**
 * Golden Shine — Button
 * Primary action uses brand navy; the coral "accent" variant is the
 * high-energy CTA pulled straight from the spray-bottle color.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 14px', height: 36, fontSize: 14, gap: 7 },
    md: { padding: '0 20px', height: 46, fontSize: 15, gap: 8 },
    lg: { padding: '0 28px', height: 56, fontSize: 17, gap: 10 },
  };
  const variants = {
    primary: {
      background: 'var(--navy-700)', color: 'var(--cream-100)',
      border: '1px solid var(--navy-700)', boxShadow: 'var(--shadow-sm)',
    },
    accent: {
      background: 'var(--coral-500)', color: 'var(--cream-100)',
      border: '1px solid var(--coral-500)', boxShadow: 'var(--shadow-coral)',
    },
    secondary: {
      background: 'var(--white)', color: 'var(--navy-700)',
      border: '1.5px solid var(--navy-700)', boxShadow: 'none',
    },
    ghost: {
      background: 'transparent', color: 'var(--navy-700)',
      border: '1px solid transparent', boxShadow: 'none',
    },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: s.gap, height: s.height, padding: s.padding,
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: s.fontSize,
    lineHeight: 1, letterSpacing: '0.01em',
    borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    WebkitTapHighlightColor: 'transparent',
    ...v, ...style,
  };

  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; };
  const onUp = (e) => { e.currentTarget.style.transform = 'scale(1)'; };
  const onEnter = (e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.06)'; };
  const onLeave = (e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scale(1)'; };

  return (
    <button
      type={type} disabled={disabled} onClick={onClick} style={base}
      onMouseDown={onDown} onMouseUp={onUp} onMouseEnter={onEnter} onMouseLeave={onLeave}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
