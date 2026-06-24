// Golden Shine website — App shell (composes all sections, manages language)
const React = window.React;

function App() {
  const [lang, setLang] = React.useState('en');
  const t = window.GsCopy[lang];
  const toggleLang = () => setLang(lang === 'en' ? 'es' : 'en');

  const nav = (id) => {
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    const y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const book = () => nav('contact');

  return React.createElement('div', null,
    React.createElement(window.GsHeader, { t, lang, onToggleLang: toggleLang, onBook: book, onNav: nav }),
    React.createElement(window.GsHero, { t, onBook: book, onServices: () => nav('services') }),
    React.createElement(window.GsServices, { t, onBook: book }),
    React.createElement(window.GsHowItWorks, { t }),
    React.createElement(window.GsWhyUs, { t }),
    React.createElement(window.GsReviews, { t }),
    React.createElement(window.GsQuoteForm, { t }),
    React.createElement(window.GsFooter, { t }));
}

Object.assign(window, { GsApp: App });
