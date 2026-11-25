/** Contact: one enquiry form that knows what the visitor was reading. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, verbatim } = require("../lib/html");
const c = require("../lib/components");
const f = require("../lib/forms");
const config = require("../config");
const content = require("../content");

/** Labels the script needs to describe the context passed in the URL. */
function contextData() {
  const map = {
    need: Object.fromEntries(content.needs.map((n) => [n.key, n.title])),
    industry: Object.fromEntries(content.industries.map((i) => [i.key, i.title])),
    size: Object.fromEntries(content.plm.businessSize.cards.map(([key, title]) => [key, title])),
  };
  return Object.entries(map)
    .map(([kind, items]) => Object.entries(items).map(([key, label]) => `<li data-context-item="${kind}:${key}" hidden><span class="context-kind">${esc({ need: "Business need", industry: "Industry", size: "Company size" }[kind])}</span> <span data-context-label>${esc(label)}</span></li>`).join(""))
    .join("");
}

function fields() {
  return [
    f.select({
      name: "type", label: "Enquiry type", required: true, options: content.enquiryTypes,
      messages: { required: "Please choose an enquiry type." }, extra: { "data-enquiry-type": true },
    }),
    f.select({
      name: "topic", label: "Topic", placeholder: "No specific topic", options: content.enquiryTopics(),
      extra: { "data-enquiry-topic": true },
    }),
    f.input({ name: "name", label: "Name", required: true, autocomplete: "name", messages: { required: "Please enter your name." } }),
    f.input({ name: "company", label: "Company name", autocomplete: "organization" }),
    f.input({ name: "email", label: "Email", type: "email", required: true, autocomplete: "email", messages: { required: "Please enter your email address.", invalid: "Please enter a valid email address." } }),
    f.input({ name: "phone", label: "Phone number", type: "tel", autocomplete: "tel" }),
    f.textarea({ name: "message", label: "Message", required: true, messages: { required: "Please enter your message." } }),
    f.consent({
      text: "I agree that ThinkInnov-NexGen may use these details to respond to my enquiry.",
      message: "Please confirm your agreement to continue.",
    }),
  ].join("\n          ");
}

function render() {
  const crumbs = c.crumbsFor("Contact", "contact.html");
  const intro = content.contactIntro;
  return {
    title: "Contact | ThinkInnov-NexGen",
    description: "Contact ThinkInnov-NexGen in Tokyo for a product demonstration, a PLM consultation, digital transformation, implementation, support or partnership enquiries.",
    active: "contact",
    crumbs,
    body: `${c.pageHero({ kicker: "Contact", title: intro.title, intro: intro.text, crumbs })}
    <section class="section">
      <div class="container form-layout">
        <div class="form-main">
          <div class="context" data-enquiry-context hidden>
            <p class="context-title">Passed from the page you were reading</p>
            <ul>${contextData()}</ul>
            <button type="button" class="context-clear" data-context-clear>Remove</button>
          </div>
          ${f.form({
            kind: "contact", action: "contact.php", submit: "Send enquiry",
            fields: `<input type="hidden" name="need" value=""><input type="hidden" name="industry" value=""><input type="hidden" name="size" value="">
          ${fields()}`,
            messages: {
              sending: "Sending your enquiry…",
              success: "Thank you. Your enquiry has been sent.",
              failed: "Your enquiry could not be sent. Please try again, or email us directly.",
              fallback: "This copy of the site cannot send messages. Use the link to send your enquiry from your own email application.",
              mailSubject: "Website enquiry",
            },
          })}
          <noscript><p class="form-noscript">If the form does not send, please email us: <a href="mailto:${config.email}">${esc(config.email)}</a></p></noscript>
        </div>
        <aside class="form-aside" aria-label="Other ways to reach us">
          <h2 class="h-sub">Head office</h2>
          <ul class="contact-lines contact-lines-light">
            <li>${icons.phone}<a href="tel:${config.phoneTel}">${esc(config.phoneDisplay)}</a></li>
            <li>${icons.mail}<a href="mailto:${config.email}">${esc(config.email)}</a></li>
            <li>${icons.map}<span>${esc(config.addressSingle)}<br><a href="${config.mapUrl}" target="_blank" rel="noopener">View map<span class="visually-hidden"> (opens in a new tab)</span></a></span></li>
          </ul>
          <h2 class="h-sub">Branch offices</h2>
          <ul class="plain-list">${config.branches.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          <h2 class="h-sub">What happens to your message</h2>
          <p>The form emails your enquiry to our company address. Nothing is sent until you press “Send enquiry”.</p>
          <p><a href="${site.page("privacy.html")}">Privacy notice</a></p>
          <p>${c.linkArrow(site.page("careers.html"), "Looking for a job? See Careers")}</p>
        </aside>
      </div>
    </section>`,
  };
}

module.exports = { routes: [{ path: "contact.html", render }] };
