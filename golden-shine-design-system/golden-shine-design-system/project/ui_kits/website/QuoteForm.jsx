// Golden Shine website — Quote form (with success state)
const React = window.React;

function QuoteForm({ t, embedded }) {
  const { Card, Input, Select, Checkbox, Button, Badge } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  const [done, setDone] = React.useState(false);
  const [addons, setAddons] = React.useState({});

  const submit = (e) => { e.preventDefault(); setDone(true); };

  const inner = done
    ? React.createElement('div', { style: { textAlign: 'center', padding: '24px 8px' } },
        React.createElement('div', { style: { width: 72, height: 72, margin: '0 auto 18px', borderRadius: '50%', background: 'var(--success-100)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(I.CheckCircle, { size: 38 })),
        React.createElement('h3', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--text-strong)', margin: '0 0 8px' } }, t.quote.successTitle),
        React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--text-muted)', margin: '0 auto 20px', maxWidth: 360, lineHeight: 1.6 } }, t.quote.successSub),
        React.createElement(Button, { variant: 'secondary', onClick: () => setDone(false) }, t.quote.again))
    : React.createElement('form', { onSubmit: submit, style: { display: 'flex', flexDirection: 'column', gap: 16 } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 } },
          React.createElement(Input, { label: t.quote.name, placeholder: t.quote.namePh, required: true }),
          React.createElement(Input, { label: t.quote.phone, placeholder: t.quote.phonePh, type: 'tel', required: true })),
        React.createElement(Input, { label: t.quote.email, placeholder: t.quote.emailPh, type: 'email' }),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 } },
          React.createElement(Select, { label: t.quote.service, placeholder: t.quote.servicePh, options: t.quote.serviceOpts }),
          React.createElement(Select, { label: t.quote.size, placeholder: t.quote.sizePh, options: t.quote.sizeOpts })),
        React.createElement(Select, { label: t.quote.freq, options: t.quote.freqOpts }),
        React.createElement('div', null,
          React.createElement('span', { style: { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', display: 'block', marginBottom: 10 } }, t.quote.addons),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 10 } },
            t.quote.addonOpts.map((a, i) => React.createElement(Checkbox, { key: i, label: a, checked: !!addons[i], onChange: (e) => setAddons({ ...addons, [i]: e.target.checked }) })))),
        React.createElement('div', { style: { marginTop: 2 } }, React.createElement(Checkbox, { label: t.quote.consent, defaultChecked: true })),
        React.createElement(Button, { variant: 'accent', size: 'lg', type: 'submit', fullWidth: true, rightIcon: React.createElement(I.Arrow, { size: 18 }) }, t.quote.submit));

  return React.createElement('section', { id: 'contact', style: { background: 'var(--cream-200)' } },
    React.createElement('div', { style: { maxWidth: 720, margin: '0 auto', padding: 'clamp(3.5rem,8vw,6rem) var(--gutter)' } },
      React.createElement('div', { style: { textAlign: 'center', marginBottom: 30 } },
        React.createElement('span', { className: 'gs-eyebrow' }, t.quote.eyebrow),
        React.createElement('h2', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem,3.6vw,2.6rem)', color: 'var(--navy-800)', margin: '10px 0 0', letterSpacing: '-0.02em' } }, t.quote.title),
        React.createElement('p', { style: { fontFamily: 'var(--font-body)', color: 'var(--navy-600)', margin: '12px 0 0', lineHeight: 1.6 } }, t.quote.sub)),
      React.createElement(Card, { padding: 'lg', style: { boxShadow: 'var(--shadow-lg)', padding: 'clamp(1.5rem,3vw,2.5rem)' } }, inner)));
}

Object.assign(window, { GsQuoteForm: QuoteForm });
