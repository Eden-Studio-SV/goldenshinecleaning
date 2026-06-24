import React from 'react';

/**
 * Golden Shine — Badge
 * Small status/label pill. Tones map to brand + semantic colors.
 */
export function Badge({ children, tone = 'navy', solid = false, style = {} }) {
  const tones = {
    navy:    { soft: ['var(--navy-100)', 'var(--navy-700)'], solid: ['var(--navy-700)', 'var(--cream-100)'] },
    coral:   { soft: ['var(--coral-100)', 'var(--coral-700)'], solid: ['var(--coral-500)', 'var(--cream-100)'] },
    cream:   { soft: ['var(--cream-200)', 'var(--navy-800)'], solid: ['var(--cream-200)', 'var(--navy-800)'] },
    success: { soft: ['var(--success-100)', 'var(--success-600)'], solid: ['var(--success-500)', 'var(--white)'] },
    warning: { soft: ['var(--warning-100)', 'var(--warning-600)'], solid: ['var(--warning-500)', 'var(--white)'] },
    danger:  { soft: ['var(--danger-100)', 'var(--danger-600)'], solid: ['var(--danger-500)', 'var(--white)'] },
    neutral: { soft: ['var(--ink-100)', 'var(--ink-700)'], solid: ['var(--ink-700)', 'var(--white)'] },
  };
  const t = tones[tone] || tones.navy;
  const [bg, fg] = solid ? t.solid : t.soft;
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: bg, color: fg,
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12.5,
    letterSpacing: '0.02em', lineHeight: 1, padding: '6px 12px',
    borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', ...style,
  };
  return <span style={base}>{children}</span>;
}
