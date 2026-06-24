// Golden Shine website — content sections: Services, HowItWorks, WhyUs, Reviews
const React = window.React;

function Section({ id, bg, children, style }) {
  return React.createElement('section', { id, style: { background: bg || 'transparent', ...style } },
    React.createElement('div', { style: { maxWidth: 1240, margin: '0 auto', padding: 'clamp(3.5rem,8vw,6rem) var(--gutter)' } }, children));
}

function Head({ eyebrow, title, sub, onNavy }) {
  return React.createElement('div', { style: { textAlign: 'center', maxWidth: 640, margin: '0 auto 44px' } },
    eyebrow && React.createElement('span', { className: 'gs-eyebrow' }, eyebrow),
    React.createElement('h2', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', color: onNavy ? 'var(--cream-100)' : 'var(--text-strong)', margin: '10px 0 0', letterSpacing: '-0.02em' } }, title),
    sub && React.createElement('p', { style: { fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem,1.3vw,1.12rem)', color: onNavy ? 'var(--navy-200)' : 'var(--text-muted)', margin: '14px 0 0', lineHeight: 1.6 } }, sub));
}

function Services({ t, onBook }) {
  const { Card, Badge, Button } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  return React.createElement(Section, { id: 'services', bg: 'var(--surface-page)' },
    React.createElement(Head, { eyebrow: t.services.eyebrow, title: t.services.title, sub: t.services.sub }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px,1fr))', gap: 22 } },
      t.services.items.map((s, i) => {
        const Icon = I[s.icon] || I.Sparkles;
        const popular = i === 2;
        return React.createElement(Card, { key: i, interactive: true, padding: 'lg', style: { position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 } },
          popular && React.createElement('div', { style: { position: 'absolute', top: 16, right: 16 } }, React.createElement(Badge, { tone: 'coral', solid: true }, '★')),
          React.createElement('div', { style: { width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'var(--coral-100)', color: 'var(--coral-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(Icon, { size: 26, stroke: 2 })),
          React.createElement('h3', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-strong)', margin: 0 } }, s.name),
          React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55, flex: 1 } }, s.desc),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 } },
            React.createElement('span', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy-700)', fontSize: 16 } }, s.from),
            React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: onBook, rightIcon: React.createElement(I.Arrow, { size: 16 }) }, t.services.cta)));
      })));
}

function HowItWorks({ t }) {
  const I = window.GsIcons;
  return React.createElement(Section, { id: 'how', bg: 'var(--cream-200)' },
    React.createElement(Head, { eyebrow: t.how.eyebrow, title: t.how.title }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 28 } },
      t.how.steps.map((s, i) => {
        const Icon = I[s.icon] || I.Spray;
        return React.createElement('div', { key: i, style: { textAlign: 'center' } },
          React.createElement('div', { style: { position: 'relative', width: 84, height: 84, margin: '0 auto 18px', borderRadius: 'var(--radius-circle)', background: 'var(--navy-700)', color: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' } },
            React.createElement(Icon, { size: 34, stroke: 1.8 }),
            React.createElement('span', { style: { position: 'absolute', top: -6, right: -6, width: 28, height: 28, borderRadius: '50%', background: 'var(--coral-500)', color: 'var(--cream-100)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, i + 1)),
          React.createElement('h3', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--navy-800)', margin: '0 0 6px' } }, s.name),
          React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--navy-600)', margin: '0 auto', maxWidth: 280, lineHeight: 1.55 } }, s.desc));
      })));
}

function WhyUs({ t }) {
  const I = window.GsIcons;
  return React.createElement(Section, { bg: 'var(--surface-page)' },
    React.createElement(Head, { title: t.why.title }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 20 } },
      t.why.items.map((w, i) => {
        const Icon = I[w.icon] || I.Check;
        return React.createElement('div', { key: i, style: { display: 'flex', gap: 14, alignItems: 'flex-start' } },
          React.createElement('div', { style: { flex: 'none', width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--navy-100)', color: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(Icon, { size: 22 })),
          React.createElement('div', null,
            React.createElement('h3', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-strong)', margin: '2px 0 4px' } }, w.name),
            React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--text-muted)', margin: 0, fontSize: 14.5, lineHeight: 1.5 } }, w.desc)));
      })));
}

function Reviews({ t }) {
  const { Card, Avatar, Rating, Badge } = window.GoldenShineDesignSystem_23f889;
  return React.createElement(Section, { id: 'reviews', bg: 'var(--navy-700)' },
    React.createElement(Head, { eyebrow: t.reviews.eyebrow, title: t.reviews.title, sub: t.reviews.rating, onNavy: true }),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 22 } },
      t.reviews.items.map((r, i) => React.createElement(Card, { key: i, padding: 'lg', style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        React.createElement(Rating, { value: r.stars, size: 18 }),
        React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--text-body)', margin: 0, lineHeight: 1.6, flex: 1, fontSize: 15.5 } }, '“' + r.text + '”'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement(Avatar, { name: r.name, size: 'md' }),
          React.createElement('div', null,
            React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-strong)', fontSize: 15 } }, r.name),
            React.createElement('div', { style: { fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: 13 } }, r.city)))))));
}

Object.assign(window, { GsServices: Services, GsHowItWorks: HowItWorks, GsWhyUs: WhyUs, GsReviews: Reviews });
