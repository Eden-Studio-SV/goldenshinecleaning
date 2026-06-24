import React from 'react';

/**
 * Golden Shine — Avatar
 * Circular avatar with image or initials fallback. Initials sit on a navy ground.
 */
export function Avatar({ src, name = '', size = 'md', style = {} }) {
  const sizes = { sm: 36, md: 48, lg: 64, xl: 88 };
  const dim = sizes[size] || sizes.md;
  const initials = name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const base = {
    width: dim, height: dim, borderRadius: 'var(--radius-circle)',
    flex: 'none', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--navy-700)', color: 'var(--cream-100)',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: dim * 0.38,
    border: '2px solid var(--white)', boxShadow: 'var(--shadow-sm)', ...style,
  };
  return (
    <div style={base} aria-label={name || undefined}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span>{initials || '★'}</span>}
    </div>
  );
}
