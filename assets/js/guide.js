/* Reserve EV — Tesla guide: EV confidence meter.
   Counts distinct guide topics the reader has opened. */
(function () {
  "use strict";
  var countEl = document.querySelector("[data-conf-count]");
  var fillEl = document.querySelector("[data-conf-fill]");
  var noteEl = document.querySelector("[data-conf-note]");
  if (!countEl || !fillEl) return;

  var topics = Array.prototype.slice.call(
    document.querySelectorAll('.acc-btn[aria-controls^="g-"]')
  ).filter(function (b) {
    return b.getAttribute("aria-controls") !== "g-60";
  });
  var total = topics.length;
  var opened = {};

  var notes = [
    [0, "Open a topic to start building confidence."],
    [0.25, "Good start — the basics are the whole battle."],
    [0.5, "Halfway there. You already know more than most first-timers."],
    [0.75, "Nearly fluent — the car will feel familiar on day one."],
    [1, "Fully charged. You’re ready for the driver’s seat."],
  ];

  window.rsrvOnAccordionOpen = function (btn) {
    var id = btn.getAttribute("aria-controls");
    if (!id || id === "g-60" || id.indexOf("g-") !== 0) return;
    opened[id] = true;
    var n = Object.keys(opened).length;
    var pct = total ? n / total : 0;
    countEl.textContent = String(n);
    fillEl.style.width = Math.round(pct * 100) + "%";
    if (noteEl) {
      for (var i = notes.length - 1; i >= 0; i--) {
        if (pct >= notes[i][0]) {
          noteEl.textContent = notes[i][1];
          break;
        }
      }
    }
  };
})();
