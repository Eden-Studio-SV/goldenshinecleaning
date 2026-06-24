# Golden Shine — Design System

A complete brand & UI system for **Golden Shine Cleaning Service**, a US-based home & office cleaning company. The system is derived entirely from the company logo (the only source material provided). It powers bilingual (English / Spanish) marketing pages, booking flows, and brand collateral.

> **Sources provided:** one logo image — `uploads/WhatsApp Image 2026-06-22 at 09.34.25.jpeg` (copied to `assets/logo-golden-shine.jpg`). No codebase, Figma, or existing website was supplied. All foundations below are extracted from the logo and built out into a coherent system.

---

## Brand at a glance

Golden Shine is a friendly, trustworthy local cleaning service for **both homes and offices**. The voice is **warm + professional** — approachable enough for a family booking a one-time clean, credible enough for an office manager signing a weekly contract. The site is **bilingual (EN / ES)** because the owner serves a mixed English/Spanish-speaking community.

The logo: a flowing cream **script** ("Golden shine") over coral **caps** ("CLEANING SERVICE"), set on **deep navy**, beside a coral **spray bottle** held in hand with a cleaning "sparkle". Those three colors — navy, coral, cream — and that script/caps pairing are the whole identity.

---

## CONTENT FUNDAMENTALS — how Golden Shine writes

- **Voice:** warm, reassuring, plain-spoken. We sell *peace of mind and a spotless space*, not chemicals or square footage.
- **Person:** address the customer as **"you"**; refer to the company as **"we" / "our team"**. ("**We** bring the supplies — **you** relax.")
- **Tone:** confident but never boastful. Lead with benefit ("A sparkling clean, every time"), back it with proof ("Insured & background-checked").
- **Casing:** Sentence case for body and most headings. The eyebrow/kicker uses **UPPERCASE with wide tracking** (echoes "CLEANING SERVICE" in the logo). The brand name itself is **"Golden Shine"** (Title Case in text; the script lockup renders it as "Golden shine").
- **Length:** short. Headlines ≤ 6 words. Body sentences are tight and active. Buttons are 2–3 words ("Get a quote", "Book now", "Cotizar").
- **Numbers & proof:** use real, specific trust signals — "4.9/5", "2,400+ homes cleaned", "100% guarantee", "within the hour". Avoid vague filler stats.
- **Emoji:** essentially none in product copy. The one allowed flourish is a 🌐 globe on the language toggle and a ★ for "most popular". Otherwise rely on the coral **star** and **sparkle** icons, not emoji.
- **Bilingual rule:** every customer-facing string exists in both `en` and `es` (see `ui_kits/website/copy.js`). Spanish is natural and friendly, not a literal machine translation (e.g. "Tú descansas", "a medida" for custom pricing). Keep parity: if you add a string to one language, add it to the other.
- **Example pairs:**
  - EN: "A sparkling clean, every single time." / ES: "Un brillo impecable, siempre."
  - EN: "Tell us a bit about your space and we'll text you a price within the hour." / ES: "Cuéntanos sobre tu espacio y te enviaremos un precio por mensaje en menos de una hora."

---

## VISUAL FOUNDATIONS

**Color.** Three brand colors do the heavy lifting:
- **Navy `#0B3774`** (`--navy-700`) — the logo ground. Primary brand color: headers, footers, hero, trust. Conveys reliability.
- **Coral `#E85844`** (`--coral-500`) — the spray-bottle accent. The energy/CTA color: primary buttons, highlights, icons, the script flourish on light grounds.
- **Cream `#FCF6CB`** (`--cream-200`) — warm light. Used for alternating section backgrounds and calm surfaces; also the text color on navy.
Full scales (100–900) plus warm navy-tinted neutrals and semantic status colors live in `tokens/colors.css`. Pairings: navy ground + coral CTA; coral ground + cream label; cream ground + navy label.

**Type.** A three-font system (`tokens/typography.css`):
- **Great Vibes** (`--font-script`) — the signature flourish, mirrors the logo wordmark. **Accents only** (the word "shine"/"siempre", hero flourish). Never body or UI.
- **Poppins** (`--font-display`) — geometric sans matching the logo's "CLEANING SERVICE" caps. All headings, buttons, labels, eyebrows.
- **Mulish** (`--font-body`) — humanist, highly readable. All body copy and form text.
- The **eyebrow** treatment = Poppins 600, UPPERCASE, `letter-spacing: 0.14em`, coral.

**Spacing & layout.** 4px base grid (`tokens/spacing.css`). Centered containers (max 1240px) with a fluid `--gutter`. Generous vertical section rhythm via `--section-y`. Sections alternate background: page (`--ink-50`) → cream → navy to create rhythm.

**Shape & corners.** Friendly and rounded — **never sharp**. Cards use `--radius-lg` (20px), buttons are full **pills** (`--radius-pill`), inputs `--radius-md` (14px), icon tiles `--radius-md`. Hero visual uses `--radius-2xl` (40px).

**Cards.** White surface, 1px subtle border (`--border-subtle`), soft shadow (`--shadow-sm`), 20px radius. Interactive cards lift on hover (`translateY(-4px)` + `--shadow-lg`).

**Shadows.** Soft and **navy-tinted** (`rgba(11,55,116,...)`) — never harsh black. Five-step scale plus a warm **coral glow** (`--shadow-coral`) reserved for the primary accent CTA.

**Backgrounds.** Solid brand colors and one subtle radial coral **glow** behind the hero. No heavy gradients, no busy patterns, no stock-photo noise. Where real photography belongs (hero visual, before/after), use the brand spray-bottle artwork or a labeled placeholder until the owner provides photos.

**Motion.** Quick and gentle. `--dur-fast` (140ms) for hover/press, `--dur-base` (220ms) for card lifts. Easing `--ease-out` for entrances; an optional `--ease-spring` for playful bounce. No infinite/looping decorative animation.

**Hover & press states.** Hover = `brightness(1.06)` (buttons) or lift (cards); links shift navy→coral. Press = `scale(0.97)` on buttons, `scale(0.92)` on icon buttons. Focus = 3px coral focus ring (`--focus-ring`) + soft coral halo on inputs.

**Borders.** 1px subtle dividers on light; `rgba(255,255,255,0.18)` (`--border-on-navy`) on navy. Outline buttons use a 1.5px navy border.

**Transparency & blur.** Used sparingly — the hero glow and the on-navy border tints. No glassmorphism.

**Imagery vibe.** Flat, warm, friendly vector illustration (the logo's style): bold shapes, coral + cream + navy, no gradients or photoreal rendering.

---

## ICONOGRAPHY

- **System:** **Lucide-style** line icons — 2px stroke, round caps/joins, 24px grid. The set is inlined (ISC-licensed Lucide path data) in `ui_kits/website/icons.jsx` and exposed as `window.GsIcons` so the UI kit stays self-contained and offline-safe.
- **Why line icons:** they read as modern, clean and friendly — matching the cleaning/hygiene category — and pair well with the geometric Poppins headings.
- **Usage:** service tiles, "how it works" steps, trust badges, contact rows. Icons inherit `currentColor`; on coral/navy tiles they take cream or coral fills. Standard size 22–34px.
- **The star** (`GsIcons.Star`) is the one **filled** icon, used coral for ratings.
- **Emoji / unicode:** avoided in product copy. Only the 🌐 globe on the language toggle and a ★ glyph on the "most popular" badge.
- **Substitution flag:** these are Lucide-derived paths, not a provided icon set (none existed). If you adopt official `lucide` later, the names map 1:1 (Home, Building2, Sparkles, Truck, Sofa, Calendar, CheckCircle2, Clock, Shield, Leaf, Phone, Mail, MapPin, ArrowRight, Menu, X, Star, Wand2).

---

## Assets (`assets/`)

- `logo-golden-shine.jpg` — the full primary logo (lockup on navy). Use on navy grounds at ≥ 240px wide.
- `wordmark-navy.jpg` — text-only wordmark crop (no spray bottle) for tight horizontal spaces on navy.
- `logomark-spray.jpg` — the spray-bottle + hand illustration, cropped. Used as the hero visual and as a logomark/accent.
- For UI use on light or arbitrary backgrounds, prefer the **typographic lockup** component (`window.GsBrandLockup`, in `Header.jsx`) which renders the name in the brand fonts and scales cleanly.

---

## INDEX — what's in this project

**Root**
- `styles.css` — global entry point (consumers link this one file). `@import`s all tokens.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `assets/` — logos & brand artwork (above).
- `readme.md` — this guide. `SKILL.md` — Agent-Skill manifest.

**Components** (`components/`, namespace `window.GoldenShineDesignSystem_*` — run `check_design_system` for the exact hash):
- `buttons/` — **Button** (primary/accent/secondary/ghost · sm/md/lg), **IconButton** (circular).
- `forms/` — **Input** (label/helper/error/icon), **Select**, **Checkbox**.
- `data-display/` — **Badge** (7 tones), **Card** (interactive lift), **Avatar** (initials fallback), **Rating** (coral stars, half-star support).
Each directory has a `*.card.html` demo registered on the Design System tab.

**Foundation cards** (`guidelines/`) — specimen cards on the Design System tab: Colors (Navy, Coral, Cream/Neutrals, Semantic), Type (Script, Display, Body), Spacing (Scale, Radius/Shadow), Brand (Logo, Pairings).

**UI kit** (`ui_kits/website/`) — a full bilingual cleaning-service **homepage**: sticky header w/ EN↔ES toggle, hero, services grid, how-it-works, why-us, reviews, an interactive quote form (with success state), and footer. Open `index.html`. Files: `copy.js` (bilingual strings), `icons.jsx`, `Header.jsx`, `Hero.jsx`, `Sections.jsx`, `QuoteForm.jsx`, `Footer.jsx`, `App.jsx`. It is also registered as a Starting Point.

---

## Notes & open items

- **Fonts are Google Fonts substitutes** (Great Vibes / Poppins / Mulish) chosen to match the logo — the original logo font files were not provided. Swap in the real font files if the owner has them.
- **No real photography** yet. Provide home/office before-after photos to replace the spray-bottle hero placeholder and to add a gallery section.
- **Contact details are placeholders** ((555) 123-4567, hello@goldenshine.com, Houston, TX). Replace with the owner's real phone / WhatsApp / email / service area.
