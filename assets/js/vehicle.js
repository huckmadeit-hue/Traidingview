/* Reserve EV — reusable vehicle detail page.
   Reads ?v=<id> from the URL and renders the record from fleet-data.js. */
(function () {
  "use strict";
  var R = window.RSRV;
  var mount = document.getElementById("vehicle-mount");
  if (!R || !mount) return;

  var params = new URLSearchParams(location.search);
  var requested = params.get("v");
  var v = R.byId(requested);
  if (!v && requested) {
    document.title = "Vehicle Not Found | Reserve EV Fleet";
    mount.innerHTML =
      '<section class="page-hero" data-cta-sentinel><div class="wrap">' +
      '<span class="kicker">Reserve EV fleet</span>' +
      "<h1>We couldn&rsquo;t find that vehicle.</h1>" +
      '<p class="lede">The link may be out of date — the fleet is five vehicles and they&rsquo;re all one click away.</p>' +
      '<div class="hero-ctas">' +
      '<a class="btn btn-primary" href="fleet.html">Explore the Fleet <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '<a class="btn btn-ghost" href="contact.html">Ask Reserve EV</a>' +
      "</div></div></section>";
    return;
  }
  v = v || R.fleet[0];
  if (!v) return;

  document.title = v.name + " | Reserve EV Fleet | Tesla Rental Raleigh–Durham";

  function specRow(k, val, suffix) {
    return (
      '<li><span class="spec-k">' + k + "</span>" + R.spec(val, suffix) + "</li>"
    );
  }

  var galleryImgs = (v.gallery || []).map(function (src, i) {
    return (
      '<div class="photo-slot ratio-card"><img src="' + R.esc(src) +
      '" alt="' + R.esc(v.name) + " — photo " + (i + 2) +
      '" loading="lazy" width="1200" height="800"></div>'
    );
  });
  while (galleryImgs.length < 3) {
    galleryImgs.push(
      '<div class="photo-slot ratio-card" role="img" aria-label="' + R.esc(v.name) +
        ' — gallery photo coming soon" data-placeholder><p class="slot-label">Photo &middot; coming soon</p></div>'
    );
  }

  var highlights =
    v.highlights && v.highlights.length
      ? '<ul class="check-list">' +
        v.highlights.map(function (h) { return "<li>" + R.esc(h) + "</li>"; }).join("") +
        "</ul>"
      : '<p class="placeholder-note" data-placeholder>Feature highlights for this vehicle will appear here once confirmed. Edit <code>highlights</code> in <code>assets/js/fleet-data.js</code>.</p>';

  var bestFor =
    v.bestFor && v.bestFor.length
      ? '<div class="vc-tags">' +
        v.bestFor.map(function (t) { return '<span class="tag tag-accent">' + R.esc(t) + "</span>"; }).join("") +
        "</div>"
      : '<p class="tbd" title="Editable in assets/js/fleet-data.js">Best-use recommendations coming soon</p>';

  var firstTimer = v.firstTimerNote
    ? "<p>" + R.esc(v.firstTimerNote) + "</p>"
    : '<p>Every Reserve EV trip includes plain-English Tesla orientation before you drive. Vehicle-specific pointers for this car will appear here once written.</p>';

  var comfort = v.comfortNotes
    ? '<p><strong>Comfort &amp; accessibility:</strong> ' + R.esc(v.comfortNotes) + "</p>"
    : "";

  var others = R.fleet.filter(function (o) { return o.id !== v.id; });
  var compareOptions = others
    .map(function (o) {
      return '<option value="' + o.id + '">' + R.esc(o.name) + " (Unit " + R.esc(o.unit) + ")</option>";
    })
    .join("");

  mount.innerHTML =
    '<section class="page-hero"><div class="wrap">' +
    '<nav aria-label="Breadcrumb" class="small muted"><a href="fleet.html">Fleet</a> / Unit ' + R.esc(v.unit) + "</nav>" +
    '<span class="kicker">Reserve EV fleet &middot; Unit ' + R.esc(v.unit) + "</span>" +
    "<h1>" + R.esc(v.name) + "</h1>" +
    '<p class="lede">' +
    (v.model
      ? "A " + R.esc([v.year, "Tesla", v.model, v.trim].filter(Boolean).join(" ")) + " prepared to the Reserve EV Ready Standard between every trip."
      : "Full details for this vehicle are being finalized. What is confirmed appears below; everything else is labeled until it is verified.") +
    "</p>" +
    bestFor +
    '<div class="hero-ctas">' + R.bookBtn(v) +
    '<a class="btn btn-ghost" href="tesla-guide.html">First Time in a Tesla?</a></div>' +
    "</div></section>" +

    '<section class="tight" data-cta-sentinel><div class="wrap">' +
    '<div class="viewfinder"><span class="vf-b"></span>' + R.photoSlot(v, "ratio-wide") + "</div>" +
    '<div class="gallery" style="margin-top:var(--space-2)">' + galleryImgs.slice(0, 3).join("") + "</div>" +
    "</div></section>" +

    '<section class="tight on-surface"><div class="wrap">' +
    "<h2>Specifications</h2>" +
    '<p class="small muted">Verified details only — anything not yet confirmed is labeled. Range shown is the EPA estimate when new; real-world range varies with speed, weather, and climate use.</p>' +
    '<ul class="vc-specs" style="max-width:44rem;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr))">' +
    specRow("Year", v.year) +
    specRow("Model", v.model) +
    specRow("Trim", v.trim) +
    specRow("Body style", v.bodyStyle) +
    specRow("Seats", v.seats) +
    specRow("Est. range when new", v.estRangeMi, " mi EPA") +
    specRow("Exterior", v.exteriorColor) +
    specRow("Interior", v.interiorColor) +
    specRow("Cargo", v.cargo) +
    "</ul>" + comfort +
    "</div></section>" +

    '<section class="tight"><div class="wrap">' +
    '<div class="hero-grid">' +
    "<div><h2>Highlights</h2>" + highlights + "</div>" +
    '<div><h2>First time in a Tesla?</h2>' + firstTimer +
    '<a class="btn btn-ink" href="tesla-guide.html">Read the Tesla Guide <span class="arrow" aria-hidden="true">&rarr;</span></a></div>' +
    "</div></div></section>" +

    '<section class="tight on-surface"><div class="wrap">' +
    "<h2>Compare with another Tesla</h2>" +
    '<div class="compare-pick"><label for="compare-select"><strong>Compare Unit ' + R.esc(v.unit) + " with:</strong></label>" +
    '<select id="compare-select"><option value="">Choose a vehicle&hellip;</option>' + compareOptions + "</select></div>" +
    '<div id="compare-out" style="margin-top:var(--space-3)" aria-live="polite"></div>' +
    "</div></section>" +

    '<section class="tight"><div class="wrap">' +
    "<h2>Good to know</h2>" +
    '<div class="accordion"><h3><button class="acc-btn" aria-expanded="false" aria-controls="vfaq-1" id="vfaq-1-btn">How charged will the car be at pickup?<span class="acc-icon" aria-hidden="true"></span></button></h3>' +
    '<div class="acc-panel" id="vfaq-1" role="region" aria-labelledby="vfaq-1-btn" hidden><p>Recharging is part of the documented turnaround every vehicle gets between trips. Reserve EV’s specific charge-at-pickup and return-charge policy will be published here once confirmed — until then, the trip details on the Turo listing govern.</p></div></div>' +
    '<div class="accordion"><h3><button class="acc-btn" aria-expanded="false" aria-controls="vfaq-2" id="vfaq-2-btn">Where do I see the price and book?<span class="acc-icon" aria-hidden="true"></span></button></h3>' +
    '<div class="acc-panel" id="vfaq-2" role="region" aria-labelledby="vfaq-2-btn" hidden><p>Live pricing, availability, eligibility, protection plans, and reservation terms are all shown on this vehicle’s Turo listing — Reserve EV’s website never takes payment.</p></div></div>' +
    '<div class="accordion"><h3><button class="acc-btn" aria-expanded="false" aria-controls="vfaq-3" id="vfaq-3-btn">What about mileage, tolls, pets, and smoking?<span class="acc-icon" aria-hidden="true"></span></button></h3>' +
    '<div class="acc-panel" id="vfaq-3" role="region" aria-labelledby="vfaq-3-btn" hidden><p>Those policies are being finalized for publication. The current, binding versions always appear on the Turo listing for this vehicle — or <a href="contact.html">ask Reserve EV</a> before you book.</p></div></div>' +
    '<p class="small muted" style="margin-top:var(--space-3)">Live pricing, availability, driver eligibility, protection plans, and reservation terms are governed by the applicable Turo listing and Turo’s terms.</p>' +
    "</div></section>";

  /* wire the accordions rendered above */
  mount.querySelectorAll(".acc-btn").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  /* compare interaction */
  var select = document.getElementById("compare-select");
  var out = document.getElementById("compare-out");
  select.addEventListener("change", function () {
    var o = R.byId(select.value);
    if (!o) {
      out.innerHTML = "";
      return;
    }
    var rows = [
      ["Model & trim", function (x) { return R.spec(x.model && x.trim ? x.model + " " + x.trim : x.model); }],
      ["Seats", function (x) { return R.spec(x.seats); }],
      ["Est. range when new", function (x) { return R.spec(x.estRangeMi, " mi EPA"); }],
      ["Body style", function (x) { return R.spec(x.bodyStyle); }],
      ["Cargo", function (x) { return R.spec(x.cargo); }],
      ["Best for", function (x) { return x.bestFor && x.bestFor.length ? R.esc(x.bestFor.join(", ")) : R.spec(""); }],
    ];
    out.innerHTML =
      '<div class="table-scroll"><table class="compare"><caption class="visually-hidden">Comparison of ' +
      R.esc(v.name) + " and " + R.esc(o.name) + "</caption>" +
      '<thead><tr><th scope="col"><span class="visually-hidden">Spec</span></th><th scope="col">' +
      R.esc(v.name) + '</th><th scope="col">' + R.esc(o.name) + "</th></tr></thead><tbody>" +
      rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1](v) + "</td><td>" + r[1](o) + "</td></tr>";
      }).join("") +
      '</tbody></table></div><p style="margin-top:var(--space-2)"><a class="btn btn-ghost" href="vehicle.html?v=' +
      R.esc(o.id) + '">View ' + R.esc(o.name) + "</a></p>";
  });
})();
