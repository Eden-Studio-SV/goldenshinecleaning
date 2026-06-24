# Golden Shine — Website UI kit

A full **bilingual (EN / ES)** marketing homepage for Golden Shine Cleaning Service. Open `index.html`.

## What it demonstrates
- **Sticky header** with the brand lockup, nav, a 🌐 **EN↔ES language toggle**, and a coral "Get a quote" CTA (collapses to a mobile menu under 860px).
- **Hero** — headline with script flourish, dual CTAs, trust line, and a brand-artwork visual with floating rating + badge.
- **Services** grid (6 services), **How it works** (3 steps), **Why us** (4 trust points).
- **Reviews** on navy with star ratings and avatars.
- **Quote form** — interactive: fill it in and submit to see the success state. Resets with "Request another".
- **Footer** with services, company links, and contact details.

Click the language toggle to swap the entire page between English and Spanish.

## Structure
| File | Role |
|---|---|
| `index.html` | Entry point — loads React, the DS bundle, and the scripts below |
| `copy.js` | All bilingual strings (`window.GsCopy.en` / `.es`) — keep EN/ES in parity |
| `icons.jsx` | Lucide-style icon set (`window.GsIcons`) |
| `Header.jsx` | Header + `BrandLockup` (`window.GsHeader`, `window.GsBrandLockup`) |
| `Hero.jsx` | Hero section (`window.GsHero`) |
| `Sections.jsx` | Services / HowItWorks / WhyUs / Reviews |
| `QuoteForm.jsx` | Quote form with success state (`window.GsQuoteForm`) |
| `Footer.jsx` | Footer (`window.GsFooter`) |
| `App.jsx` | Composes everything, manages language + smooth-scroll nav |

## Notes
- Composes the design-system primitives (`window.GoldenShineDesignSystem_<hash>`) — Button, Card, Input, Select, Checkbox, Badge, Avatar, Rating — rather than re-implementing them.
- The hero visual uses `assets/logomark-spray.jpg`. Replace with real home/office photography when available.
- Contact details (phone, email, area) are placeholders — swap in the owner's real info in `copy.js`.
