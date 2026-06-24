// Golden Shine website — Hero
const React = window.React;

function Hero({ t, onBook, onServices }) {
  const { Button, Badge, Rating } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;

  return React.createElement('section', { id: 'top', style: {
    background: 'var(--navy-700)', color: 'var(--cream-100)', position: 'relative', overflow: 'hidden',
  } },
    // soft decorative glow
    React.createElement('div', { style: {
      position: 'absolute', top: -160, right: -120, width: 460, height: 460,
      background: 'radial-gradient(circle, rgba(232,88,68,0.30), transparent 70%)', pointerEvents: 'none',
    } }),
    React.createElement('div', { style: {
      maxWidth: 1240, margin: '0 auto', padding: 'clamp(3rem,7vw,6rem) var(--gutter)',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center', position: 'relative',
    } },
      // copy
      React.createElement('div', null,
        React.createElement('span', { className: 'gs-eyebrow', style: { color: 'var(--coral-300)' } }, t.hero.eyebrow),
        React.createElement('h1', { style: {
          fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--cream-100)',
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.05, letterSpacing: '-0.02em',
          margin: '14px 0 0',
        } },
          t.hero.titleA,
          React.createElement('br'),
          React.createElement('span', { style: { fontFamily: 'var(--font-script)', fontWeight: 400, color: 'var(--coral-400)', fontSize: 'clamp(3rem, 6.5vw, 4.8rem)', display: 'inline-block', lineHeight: 1, marginTop: 6 } }, t.hero.titleScript)
        ),
        React.createElement('p', { style: {
          fontFamily: 'var(--font-body)', color: 'var(--navy-200)', fontSize: 'clamp(1rem,1.4vw,1.18rem)',
          lineHeight: 1.6, maxWidth: 520, margin: '20px 0 0',
        } }, t.hero.sub),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 } },
          React.createElement(Button, { variant: 'accent', size: 'lg', onClick: onBook, rightIcon: React.createElement(I.Arrow, { size: 18 }) }, t.hero.ctaPrimary),
          React.createElement(Button, { variant: 'secondary', size: 'lg', onClick: onServices, style: { background: 'transparent', color: 'var(--cream-100)', borderColor: 'var(--border-on-navy)' } }, t.hero.ctaSecondary)
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 26, color: 'var(--navy-200)' } },
          React.createElement(I.Shield, { size: 18, color: 'var(--coral-300)' }),
          React.createElement('span', { style: { fontFamily: 'var(--font-body)', fontSize: 14 } }, t.hero.trust)
        )
      ),

      // visual
      React.createElement('div', { style: { position: 'relative', justifySelf: 'center', width: '100%', maxWidth: 460 } },
        React.createElement('div', { style: {
          background: 'var(--cream-200)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)', aspectRatio: '4 / 4.4', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        } },
          React.createElement('img', { src: '../../assets/logomark-spray.jpg', alt: 'Golden Shine spray bottle',
            style: { width: '92%', objectFit: 'contain', objectPosition: 'bottom', mixBlendMode: 'normal' } })
        ),
        // floating rating card
        React.createElement('div', { style: {
          position: 'absolute', bottom: 22, left: -18, background: 'var(--white)',
          borderRadius: 'var(--radius-lg)', padding: '12px 16px', boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', gap: 4,
        } },
          React.createElement(Rating, { value: 5, size: 18 }),
          React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' } }, t.hero.stat1)
        ),
        // floating badge
        React.createElement('div', { style: { position: 'absolute', top: 18, right: -10 } },
          React.createElement(Badge, { tone: 'success', solid: true, style: { boxShadow: 'var(--shadow-md)', padding: '8px 14px' } },
            React.createElement(I.CheckCircle, { size: 15 }), t.hero.stat2))
      )
    )
  );
}

Object.assign(window, { GsHero: Hero });
