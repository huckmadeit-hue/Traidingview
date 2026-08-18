# Reserve EV — Pre-Launch Content Checklist

Everything below is currently a labeled placeholder on the site. The site must not launch
with any of these presented as fact until the real information is supplied and reviewed.

## Brand & identity
- [ ] Final logo / wordmark files (the site currently renders the RSRV wordmark in live text per the brand guide)
- [ ] Confirm production domain (placeholder: `rsrvev.com`) and update `SITE_URL` in every page head, `sitemap.xml`, and `robots.txt`
- [ ] "Reserve EV Ready" steering-wheel seal artwork (slot reserved on the About page)

## Business details
- [ ] Business email → `assets/js/site-config.js`
- [ ] Business phone → `assets/js/site-config.js`
- [ ] Social profile links → `assets/js/site-config.js`
- [ ] Founder story + photograph → About page marked slot
- [ ] Confirmed service area wording (currently: "Raleigh–Durham / Triangle area" only)

## Fleet (edit `assets/js/fleet-data.js` — one record per vehicle)
- [ ] Vehicle 01–05: year, model, trim, exterior/interior color, body style, seats
- [ ] Estimated EPA range when new (from the window sticker / official spec — never guessed)
- [ ] Cargo descriptions, feature highlights, best-for labels
- [ ] Verified accessibility / comfort notes
- [ ] Real fleet photography (main + gallery per vehicle; replace SVG placeholders)
- [ ] Individual Turo listing URL per vehicle (`turoUrl`)
- [ ] Availability labels and featured/sort order

## Reviews & social proof
- [ ] Verified Turo reviews (site shows labeled empty states until supplied)
- [ ] Host stats (trips, rating, All-Star status) — only after they are real and current

## Policies (FAQ, Terms page, vehicle pages)
- [ ] Pickup location(s) and any delivery options
- [ ] RDU airport availability — do not claim until confirmed
- [ ] Charging & return-charge policy
- [ ] Mileage policy
- [ ] Pet policy
- [ ] Smoking policy
- [ ] Toll policy
- [ ] Cancellation information (or link to Turo policy)
- [ ] Accessibility details

## Legal
- [ ] Owner review of the independent-business disclaimer (draft in footer)
- [ ] Privacy policy (page is a placeholder)
- [ ] Terms / rental information (page is a placeholder)
- [ ] Confirm no Tesla/Turo logos are used without written permission (site uses text names only)

## Technical
- [ ] Contact form endpoint (`assets/js/site-config.js` → `formEndpoint`; form is inert until set)
- [ ] Privacy-friendly analytics snippet (marked slot in each page head; add consent banner only if the chosen tool requires it)
- [ ] Open Graph share image (`assets/img/og-image.png` placeholder)
- [ ] Final pass: replace every element carrying the `data-placeholder` attribute
