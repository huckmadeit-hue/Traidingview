# Reserve EV — Marketing Website

Premium marketing site for **Reserve EV**, an independently operated five-Tesla rental
fleet serving the Raleigh–Durham (Triangle) area. Reservations are completed on Turo —
this site never takes payment.

## Quick start

Static site, zero build step. Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Deploy by uploading the repository contents to any static host (Netlify, Vercel,
Cloudflare Pages, GitHub Pages, S3…).

## Editing content (no code knowledge needed)

| What | Where |
|---|---|
| Vehicle records, Trip Fit matches | `assets/js/fleet-data.js` |
| Email, phone, social, Turo links, form endpoint, announcement bar | `assets/js/site-config.js` |
| Page copy | The `.html` files (plain HTML) |
| Colors, spacing, type | `assets/css/styles.css` (tokens at the top) |

Empty fields render as labeled **"Details coming soon"** placeholders — the site never
guesses. Before launch, work through **`CONTENT-CHECKLIST.md`**.

## Documents

- **`PLAN.md`** — brand strategy, sitemap, design-system decisions, confirmed facts vs. assumptions
- **`CONTENT-CHECKLIST.md`** — everything the owner must supply before launch

## Structure

```
index.html            Homepage
fleet.html            Fleet comparison (rendered from fleet-data.js)
vehicle.html?v=<id>   Reusable vehicle detail page
how-it-works.html     Customer journey
tesla-guide.html      First-time Tesla guide + EV confidence meter
about.html            About / operations story
faq.html              Searchable FAQ
contact.html          "Ask Reserve EV" form (questions only, not reservations)
privacy.html          Placeholder pending legal review
terms.html            Placeholder pending legal review
404.html              Custom not-found page
assets/               CSS, JS, images
```

## Guardrails baked in

- No invented facts: prices, ranges, reviews, policies, and host stats are labeled
  placeholders until verified (see `data-placeholder` attributes).
- Independent-business disclaimer in every footer; no Tesla/Turo logos or design imitation.
- WCAG 2.1 AA targets: keyboard-accessible menus/accordions/tabs, visible focus,
  reduced-motion support, semantic landmarks, AA contrast.
- No analytics load by default; a marked slot exists in each page `<head>`.
