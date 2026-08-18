/* Reserve EV — Fleet page: comparison table built from fleet-data.js */
(function () {
  "use strict";
  var R = window.RSRV;
  if (!R) return;

  var mount = document.querySelector("[data-compare-table]");
  if (!mount) return;

  var rows = [
    ["Model & trim", function (v) { return R.spec(v.model && v.trim ? v.model + " " + v.trim : v.model); }],
    ["Year", function (v) { return R.spec(v.year); }],
    ["Body style", function (v) { return R.spec(v.bodyStyle); }],
    ["Seats", function (v) { return R.spec(v.seats); }],
    ["Est. range when new", function (v) { return R.spec(v.estRangeMi, " mi EPA"); }],
    ["Cargo", function (v) { return R.spec(v.cargo); }],
    ["Best for", function (v) {
      return v.bestFor && v.bestFor.length
        ? R.esc(v.bestFor.join(", "))
        : R.spec("");
    }],
    ["Pricing", function (v) {
      return v.displayPrice ? R.esc(v.displayPrice) : "Live price on Turo";
    }],
    ["Reserve", function (v) {
      return v.turoUrl
        ? '<a href="' + R.esc(v.turoUrl) + '" rel="noopener">Check availability</a>'
        : '<span class="tbd" title="Editable in assets/js/fleet-data.js">Listing coming soon</span>';
    }],
  ];

  var head =
    "<thead><tr><th scope=\"col\"><span class=\"visually-hidden\">Specification</span></th>" +
    R.fleet
      .map(function (v) {
        return '<th scope="col">Unit ' + R.esc(v.unit) + "</th>";
      })
      .join("") +
    "</tr></thead>";

  var body =
    "<tbody>" +
    rows
      .map(function (row) {
        return (
          '<tr><th scope="row">' + row[0] + "</th>" +
          R.fleet
            .map(function (v) {
              return "<td>" + row[1](v) + "</td>";
            })
            .join("") +
          "</tr>"
        );
      })
      .join("") +
    "</tbody>";

  mount.innerHTML =
    '<table class="compare"><caption class="visually-hidden">Side-by-side comparison of the five Reserve EV vehicles</caption>' +
    head + body + "</table>";
})();
