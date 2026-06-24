// Golden Shine website — Brand lockup + Header
const React = window.React;

// Typographic brand lockup using the brand fonts (scales cleanly, on any bg)
function BrandLockup({ onNavy = false, size = 1 }) {
  const cream = 'var(--cream-100)';
  const scriptColor = onNavy ? cream : 'var(--navy-700)';
  const capsColor = 'var(--coral-500)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', lineHeight: 1, userSelect: 'none' } },
    React.createElement('span', { style: {
      fontFamily: 'var(--font-script)', color: scriptColor,
      fontSize: 34 * size, lineHeight: 0.82, marginLeft: 2,
    } }, 'Golden shine'),
    React.createElement('span', { style: {
      fontFamily: 'var(--font-display)', color: capsColor, fontWeight: 600,
      fontSize: 11 * size, letterSpacing: '0.22em', textTransform: 'uppercase',
    } }, 'Cleaning Service'),
  );
}

function Header({ t, lang, onToggleLang, onBook, onNav }) {
  const { Button, IconButton } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  const [open, setOpen] = React.useState(false);
  const links = [
    { k: 'services', id: 'services' },
    { k: 'how', id: 'how' },
    { k: 'reviews', id: 'reviews' },
    { k: 'contact', id: 'contact' },
  ];
  const go = (id) => { setOpen(false); onNav && onNav(id); };

  const linkStyle = {
    fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 15,
    color: 'var(--cream-100)', cursor: 'pointer', padding: '8px 4px',
    background: 'none', border: 'none', transition: 'color var(--dur-fast) var(--ease-out)',
  };

  return React.createElement('header', {
    style: {
      position: 'sticky', top: 0, zIndex: 100, background: 'var(--navy-700)',
      borderBottom: '1px solid var(--border-on-navy)',
    },
  },
    React.createElement('div', { style: {
      maxWidth: 1240, margin: '0 auto', padding: '14px var(--gutter)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    } },
      React.createElement('div', { style: { cursor: 'pointer' }, onClick: () => go('top') },
        React.createElement(BrandLockup, { onNavy: true })),

      // desktop nav
      React.createElement('nav', { className: 'gs-desktop-nav', style: { display: 'flex', alignItems: 'center', gap: 22 } },
        links.map((l) => React.createElement('button', {
          key: l.k, style: linkStyle, onClick: () => go(l.id),
          onMouseEnter: (e) => e.currentTarget.style.color = 'var(--coral-300)',
          onMouseLeave: (e) => e.currentTarget.style.color = 'var(--cream-100)',
        }, t.nav[l.k]))),

      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('button', {
          onClick: onToggleLang,
          style: {
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
            color: 'var(--cream-100)', background: 'transparent',
            border: '1.5px solid var(--border-on-navy)', borderRadius: 'var(--radius-pill)',
            padding: '7px 14px', cursor: 'pointer', letterSpacing: '0.04em',
          },
          title: lang === 'en' ? 'Cambiar a Español' : 'Switch to English',
        }, '🌐 ' + t.langLabel),
        React.createElement('div', { className: 'gs-desktop-nav' },
          React.createElement(Button, { variant: 'accent', size: 'md', onClick: onBook }, t.nav.book)),
        React.createElement('div', { className: 'gs-mobile-only' },
          React.createElement(IconButton, { label: 'Menu', variant: 'soft', onClick: () => setOpen(!open) },
            React.createElement(open ? I.X : I.Menu, { size: 22 })))
      )
    ),

    // mobile dropdown
    open && React.createElement('div', { className: 'gs-mobile-only', style: {
      padding: '8px var(--gutter) 20px', display: 'flex', flexDirection: 'column', gap: 4,
      borderTop: '1px solid var(--border-on-navy)',
    } },
      links.map((l) => React.createElement('button', {
        key: l.k, onClick: () => go(l.id),
        style: { ...linkStyle, textAlign: 'left', fontSize: 17, padding: '12px 4px' },
      }, t.nav[l.k])),
      React.createElement(Button, { variant: 'accent', size: 'lg', fullWidth: true, onClick: () => { setOpen(false); onBook(); }, style: { marginTop: 8 } }, t.nav.book)
    )
  );
}

Object.assign(window, { GsHeader: Header, GsBrandLockup: BrandLockup });
