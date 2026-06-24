---
name: golden-shine-design
description: Use this skill to generate well-branded interfaces and assets for Golden Shine Cleaning Service (a bilingual EN/ES home & office cleaning company), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Colors:** navy `#0B3774` (primary), coral `#E85844` (accent/CTA), cream `#FCF6CB` (warm light). Full token scales in `tokens/colors.css`.
- **Type:** Great Vibes (script accents only) · Poppins (headings/UI) · Mulish (body). See `tokens/typography.css`.
- **Shape:** rounded & friendly — pill buttons, 20px cards. Soft navy-tinted shadows. Coral focus ring.
- **Voice:** warm + professional. "You" (customer) / "we" (company). Sentence case; UPPERCASE eyebrows. Bilingual EN/ES with parity.
- **Icons:** Lucide-style line icons (`ui_kits/website/icons.jsx`, `window.GsIcons`). Minimal emoji.
- **Components:** link `styles.css`, load `_ds_bundle.js`, read from `window.GoldenShineDesignSystem_<hash>` (run the design-system check for the exact namespace). Button, IconButton, Input, Select, Checkbox, Badge, Card, Avatar, Rating.
- **Reference UI:** `ui_kits/website/index.html` — full bilingual homepage with a working quote form.

## Key files
- `readme.md` — full brand, content, and visual guide (read this first).
- `styles.css` + `tokens/` — design tokens and base styles.
- `components/` — reusable React primitives (each with a `.prompt.md`).
- `ui_kits/website/` — the homepage UI kit (sections, copy, icons).
- `assets/` — logo, wordmark, spray-bottle artwork.

## Caveats to surface to the user
- Fonts are Google Fonts substitutes for the logo's custom lettering.
- No real photography or final contact details yet — placeholders are used.
