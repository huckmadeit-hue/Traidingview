/* ============================================================
   Reserve EV — shared behaviors and fleet rendering helpers
   No dependencies. Progressive enhancement: every page reads
   fine with JavaScript disabled.
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = window.RSRV_CONFIG || {};
  var FLEET = (window.RSRV_FLEET || []).slice().sort(function (a, b) {
    return (a.sort || 99) - (b.sort || 99);
  });

  function isTodo(v) {
    return !v || String(v).indexOf("TODO:") === 0;
  }

  /* ---------- charge-progress load bar: remove once the animation is done ---------- */
  var chargeBar = document.querySelector(".charge-bar");
  if (chargeBar) {
    setTimeout(function () {
      chargeBar.remove();
    }, 1200);
  }

  /* ---------- announcement bar ---------- */
  var announce = document.querySelector("[data-announce]");
  if (announce) {
    if (CONFIG.announcement) {
      announce.textContent = CONFIG.announcement;
    } else {
      var bar = announce.closest(".announce");
      if (bar) bar.hidden = true;
    }
  }

  /* ---------- current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- contact placeholders ---------- */
  document.querySelectorAll("[data-contact-email]").forEach(function (el) {
    if (isTodo(CONFIG.email)) {
      el.innerHTML =
        '<span class="tbd" title="Editable in assets/js/site-config.js">Email coming soon</span>';
    } else {
      el.innerHTML =
        '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a>";
    }
  });
  document.querySelectorAll("[data-contact-phone]").forEach(function (el) {
    if (isTodo(CONFIG.phone)) {
      el.innerHTML =
        '<span class="tbd" title="Editable in assets/js/site-config.js">Phone coming soon</span>';
    } else {
      el.textContent = CONFIG.phone;
    }
  });
  document.querySelectorAll("[data-social-list]").forEach(function (el) {
    var links = (CONFIG.social || []).filter(function (s) {
      return s && s.url && !isTodo(s.url);
    });
    if (!links.length) {
      el.innerHTML =
        '<li><span class="tbd" title="Editable in assets/js/site-config.js">Social links coming soon</span></li>';
      return;
    }
    el.innerHTML = links
      .map(function (s) {
        return (
          '<li><a href="' +
          s.url +
          '" rel="noopener">' +
          s.label +
          "</a></li>"
        );
      })
      .join("");
  });

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- mark current nav page ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(".nav-links a, .mobile-menu a")
    .forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here) a.setAttribute("aria-current", "page");
    });

  /* ---------- accordions ---------- */
  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      if (!open && typeof window.rsrvOnAccordionOpen === "function") {
        window.rsrvOnAccordionOpen(btn);
      }
    });
  });

  /* ---------- mobile sticky CTA (hidden while hero CTA is on screen) ---------- */
  var sticky = document.querySelector(".sticky-cta");
  if (sticky) {
    document.body.classList.add("has-sticky-cta");
    var sentinel = document.querySelector("[data-cta-sentinel]") || document.querySelector("main");
    if ("IntersectionObserver" in window && sentinel) {
      var io = new IntersectionObserver(
        function (entries) {
          sticky.classList.toggle("show", !entries[0].isIntersecting);
        },
        { rootMargin: "-80px 0px 0px 0px" }
      );
      io.observe(sentinel);
    } else {
      sticky.classList.add("show");
    }
  }

  /* ============================================================
     Fleet rendering helpers (shared by several pages)
     ============================================================ */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function spec(value, suffix) {
    if (!value) {
      return '<span class="tbd" title="Editable in assets/js/fleet-data.js">Details coming soon</span>';
    }
    return esc(value) + (suffix || "");
  }

  function photoSlot(v, extraClass) {
    var label = esc(v.name) + " — photo coming soon";
    if (v.mainImage) {
      return (
        '<div class="photo-slot ' + (extraClass || "ratio-card") + ' vc-photo">' +
        '<img src="' + esc(v.mainImage) + '" alt="' + esc(v.name) + '" loading="lazy" width="1200" height="800">' +
        "</div>"
      );
    }
    return (
      '<div class="photo-slot ' + (extraClass || "ratio-card") + ' vc-photo" role="img" aria-label="' + label + '" data-placeholder>' +
      '<p class="slot-label">Fleet photo · coming soon</p>' +
      "</div>"
    );
  }

  function bookBtn(v, cls) {
    if (v.turoUrl) {
      return (
        '<a class="btn ' + (cls || "btn-primary") + '" href="' + esc(v.turoUrl) +
        '" rel="noopener">Check Availability on Turo <span class="arrow" aria-hidden="true">&rarr;</span></a>'
      );
    }
    return (
      '<a class="btn btn-ghost" href="contact.html" data-placeholder ' +
      'title="Add this vehicle\'s Turo listing URL in assets/js/fleet-data.js">' +
      "Turo listing coming soon &middot; Ask Reserve EV</a>"
    );
  }

  function cardHTML(v) {
    var tags = (v.bestFor || [])
      .slice(0, 3)
      .map(function (t) {
        return '<span class="tag tag-accent">' + esc(t) + "</span>";
      })
      .join("");
    if (!tags) {
      tags =
        '<span class="tag" data-placeholder title="Editable in assets/js/fleet-data.js">Best-for labels coming soon</span>';
    }
    var price = v.displayPrice
      ? esc(v.displayPrice)
      : "View live price on Turo";
    return (
      '<article class="vehicle-card" id="' + esc(v.id) + '">' +
      photoSlot(v) +
      '<div class="vc-body">' +
      '<p class="vc-unit"><span>Reserve EV fleet</span><span class="unit-no">Unit ' + esc(v.unit) + "</span></p>" +
      '<h3 class="vc-name"><a href="vehicle.html?v=' + esc(v.id) + '">' + esc(v.name) + "</a></h3>" +
      '<div class="vc-tags">' + tags + "</div>" +
      '<ul class="vc-specs">' +
      '<li><span class="spec-k">Model &amp; trim</span>' + spec(v.model && v.trim ? v.model + " " + v.trim : v.model) + "</li>" +
      '<li><span class="spec-k">Seats</span>' + spec(v.seats) + "</li>" +
      '<li><span class="spec-k">Est. range when new</span>' + spec(v.estRangeMi, " mi EPA") + "</li>" +
      '<li><span class="spec-k">Body style</span>' + spec(v.bodyStyle) + "</li>" +
      "</ul>" +
      '<div class="vc-foot">' +
      '<p class="vc-price mono-spec">' + price + "</p>" +
      bookBtn(v) +
      '<a href="vehicle.html?v=' + esc(v.id) + '">Vehicle details</a>' +
      "</div></div></article>"
    );
  }

  window.RSRV = {
    fleet: FLEET,
    config: CONFIG,
    esc: esc,
    spec: spec,
    isTodo: isTodo,
    cardHTML: cardHTML,
    photoSlot: photoSlot,
    bookBtn: bookBtn,
    byId: function (id) {
      return FLEET.find(function (v) {
        return v.id === id;
      });
    },
  };

  /* ---------- fleet grids (homepage preview + fleet page) ---------- */
  document.querySelectorAll("[data-fleet-grid]").forEach(function (grid) {
    var limit = parseInt(grid.getAttribute("data-fleet-grid"), 10) || FLEET.length;
    grid.innerHTML = FLEET.slice(0, limit).map(cardHTML).join("");
  });

  /* ---------- Trip Fit selector ---------- */
  var tripfit = document.querySelector("[data-tripfit]");
  if (tripfit && window.RSRV_TRIP_FIT) {
    var fits = window.RSRV_TRIP_FIT;
    var tabs =
      '<div class="tripfit-tabs" role="tablist" aria-label="Trip type">' +
      fits
        .map(function (f, i) {
          return (
            '<button class="tripfit-tab" role="tab" id="tf-tab-' + f.id +
            '" aria-controls="tf-panel-' + f.id + '" aria-selected="' + (i === 0) +
            '" tabindex="' + (i === 0 ? "0" : "-1") + '">' + esc(f.label) + "</button>"
          );
        })
        .join("") +
      "</div>";
    var panels = fits
      .map(function (f, i) {
        var v = f.vehicleId ? window.RSRV.byId(f.vehicleId) : null;
        var rec = v
          ? '<p class="tripfit-rec">Our pick: <a href="vehicle.html?v=' + esc(v.id) + '">' + esc(v.name) + "</a></p>"
          : '<p class="tripfit-rec tbd" title="Match a vehicle in assets/js/fleet-data.js">Fleet match coming soon</p>';
        var cta = v && v.turoUrl ? bookBtn(v) : '<a class="btn btn-ink" href="fleet.html">Browse the fleet <span class="arrow" aria-hidden="true">&rarr;</span></a>';
        return (
          '<div class="tripfit-panel" role="tabpanel" id="tf-panel-' + f.id +
          '" aria-labelledby="tf-tab-' + f.id + '"' + (i === 0 ? "" : " hidden") + ">" +
          "<div><p>" + esc(f.blurb) + "</p>" + rec + "</div>" +
          "<div>" + cta + "</div></div>"
        );
      })
      .join("");
    tripfit.innerHTML = tabs + panels;

    var tabEls = tripfit.querySelectorAll('[role="tab"]');
    function selectTab(tab) {
      tabEls.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      tab.focus();
    }
    tabEls.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        selectTab(tab);
      });
      tab.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (dir) {
          e.preventDefault();
          selectTab(tabEls[(i + dir + tabEls.length) % tabEls.length]);
        }
      });
    });
  }
})();
