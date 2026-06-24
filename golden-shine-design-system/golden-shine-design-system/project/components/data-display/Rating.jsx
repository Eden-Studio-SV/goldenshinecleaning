import React from 'react';

/**
 * Golden Shine — Rating
 * Star rating display (coral stars). Read-only by default; supports half stars.
 */
export function Rating({ value = 5, max = 5, size = 18, showValue = false, style = {} }) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const fill = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
    stars.push(fill);
  }
  const Star = ({ fill }) => {
    const id = 'gs-star-' + Math.random().toString(36).slice(2, 8);
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={id}>
            <stop offset={fill * 100 + '%'} stopColor="var(--coral-500)" />
            <stop offset={fill * 100 + '%'} stopColor="var(--ink-200)" />
          </linearGradient>
        </defs>
        <path fill={`url(#${id})`} d="M12 2.5l2.9 5.88 6.49.94-4.69 4.57 1.1 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.57 6.49-.94L12 2.5z" />
      </svg>
    );
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, ...style }}>
      {stars.map((f, i) => <Star key={i} fill={f} />)}
      {showValue && (
        <span style={{ marginLeft: 6, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.82, color: 'var(--text-strong)' }}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
