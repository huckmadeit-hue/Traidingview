# Reserve EV — Website Plan

> This is the strategy document requested before implementation. Because this session ran
> autonomously, the plan and the build are delivered together: review this document first,
> then the site. Everything flagged **[ASSUMPTION]** or **[PLACEHOLDER]** is reversible and
> editable without touching the design.

---

## 1. Understanding of Reserve EV

Reserve EV is an independently operated, five-vehicle Tesla fleet serving the
Raleigh–Durham / Triangle market. Reservations, pricing, availability, eligibility, and
protection plans are all handled on Turo — Reserve EV's website exists to do what a Turo
listing can't:

- Present the fleet as one **consistently prepared operation**, not five separate car listings.
- Help a visitor choose the right Tesla for their trip *before* they hit Turo.
- Remove first-time-Tesla anxiety with practical, honest guidance.
- Signal operational discipline: every car inspected, cleaned, recharged, and reset between trips.

Reserve EV is **not** affiliated with Tesla or Turo, and the site never implies otherwise.
The site takes no payments and confirms no reservations — every booking CTA is an editable
outbound link to a Turo listing.

**Success in five seconds:** a visitor understands (1) Teslas for rent, (2) Raleigh–Durham,
(3) five vehicles, (4) thoughtfully prepared, (5) book on Turo.

## 2. Sitemap & primary visitor journey

```
Home
├── Fleet ──────────────► Vehicle detail (reusable, data-driven) ──► Turo listing (external)
├── How It Works
├── Tesla Guide (first-time drivers)
├── About
├── FAQ
├── Contact ("Ask Reserve EV")
├── Privacy (placeholder) · Terms / rental info (placeholder)
└── 404
```

**Primary journey:** Home hero → "Explore the Fleet" → Fleet comparison → Vehicle detail →
"Check Availability on Turo" (external). **Support journey:** Home → "First Time in a Tesla?"
→ Tesla Guide → confidence → Fleet. **Fallback journey:** any page → "Ask Reserve EV" → Contact.

Every page carries the mobile sticky "Explore the Fleet" CTA so the primary journey is one
tap away at all times.

## 3. Design system & visual direction

**Decision: the uploaded RSRV EV brand assets supersede the prompt's suggested
obsidian/cobalt palette.** The brand guide (RSRVEV_Brand_Guide.pdf + standalone assets) defines
a complete, distinctive identity, and the prompt's palette was labeled "suggested." Using both
would dilute the brand.

From the brand guide:

| Token | Value | Role |
|---|---|---|
| Ground | `#F3F2F2` | page background |
| Surface | `#EAE9E9` | cards, alternate bands |
| Ink | `#201E1D` | text, dark bands, buttons |
| Accent 500 | `#EC3013` | the one accent — marks, CTAs, key moments |
| Accent 700 | `#AE1800` | body-safe accent text |
| Accent 100–300 | `#FFF2EF / #FFE0D9 / #FFC4B8` | tinted fills |
| Neutral 100–900 | `#F8F4F4 … #2D2B2B` | rules, secondary text |

- **Typography:** Archivo everywhere (Google Fonts) — 800 weight, tight tracking for headings;
  regular for body; tracked uppercase caps for labels/kickers. No Tesla-like typography.
- **Shape language:** zero border-radius, 2px rules, flush-left composition, "the grid does the
  framing." The one accent, no second hue — so "ready/success" states use the accent ramp, not
  the prompt's optional green (brand rule: *one accent, no second hue*).
- **Marks:** RSRV wordmark alone in headers; RSRV**EV** joined lockup for hero moments; the
  bracket (viewfinder) mark for favicon/avatar/small surfaces. Below 40px the mark drops its
  brackets; at favicon scale it reduces to the accent dot.
- **Photography:** editorial placeholders built from the brand's hatch-pattern + viewfinder
  motif — no AI-generated Teslas, no stock keys-in-hand. Real fleet photography drops into
  clearly marked slots.
- **Branded details implemented:** charging-progress top bar on page load; Trip Fit selector;
  Ready Standard (inspect → reset → recharge → ready) strip; EV-confidence meter on the guide;
  reservation-pass-style vehicle cards; Raleigh↔Durham route line; reserved slot for the future
  "Reserve EV Ready" seal. All honor `prefers-reduced-motion`.

## 4. Hero concepts (two alternatives + selected)

- **Concept A — "Reservation pass" (selected):** flush-left editorial hero on ground, the
  provided headline "Your trip deserves a better drive.", supporting copy, two CTAs, and a
  viewfinder-bracketed photo slot annotated like a fleet pass (UNIT ·· / RDU–DUR). Chosen
  because it's the most brand-native (bracket motif, flush-left, ink-on-ground) and puts the
  five-second facts above the fold.
- **Concept B — "Ink field":** full-bleed ink hero, RSRVEV lockup large, headline
  "Reserve. Charge. Drive." adapted to rental copy, photo below the fold. Strong but hides
  the photography and reads more like the brand deck than a rental storefront.
- **Concept C — "Split ledger":** 50/50 split, left column stacked trip facts (5 vehicles ·
  RDU–DUR · Turo), right column photo. Great on desktop, weakest on mobile where the ledger
  collapses awkwardly.

## 5. Confirmed facts vs. assumptions

**Confirmed (used as fact on the site):**
- Brand: Reserve EV / RSRV EV wordmark, colors, Archivo, zero-radius system, tagline
  "Reserve. Charge. Drive." (from uploaded brand guide).
- Independent business; five Tesla vehicles; Raleigh–Durham / Triangle service market;
  reservations exclusively through Turo; documented turnaround between trips; first-time
  Tesla guidance offered.

**Assumptions (flagged, editable, never presented as public fact):**
- **[ASSUMPTION]** Domain `rsrvev.com` appears in the brand guide; used as the canonical URL
  placeholder — confirm before launch.
- **[ASSUMPTION]** The brand guide's example content (Austin address, "Maya Ortiz," rate card
  prices, unit numbers, phone) is mock template content — none of it is used as fact.
- **[PLACEHOLDER]** All vehicle records (model/trim/range/seats/colors/cargo), Turo URLs,
  photos, reviews, policies, contact info, pickup/delivery options, founder story. See
  `CONTENT-CHECKLIST.md`.

## 6. Missing business information

Everything Reserve EV must supply before launch is consolidated in **CONTENT-CHECKLIST.md**
(vehicle records, Turo listing URLs, photography, policies, contact details, verified reviews,
service-area confirmation, legal review). The site is visually complete with labeled
placeholders and can launch section-by-section as facts are confirmed.

## 7. Technical approach

Dependency-free static site (HTML/CSS/vanilla JS) — hostable on any static host with zero
build step. One editable data file (`assets/js/fleet-data.js`) drives the fleet page, fleet
previews, comparison, Trip Fit selector, and the reusable vehicle detail page
(`vehicle.html?v=rsrv-01`), so the fleet can change without touching design. Accessibility to
WCAG 2.1 AA (semantic landmarks, keyboard menus/accordions, visible focus, reduced motion,
AA contrast). SEO: unique titles/descriptions, Open Graph, canonical, `sitemap.xml`,
`robots.txt`, LocalBusiness JSON-LD limited to confirmed facts. The contact form validates
client-side and is wired for any form endpoint (placeholder action documented inline); it
explicitly does not confirm reservations.
