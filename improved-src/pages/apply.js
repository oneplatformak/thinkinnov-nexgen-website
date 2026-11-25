/**
 * Application form. Fields are the ones the staging form asked for. Gender,
 * current and expected CTC and notice period are kept but optional.
 */
const site = require("../lib/site");
const { esc } = require("../lib/html");
const c = require("../lib/components");
const f = require("../lib/forms");
const config = require("../config");
const content = require("../content");

const req = (what) => ({ required: `Please enter ${what}.` });

function fields() {
  const p = "a";
  return [
    f.select({
      name: "job", label: "Role of interest", wide: true, prefix: p, placeholder: "General application",
      options: content.jobs.map((job) => [job.slug, job.title]), extra: { "data-job-select": true },
    }),
    f.input({ name: "first_name", label: "First name", required: true, autocomplete: "given-name", prefix: p, messages: req("your first name") }),
    f.input({ name: "last_name", label: "Last name", required: true, autocomplete: "family-name", prefix: p, messages: req("your last name") }),
    f.input({ name: "email", label: "Email", type: "email", required: true, autocomplete: "email", prefix: p, messages: { required: "Please enter your email address.", invalid: "Please enter a valid email address." } }),
    f.input({ name: "phone", label: "Contact number", type: "tel", required: true, autocomplete: "tel", prefix: p, messages: req("your contact number") }),
    f.input({ name: "graduation", label: "Year of graduation", required: true, inputmode: "numeric", maxlength: 4, prefix: p, messages: req("your year of graduation") }),
    f.select({
      name: "gender", label: "Gender", prefix: p, placeholder: "Select",
      options: [["Male", "Male"], ["Female", "Female"], ["Prefer not to say", "Prefer not to say"]],
    }),
    f.input({ name: "experience", label: "Overall experience (years)", required: true, prefix: p, messages: req("your overall experience") }),
    f.input({ name: "employer", label: "Current employer", required: true, autocomplete: "organization", prefix: p, messages: req("your current employer") }),
    f.input({ name: "current_ctc", label: "Current CTC (LPA)", prefix: p }),
    f.input({ name: "expected_ctc", label: "Expected CTC (LPA)", prefix: p }),
    f.input({ name: "notice", label: "Notice period (days)", prefix: p }),
    f.select({
      name: "source", label: "How did you come across this vacancy?", required: true, prefix: p, placeholder: "Select",
      options: [["LinkedIn", "LinkedIn"], ["Referral", "Referral"], ["Website", "Website"], ["Other", "Other"]],
      messages: { required: "Please choose an option." },
    }),
    f.input({ name: "current_location", label: "Current location", required: true, prefix: p, messages: req("your current location") }),
    f.input({ name: "preferred_location", label: "Preferred location", required: true, prefix: p, messages: req("your preferred location") }),
    f.input({ name: "skills", label: "Skill set", required: true, wide: true, maxlength: 500, prefix: p, messages: req("your skill set") }),
    `<div class="field field-wide" data-field>
            <label class="field-label" for="a-resume">CV / resume <span class="field-req">Required</span></label>
            <input type="file" id="a-resume" name="resume" required accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby="a-resume-error a-resume-hint" data-max-bytes="5242880" data-l10n-required="Please attach your CV." data-l10n-invalid="The file must be PDF, DOC or DOCX." data-l10n-toolarge="The file must be 5 MB or smaller.">
            <p class="field-hint" id="a-resume-hint">PDF, DOC or DOCX, up to 5 MB.</p>
            <p class="field-error" id="a-resume-error" data-error hidden></p>
          </div>`,
    f.consent({
      prefix: p,
      text: "I consent to ThinkInnov-NexGen processing my application data for recruitment purposes.",
      message: "Please confirm your consent to continue.",
    }),
  ].join("\n          ");
}

function render() {
  const crumbs = c.crumbsFor("Apply", "apply.html", [{ label: "Careers", path: "careers.html" }]);
  return {
    title: "Apply | Careers | ThinkInnov-NexGen",
    description: "Apply for a role at ThinkInnov-NexGen or register your interest with a general application.",
    active: "careers",
    crumbs,
    body: `${c.pageHero({ kicker: content.careersIntro.kicker, title: "Apply for job", intro: content.careersIntro.intro, crumbs })}
    <section class="section">
      <div class="container form-layout">
        <div class="form-main">
          ${f.form({
            kind: "apply", action: "apply.php", multipart: true, fields: fields(), submit: "Send application",
            messages: {
              sending: "Sending your application…",
              success: "Thank you. Your application has been sent.",
              failed: "Your application could not be sent. Please try again, or email your CV to us.",
              fallback: "This copy of the site cannot send applications. Please email your CV to us instead.",
              mailSubject: "Job application",
            },
          })}
          <noscript><p class="form-noscript">If the form does not send, please email your CV to us: <a href="mailto:${config.email}">${esc(config.email)}</a></p></noscript>
        </div>
        <aside class="form-aside" aria-label="About applying">
          <h2 class="h-sub">Before you apply</h2>
          <ul class="ticks">
            <li>Fields marked “Required” must be completed. Gender, current and expected CTC and notice period are optional.</li>
            <li>Your application and CV are emailed to our company address.</li>
            <li>Choose “General application” if no listed role fits.</li>
          </ul>
          <p>${c.linkArrow(site.page("careers.html#roles"), "View all roles")}</p>
          <p class="form-aside-contact">Prefer email? <a href="mailto:${config.email}">${esc(config.email)}</a></p>
        </aside>
      </div>
    </section>`,
  };
}

module.exports = { routes: [{ path: "apply.html", render }] };
