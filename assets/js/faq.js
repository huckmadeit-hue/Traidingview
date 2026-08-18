/* Reserve EV — FAQ page: live search filter over the accordions. */
(function () {
  "use strict";
  var input = document.getElementById("faq-search");
  var list = document.querySelector("[data-faq-list]");
  var empty = document.querySelector("[data-faq-empty]");
  var count = document.querySelector("[data-faq-count]");
  if (!input || !list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll("[data-faq]"));
  var groups = Array.prototype.slice.call(list.querySelectorAll("h2"));

  function groupFor(item) {
    var el = item.previousElementSibling;
    while (el && el.tagName !== "H2") el = el.previousElementSibling;
    return el;
  }

  function filter() {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (item) {
      var hit = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
      item.hidden = !hit;
      if (hit) shown++;
    });
    groups.forEach(function (h) {
      var any = items.some(function (item) {
        return !item.hidden && groupFor(item) === h;
      });
      h.hidden = !any;
    });
    if (empty) empty.hidden = shown > 0;
    if (count) {
      count.textContent = q
        ? shown + " question" + (shown === 1 ? "" : "s") + " match your search"
        : "";
    }
  }

  input.addEventListener("input", filter);
})();
