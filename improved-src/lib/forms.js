/**
 * Form markup. Every control has a visible label, an error slot linked with
 * aria-describedby, and its validation messages in data-l10n-* attributes so
 * that the Japanese build translates them with the rest of the page.
 */
const site = require("./site");
const { esc } = require("./html");
const config = require("../config");

function attrs(map) {
  return Object.entries(map)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join("");
}

function wrap({ id, label, required, hint, wide, control, error = true }) {
  const mark = required ? ' <span class="field-req">Required</span>' : ' <span class="field-opt">Optional</span>';
  return `<div class="field${wide ? " field-wide" : ""}" data-field>
            <label class="field-label" for="${id}">${esc(label)}${mark}</label>
            ${control}
            ${hint ? `<p class="field-hint" id="${id}-hint">${esc(hint)}</p>` : ""}
            ${error ? `<p class="field-error" id="${id}-error" data-error hidden></p>` : ""}
          </div>`;
}

function describedBy(id, hint) {
  return `${id}-error${hint ? ` ${id}-hint` : ""}`;
}

/** messages: { required, invalid } in English. */
function input({ name, label, type = "text", required = false, autocomplete, inputmode, hint, wide, maxlength = 200, messages = {}, prefix = "f" }) {
  const id = `${prefix}-${name}`;
  const control = `<input${attrs({
    id, name, type, required, autocomplete, inputmode, maxlength,
    "aria-describedby": describedBy(id, hint),
    "data-l10n-required": messages.required,
    "data-l10n-invalid": messages.invalid,
  })}>`;
  return wrap({ id, label, required, hint, wide, control });
}

function textarea({ name, label, required = false, hint, rows = 6, maxlength = 5000, messages = {}, prefix = "f" }) {
  const id = `${prefix}-${name}`;
  const control = `<textarea${attrs({
    id, name, rows, required, maxlength,
    "aria-describedby": describedBy(id, hint),
    "data-l10n-required": messages.required,
  })}></textarea>`;
  return wrap({ id, label, required, hint, wide: true, control });
}

/** options: [[value, label]] or { groupLabel: [[value, label]] }. */
function select({ name, label, options, required = false, placeholder, hint, wide, messages = {}, prefix = "f", extra = {} }) {
  const id = `${prefix}-${name}`;
  const opt = ([value, text]) => `<option value="${esc(value)}">${esc(text)}</option>`;
  const body = Array.isArray(options)
    ? options.map(opt).join("")
    : Object.entries(options)
        .map(([group, list]) => `<optgroup label="${esc(group)}">${list.map(opt).join("")}</optgroup>`)
        .join("");
  const control = `<select${attrs({
    id, name, required,
    "aria-describedby": describedBy(id, hint),
    "data-l10n-required": messages.required,
    ...extra,
  })}>${placeholder !== undefined ? `<option value="">${esc(placeholder)}</option>` : ""}${body}</select>`;
  return wrap({ id, label, required, hint, wide, control });
}

function consent({ text, message, prefix = "f" }) {
  const id = `${prefix}-consent`;
  return `<div class="field field-wide field-check" data-field>
            <input type="checkbox" id="${id}" name="consent" value="1" required aria-describedby="${id}-error" data-l10n-required="${esc(message)}">
            <label for="${id}">${esc(text)} <a href="${site.page("privacy.html")}">Privacy notice</a></label>
            <p class="field-error" id="${id}-error" data-error hidden></p>
          </div>`;
}

/** Spam traps: a field people never see, and the time the form was opened. */
function traps() {
  return `<div class="field-trap" aria-hidden="true"><label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <input type="hidden" name="form_started" value="">
          <input type="hidden" name="lang" value="${site.lang()}">`;
}

/**
 * kind: "contact" | "apply". The status region is where the script reports
 * progress; success is only ever shown after the server answers ok.
 */
function form({ kind, action, fields, submit, multipart = false, messages }) {
  return `<form class="form" action="${site.asset(action)}" method="post"${multipart ? ' enctype="multipart/form-data"' : ""} novalidate data-form="${kind}"${attrs({
    "data-l10n-sending": messages.sending,
    "data-l10n-success": messages.success,
    "data-l10n-failed": messages.failed,
    "data-l10n-fallback": messages.fallback,
    "data-l10n-invalid": "Please check the highlighted fields.",
    "data-l10n-mail-subject": messages.mailSubject,
    "data-mailto": config.email,
  })}>
          ${traps()}
          <div class="form-grid">${fields}</div>
          <div class="form-foot">
            <button class="btn btn-primary" type="submit">${esc(submit)}</button>
            <p class="form-status" role="status" aria-live="polite" data-form-status tabindex="-1"></p>
          </div>
        </form>`;
}

module.exports = { input, textarea, select, consent, form };
