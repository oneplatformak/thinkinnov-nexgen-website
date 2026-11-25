/** Careers: culture, then all 18 roles with filters that work on top of a plain list. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

const ci = content.careersIntro;

function filters() {
  const options = (map) => Object.entries(map).map(([key, label]) => `<option value="${key}">${esc(label)}</option>`).join("");
  return `<form class="filters" role="search" aria-label="Filter roles" data-role-filters data-js-only hidden>
        <div class="field">
          <label class="field-label" for="role-q">Search roles</label>
          <div class="search-input">${icons.search}<input type="search" id="role-q" name="q" autocomplete="off" placeholder="Title or keyword"></div>
        </div>
        <div class="field">
          <label class="field-label" for="role-discipline">Discipline</label>
          <select id="role-discipline" name="discipline"><option value="">All disciplines</option>${options(content.disciplines)}</select>
        </div>
        <div class="field">
          <label class="field-label" for="role-band">Experience</label>
          <select id="role-band" name="band"><option value="">Any experience</option>${options(content.bands)}</select>
        </div>
        <button type="reset" class="btn btn-ghost btn-sm">Clear filters</button>
      </form>
      <p class="filters-count" role="status" aria-live="polite" data-role-count data-l10n-count="{n} of {total} roles shown" data-l10n-none="No roles match these filters."></p>`;
}

function role(job) {
  return `<li class="role" data-role data-discipline="${job.discipline}" data-band="${job.band}">
          <a class="role-link" href="${site.page(`careers/${job.slug}.html`)}">
            <span class="role-n">${pad2(job.id)}</span>
            <span class="role-main">
              <span class="role-title">${esc(job.title)}</span>
              <span class="role-text">${esc(job.listing)}</span>
            </span>
            <span class="role-meta">
              <span class="role-discipline">${esc(content.disciplines[job.discipline])}</span>
              <span>${esc(job.experience)}</span>
              <span>${esc(job.location)}</span>
              <span>${esc(job.employment)}</span>
            </span>
            ${icons.arrow}
          </a>
        </li>`;
}

function render() {
  const crumbs = c.crumbsFor(ci.title, "careers.html");
  return {
    title: "Careers | ThinkInnov-NexGen",
    description: "Careers at ThinkInnov-NexGen: 18 roles across Teamcenter, Capital, NX, Mendix, PLM administration, project management and sales, with role details and how to apply.",
    active: "careers",
    crumbs,
    body: [
      c.pageHero({ kicker: ci.kicker, title: ci.title, intro: ci.intro, crumbs }),
      `<section class="section section-tint" id="culture">
        <div class="container split">
          <div>${c.sectionHead({ n: 1, kicker: "Culture", title: ci.cultureTitle })}</div>
          <div class="prose"><p class="lead">${esc(ci.cultureText)}</p>${c.linkArrow(site.page("behind-the-brand.html#team"), "Meet the delivery team")}</div>
        </div>
      </section>`,
      `<section class="section" id="roles">
        <div class="container">
          ${c.sectionHead({ n: 2, kicker: "Roles", title: ci.areasTitle })}
          ${filters()}
          <ol class="roles" data-role-list>${content.jobs.map(role).join("")}</ol>
          <p class="note note-wide roles-note">The discipline shown with each role and the experience ranges in the filter are this site's grouping of the role titles and of the experience each role states, added to make the list easier to search. They are not part of the job descriptions.</p>
        </div>
      </section>`,
      c.ctaBand({
        title: ci.ctaTitle,
        actions: [[site.page("apply.html"), ci.ctaLabel]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "careers.html", render }] };
