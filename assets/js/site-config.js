/* ============================================================
   Reserve EV — site configuration (EDIT ME)
   Everything a non-developer needs to change lives here and in
   fleet-data.js. "TODO:" values render as labeled placeholders —
   nothing fake is ever shown as fact.
   ============================================================ */

window.RSRV_CONFIG = {
  // Business contact — leave as TODO until confirmed. TODO values are
  // shown on the site as "coming soon" placeholders, never as facts.
  email: "TODO:business-email", // e.g. "hello@rsrvev.com"
  phone: "TODO:business-phone", // e.g. "+1 (919) 555-0100"

  // Social links — only links you add here are rendered in the footer.
  social: [
    // { label: "Instagram", url: "https://instagram.com/..." },
    // { label: "Facebook", url: "https://facebook.com/..." },
  ],

  // Turo host profile (all five listings). Vehicle-level URLs live in
  // fleet-data.js. Until set, booking buttons explain the link is coming.
  turoProfileUrl: "TODO:turo-host-profile-url",

  // Contact form endpoint (e.g. Formspree/Basin URL). While it is a TODO,
  // the form validates but tells the guest to email instead of submitting.
  formEndpoint: "TODO:form-endpoint",

  // Editable announcement bar message. Empty string hides the bar.
  // Keep it honest — no fake urgency.
  announcement:
    "Now serving the Raleigh–Durham area with a five-Tesla fleet. Reservations through Turo.",
};
