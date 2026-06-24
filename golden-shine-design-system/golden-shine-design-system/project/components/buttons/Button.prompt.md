A pill-shaped action button — use `accent` (coral) for the primary call-to-action ("Book now", "Get a quote") and `primary` (navy) for standard actions.

```jsx
<Button variant="accent" size="lg">Get a free quote</Button>
<Button variant="primary">Book now</Button>
<Button variant="secondary">See services</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

Variants: `primary` (navy fill), `accent` (coral fill + glow, the hero CTA), `secondary` (navy outline), `ghost` (bare). Sizes: `sm` / `md` / `lg`. Supports `leftIcon`/`rightIcon`, `fullWidth`, `disabled`. Buttons are always fully rounded (pill) — never square them off.
