/** One page per role. Content is the staging job data only; no JobPosting markup. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc } = require("../lib/html");
const i18n = require("../i18n");
const c = require("../lib/components");
const config = require("../config");
const content = require("../content");

function render(job) {
  const path = `careers/${job.slug}.html`;
  const crumbs = c.crumbsFor(job.title, path, [{ label: "Careers", path: "careers.html" }]);
  const related = content.jobs.filter((j) => j.discipline === job.discipline && j.id !== job.id).slice(0, 4);
  const applyHref = site.page(`apply.html?job=${job.slug}`);
  const facts = [
    ["Experience", job.experience],
    ["Location", job.location],
    ["Employment type", job.employment],
    ["Discipline", content.disciplines[job.discipline]],
  ]
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("");
  const list = (items) => `<ul class="ticks">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  return {
    title: `${job.title} | Careers | ThinkInnov-NexGen`,
    description: `${job.title} at ThinkInnov-NexGen (${job.location}, ${job.experience}). ${job.summary}`,
    descriptionJa: `ThinkInnov-NexGenの募集職種：${i18n.t(job.title)}（${i18n.t(job.location)}、${i18n.t(job.experience)}）。${i18n.t(job.summary)}`,
    active: "careers",
    crumbs,
    body: `<section class="page-hero job-hero">
      <div class="container">
        ${c.breadcrumbs(crumbs)}
        <div class="page-hero-grid">
          <div class="page-hero-text">
            <p class="kicker"><span>ThinkInnov-NexGen</span> · <span>${esc(job.employment)}</span></p>
            <h1>${esc(job.title)}</h1>
            <p class="lead">${esc(job.summary)}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container job-layout">
        <div class="job-body">
          <h2>Responsibilities</h2>
          ${list(job.responsibilities)}
          <h2>Required skills</h2>
          ${list(job.skills)}
        </div>
        <aside class="job-aside" aria-label="About this role">
          <dl class="facts facts-compact">${facts}</dl>
          <div class="job-actions">
            <a class="btn btn-primary btn-block" href="${applyHref}">I'm interested${icons.arrow}</a>
            <a class="btn btn-ghost btn-block" href="mailto:?subject=${encodeURIComponent(`${job.title} — ThinkInnov-NexGen`)}&amp;body=${encodeURIComponent(site.absolute(path, site.lang()))}">Share job via email${icons.mail}</a>
          </div>
          <p class="job-contact">Questions about this role? <a href="mailto:${config.email}">${esc(config.email)}</a></p>
        </aside>
      </div>
    </section>
    ${
      related.length
        ? `<section class="section section-tint">
      <div class="container">
        <h2 class="h-sub">Other roles in ${esc(content.disciplines[job.discipline])}</h2>
        ${c.relatedList(related.map((j) => [site.page(`careers/${j.slug}.html`), j.title, j.experience]), { cls: "related-cols" })}
        <p class="after-list">${c.linkArrow(site.page("careers.html#roles"), "All roles")}</p>
      </div>
    </section>`
        : ""
    }`,
  };
}

module.exports = {
  routes: content.jobs.map((job) => ({ path: `careers/${job.slug}.html`, render: () => render(job) })),
};
