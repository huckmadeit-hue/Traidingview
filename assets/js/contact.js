/* Reserve EV — contact form: validation, loading, success, error states.
   Submits to RSRV_CONFIG.formEndpoint when configured; until then it
   validates and directs the guest to email instead. Never confirms a
   reservation. */
(function () {
  "use strict";
  var R = window.RSRV;
  var form = document.getElementById("contact-form");
  if (!form) return;

  /* populate vehicle-interest select from fleet data */
  var vSel = document.getElementById("cf-vehicle");
  if (vSel && R) {
    R.fleet.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = v.name + " (Unit " + v.unit + ")";
      vSel.appendChild(opt);
    });
    var any = document.createElement("option");
    any.value = "help-me-choose";
    any.textContent = "Not sure — help me choose";
    vSel.appendChild(any);

    /* preselect when arriving from a vehicle page (?v=<id>) */
    var pre = new URLSearchParams(location.search).get("v");
    if (pre && R.byId(pre)) vSel.value = pre;
  }

  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setErr(input, msg) {
    var err = document.getElementById(input.id + "-err");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) {
      err.textContent = msg || "";
      err.classList.toggle("show", !!msg);
    }
  }

  function validate() {
    var ok = true;
    var name = form.elements["name"];
    var email = form.elements["email"];
    var question = form.elements["question"];
    setErr(name, "");
    setErr(email, "");
    setErr(question, "");
    if (!name.value.trim()) {
      setErr(name, "Please tell us your name.");
      ok = false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      setErr(email, "Please enter a valid email address so we can reply.");
      ok = false;
    }
    if (!question.value.trim()) {
      setErr(question, "Please add your question — that’s the part we answer!");
      ok = false;
    }
    if (!ok) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
    return ok;
  }

  function show(kind, msg) {
    status.hidden = false;
    status.className = "form-status " + kind;
    status.textContent = msg;
    status.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.hidden = true;
    if (!validate()) return;

    var endpoint = (R && R.config && R.config.formEndpoint) || "";
    if (!endpoint || endpoint.indexOf("TODO:") === 0) {
      show(
        "ok",
        "Thanks — your message is ready, but the form isn’t connected yet. Please send your question to Reserve EV by email (contact details are being finalized on this page), or reach us through any of our Turo listings."
      );
      return;
    }

    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.dataset.label = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        show(
          "ok",
          "Thanks — your question is on its way. We’ll reply by email. Note: this message does not hold a vehicle or confirm a reservation; bookings happen on Turo."
        );
      })
      .catch(function () {
        show(
          "fail",
          "Something went wrong sending your message. Please try again in a moment, or reach us through any of our Turo listings."
        );
      })
      .finally(function () {
        submitBtn.removeAttribute("aria-busy");
        submitBtn.textContent = submitBtn.dataset.label;
      });
  });
})();
