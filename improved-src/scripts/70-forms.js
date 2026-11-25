// Both forms: validation with messages from the page, submission by fetch,
// and an honest result. "Sent" appears only when the server answers ok.
var $ = window.TIN.$, $$ = window.TIN.$$;

function messageFor(control) {
  var v = control.validity;
  if (control.type === "file" && control.files && control.files[0]) {
    var file = control.files[0];
    var max = Number(control.getAttribute("data-max-bytes") || 0);
    if (!/\.(pdf|docx?)$/i.test(file.name)) return control.getAttribute("data-l10n-invalid");
    if (max && file.size > max) return control.getAttribute("data-l10n-toolarge");
  }
  if (v.valueMissing) return control.getAttribute("data-l10n-required");
  if (v.typeMismatch || v.patternMismatch) return control.getAttribute("data-l10n-invalid") || control.getAttribute("data-l10n-required");
  if (control.type === "email" && control.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(control.value)) return control.getAttribute("data-l10n-invalid");
  return "";
}

function validate(control) {
  var field = control.closest("[data-field]");
  if (!field) return true;
  var slot = $("[data-error]", field);
  var message = messageFor(control);
  if (message) {
    control.setAttribute("aria-invalid", "true");
    slot.textContent = message;
    slot.hidden = false;
    return false;
  }
  control.removeAttribute("aria-invalid");
  slot.textContent = "";
  slot.hidden = true;
  return true;
}

function mailtoHref(form) {
  var lines = [];
  $$("input, select, textarea", form).forEach(function (el) {
    if (!el.name || el.type === "hidden" || el.type === "file" || el.type === "checkbox" || el.name === "website" || !el.value) return;
    var label = $('label[for="' + el.id + '"]', form);
    var name = label ? label.firstChild.textContent.trim() : el.name;
    var value = el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value;
    lines.push(name + ": " + value);
  });
  var to = (form.getAttribute("data-mailto") || "");
  return "mailto:" + to + "?subject=" + encodeURIComponent(form.getAttribute("data-l10n-mail-subject")) + "&body=" + encodeURIComponent(lines.join("\n"));
}

$$("form[data-form]").forEach(function (form) {
  var status = $("[data-form-status]", form);
  var button = $('button[type="submit"]', form);
  var controls = $$("input, select, textarea", form).filter(function (el) { return el.closest("[data-field]"); });
  form.elements.form_started.value = String(Date.now());
  // Without scripts the browser's own validation applies; with them, ours does.
  form.setAttribute("novalidate", "");

  var say = function (kind, text, link) {
    status.className = "form-status" + (kind ? " is-" + kind : "");
    status.textContent = text;
    if (link) {
      status.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      status.appendChild(a);
    }
  };

  controls.forEach(function (control) {
    control.addEventListener("blur", function () { if (control.value || control.getAttribute("aria-invalid")) validate(control); });
    control.addEventListener("change", function () { if (control.getAttribute("aria-invalid")) validate(control); });
    control.addEventListener("input", function () { if (control.getAttribute("aria-invalid")) validate(control); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var invalid = controls.filter(function (control) { return !validate(control); });
    if (invalid.length) {
      say("error", form.getAttribute("data-l10n-invalid"));
      invalid[0].focus();
      return;
    }
    button.disabled = true;
    say("", form.getAttribute("data-l10n-sending"));
    var email = form.getAttribute("data-mailto");
    // A message that asks the visitor to write to us carries the address as a link.
    var direct = { href: "mailto:" + email, text: email };
    var fallback = function () {
      // No working mail handler here (for example a static preview host).
      say("error", form.getAttribute("data-l10n-fallback"), { href: mailtoHref(form), text: email });
      status.focus();
    };
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.text().then(function (text) {
          var data = null;
          try { data = JSON.parse(text); } catch (err) { /* not JSON */ }
          return { res: res, data: data };
        });
      })
      .then(function (r) {
        if (r.data && r.data.ok === true) {
          say("ok", form.getAttribute("data-l10n-success"));
          form.reset();
          form.elements.form_started.value = String(Date.now());
          form.dispatchEvent(new CustomEvent("tin:sent"));
        } else if (r.data && r.data.error) {
          say("error", r.data.error, /^(rate|rejected|mail_failed)$/.test(r.data.code || "") ? direct : null);
        } else if (!r.data) {
          fallback();
          return;
        } else {
          say("error", form.getAttribute("data-l10n-failed"), direct);
        }
        status.focus();
      })
      .catch(fallback)
      .then(function () { button.disabled = false; });
  });
});

// Apply page: preselect the role named in the URL.
var jobSelect = $("[data-job-select]");
if (jobSelect) {
  var job = new URLSearchParams(location.search).get("job");
  if (job && $('option[value="' + job.replace(/[^a-z0-9-]/g, "") + '"]', jobSelect)) jobSelect.value = job;
}
