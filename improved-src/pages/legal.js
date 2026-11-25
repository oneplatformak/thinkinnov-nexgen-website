/**
 * Governance pages: privacy notice, accessibility statement, HTML sitemap.
 * The privacy notice states only what the site's code does. It makes no
 * claims about retention, legal basis or legal compliance: those need the
 * company's legal adviser (see notes/REVIEW.md).
 */
const site = require("../lib/site");
const { esc, verbatim } = require("../lib/html");
const c = require("../lib/components");
const nav = require("../lib/nav");
const config = require("../config");
const content = require("../content");

function doc(sections) {
  const toc = sections.map(([id, title]) => `<li><a href="#${id}">${esc(title)}</a></li>`).join("");
  const body = sections
    .map(([id, title, html]) => `<section class="doc-section" id="${id}"><h2>${esc(title)}</h2>${html}</section>`)
    .join("");
  return `<section class="section">
      <div class="container doc-layout">
        <nav class="doc-toc" aria-label="On this page"><p class="page-index-title">On this page</p><ol>${toc}</ol></nav>
        <div class="doc">${body}</div>
      </div>
    </section>`;
}

const p = (text) => `<p>${esc(text)}</p>`;
const list = (items) => `<ul class="ticks">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

function contactBlock() {
  return `<p>ThinkInnov-NexGen<br>${esc(config.addressSingle)}<br><a href="mailto:${config.email}">${esc(config.email)}</a><br><a href="tel:${config.phoneTel}">${esc(config.phoneDisplay)}</a></p>`;
}

function privacy() {
  const crumbs = c.crumbsFor("Privacy notice", "privacy.html");
  const sections = [
    ["scope", "What this notice covers", p("This notice describes what this website collects when you use its two forms, why, and where that information goes. It describes the website only.")],
    ["contact-form", "Contact form",
      p("When you send the contact form, the website collects what you enter:") +
      list(["Enquiry type and, if you choose one, a topic", "Name", "Company, if given", "Email address", "Phone number, if given", "Your message"]) +
      p("If you arrived from the finder or from a product, solution, industry or service page, the form also carries the business need, industry, company size or topic you selected there. This is shown above the form and you can remove it before sending.") +
      p("To carry that selection from page to page, your browser keeps it in session storage for the current tab. It is not sent to us unless you send the contact form, and it is cleared when you remove it, send the form or close the tab.") +
      p("We use this information to respond to your enquiry.")],
    ["application-form", "Job application form",
      p("When you send the application form, the website collects what you enter:") +
      list(["The role you are applying for, if selected", "First and last name", "Email address and contact number", "Year of graduation", "Overall experience and current employer", "Skill set", "How you found the vacancy", "Current and preferred location", "The CV file you attach", "Gender, if given", "Current and expected CTC (cost to company), if given", "Notice period, if given"]) +
      p("Gender, current and expected CTC and notice period are optional. You can leave them blank and still apply.") +
      p("We use this information to consider your application.")],
    ["where", "Where the information goes",
      p("Each form sends what you entered to the website's server, which emails it to the company address shown below. The website has no database and does not keep a copy of your submission after the email has been handed to the mail system.") +
      p("To limit abuse of the forms, the server keeps a temporary count of recent submissions for each sender, identified by a one-way hash of the IP address. The forms also contain a hidden field and record the time the form was opened, which are used only to tell people from automated senders.")],
    ["cookies", "Cookies, analytics and tracking",
      p("This website does not use analytics, advertising or tracking cookies, and does not load fonts, scripts or images from other companies.") +
      p("If you switch language, or dismiss the language suggestion, your choice is saved in your browser's local storage so that the site can offer that language next time. It is not sent to us.") +
      p("The search page matches what you type against a list of this website's pages inside your browser. What you search for is not sent to us or recorded.") +
      p("Links to other websites, such as the map link and the links to Siemens product pages, open those websites, which have their own privacy notices.")],
    ["questions", "Questions and requests", p("To ask about the information you have sent us through this website, or to ask us to correct or delete it, contact us:") + contactBlock()],
  ];
  return {
    title: "Privacy notice | ThinkInnov-NexGen",
    description: "What the ThinkInnov-NexGen website collects through its contact and job application forms, why, and where it goes. The site uses no analytics or tracking cookies.",
    crumbs,
    body: c.pageHero({ kicker: "Website", title: "Privacy notice", intro: "What this website collects, why, and where it goes.", crumbs }) + doc(sections),
  };
}

function accessibility() {
  const crumbs = c.crumbsFor("Accessibility", "accessibility.html");
  const sections = [
    ["approach", "How this website was built",
      list([
        "Pages use headings, landmarks and lists so that they can be navigated by structure.",
        "Every interactive element can be reached and operated with a keyboard, and shows a visible focus indicator.",
        "A “Skip to content” link is the first item on every page.",
        "The lifecycle diagram, the finder and the career filters present their full content as ordinary text and links when scripts are not available.",
        "Animation is limited, and is switched off when your device asks for reduced motion.",
        "English and Japanese pages declare their language, and English quotations on Japanese pages are marked as English.",
        "Photographs have text alternatives; decorative graphics are hidden from assistive technology.",
      ])],
    ["tested", "What was tested",
      p("Before publication the pages were checked in Google Chrome on a desktop computer, in English and Japanese:") +
      list([
        "An automated scan of every page with axe-core, at a phone width and a desktop width.",
        "Automated accessibility audits with Lighthouse on the home page and representative inner pages.",
        "Scripted keyboard tests of the menus, the lifecycle diagram, the finder, the career filters, the photo viewer, the language switch, the search page and both forms.",
        "Layout checks at sixteen screen widths from 320 to 2560 pixels.",
        "Contrast of text colours against their backgrounds.",
      ])],
    ["not-tested", "What was not tested",
      list([
        "Screen readers such as NVDA, JAWS, VoiceOver or TalkBack.",
        "Browsers other than Google Chrome, and physical phones or tablets.",
        "Voice control, switch devices and screen magnifiers.",
      ]) +
      p("Because of this we do not claim conformance with any accessibility standard.")],
    ["known", "Known limitations",
      list([
        "The nine industry infographics are images that contain text. Each has a short description beside it, but the full text of the image is not available as text.",
        "Customer logos are images of each company's own logo, labelled with the company name.",
      ])],
    ["feedback", "Tell us about a problem", p("If you cannot use part of this website, please tell us and we will help you with the information you need:") + contactBlock()],
  ];
  return {
    title: "Accessibility | ThinkInnov-NexGen",
    description: "How the ThinkInnov-NexGen website was built for accessibility, what was tested, what was not, known limitations and how to report a problem.",
    crumbs,
    body: c.pageHero({ kicker: "Website", title: "Accessibility", intro: "How this website was built, what was tested and what was not.", crumbs }) + doc(sections),
  };
}

function sitemap() {
  const crumbs = c.crumbsFor("Sitemap", "sitemap.html");
  const groups = nav.structure().map((item) => {
    const links = item.href
      ? [[site.page(item.href), item.label]]
      : [...item.groups.flatMap((g) => g.links.map((l) => [nav.linkHref(l), l.label])), ...(item.more ? [[site.page(item.more.href), item.more.label]] : [])];
    return [item.label, links];
  });
  groups.push(["Careers", content.jobs.map((job) => [site.page(`careers/${job.slug}.html`), job.title])]);
  groups.push(["Solutions", content.solutions.map((s) => [site.page(`solutions.html#${s.key}`), s.title])]);
  groups.push(["Industries", content.industries.map((i) => [site.page(`industries.html#${i.key}`), i.title])]);
  groups.push(["Website", [[site.page("apply.html"), "Apply"], [site.page("search.html"), "Search"], [site.page("privacy.html"), "Privacy notice"], [site.page("accessibility.html"), "Accessibility"], [site.alternate(site.isJa() ? "en" : "ja"), site.isJa() ? "English" : "日本語"]]]);
  const html = groups
    .map(([title, links]) => `<section class="sitemap-group"><h2>${esc(title)}</h2><ul>${links.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ul></section>`)
    .join("");
  return {
    title: "Sitemap | ThinkInnov-NexGen",
    description: "Every page of the ThinkInnov-NexGen website: what we do, products, solutions, industries, company, careers and website information.",
    crumbs,
    body: c.pageHero({ kicker: "Website", title: "Sitemap", intro: "Every page on this website.", crumbs }) + `<section class="section"><div class="container sitemap">${html}</div></section>`,
  };
}

module.exports = {
  routes: [
    { path: "privacy.html", render: privacy },
    { path: "accessibility.html", render: accessibility },
    { path: "sitemap.html", render: sitemap },
  ],
};
