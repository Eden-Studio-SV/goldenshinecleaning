// Golden Shine website — Footer
const React = window.React;

function Footer({ t }) {
  const I = window.GsIcons;
  const Lockup = window.GsBrandLockup;
  const colTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream-100)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 14px' };
  const link = { fontFamily: 'var(--font-body)', color: 'var(--navy-200)', fontSize: 14.5, textDecoration: 'none', display: 'block', padding: '5px 0', cursor: 'pointer' };
  const contactRow = { display: 'flex', alignItems: 'center', gap: 10, color: 'var(--navy-200)', fontFamily: 'var(--font-body)', fontSize: 14.5, padding: '5px 0' };

  return React.createElement('footer', { style: { background: 'var(--navy-900)', color: 'var(--cream-100)' } },
    React.createElement('div', { style: { maxWidth: 1240, margin: '0 auto', padding: '56px var(--gutter) 28px' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: 36 } },
        React.createElement('div', null,
          React.createElement(Lockup, { onNavy: true }),
          React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--navy-200)', fontSize: 14.5, lineHeight: 1.6, margin: '16px 0 0', maxWidth: 240 } }, t.footer.tagline)),
        React.createElement('div', null,
          React.createElement('h4', { style: colTitle }, t.footer.col1),
          t.services.items.map((s, i) => React.createElement('a', { key: i, style: link }, s.name))),
        React.createElement('div', null,
          React.createElement('h4', { style: colTitle }, t.footer.col2),
          t.footer.company.map((c, i) => React.createElement('a', { key: i, style: link }, c))),
        React.createElement('div', null,
          React.createElement('h4', { style: colTitle }, t.footer.col3),
          React.createElement('div', { style: contactRow }, React.createElement(I.Phone, { size: 17, color: 'var(--coral-400)' }), '(555) 123-4567'),
          React.createElement('div', { style: contactRow }, React.createElement(I.Mail, { size: 17, color: 'var(--coral-400)' }), 'hello@goldenshine.com'),
          React.createElement('div', { style: contactRow }, React.createElement(I.MapPin, { size: 17, color: 'var(--coral-400)' }), t.footer.area),
          React.createElement('div', { style: contactRow }, React.createElement(I.Clock, { size: 17, color: 'var(--coral-400)' }), t.footer.hours))),
      React.createElement('div', { style: { borderTop: '1px solid var(--border-on-navy)', marginTop: 40, paddingTop: 22, textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--navy-300)', fontSize: 13 } }, t.footer.rights)));
}

Object.assign(window, { GsFooter: Footer });
