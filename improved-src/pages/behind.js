/** Behind the Brand: the problems we solve and the delivery team. */
const site = require("../lib/site");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

const b = content.behind;

function problems() {
  const items = b.problems
    .map(
      ([key, title, text], i) => `<li class="problem">
          <span class="problem-n" aria-hidden="true">${pad2(i + 1)}</span>
          <h3>${esc(title)}</h3>
          <p>${esc(text)}</p>
          ${c.linkArrow(site.page(`solutions.html#need-${key}`), "See what helps")}
        </li>`
    )
    .join("");
  return `<section class="section" id="problem">
    <div class="container">
      ${c.sectionHead({ n: 1, kicker: "Problems", title: b.problemTitle, text: b.problemText })}
      <ol class="problems">${items}</ol>
    </div>
  </section>`;
}

function team() {
  return `<section class="section section-tint" id="team">
    <div class="container">
      ${c.sectionHead({ n: 2, kicker: "People", title: b.teamTitle, text: b.teamText })}
      <ul class="people">${b.team.map((p) => c.person(p)).join("")}</ul>
      <p class="after-list">${c.linkArrow(site.page("about.html#leadership"), "Executive leadership")}</p>
    </div>
  </section>`;
}

function render() {
  const crumbs = c.crumbsFor(b.title, "behind-the-brand.html");
  return {
    title: "Behind the Brand | ThinkInnov-NexGen",
    description: "The problems ThinkInnov-NexGen solves in new product development, and the delivery leaders and specialists who solve them.",
    active: "behind",
    crumbs,
    body: [
      c.pageHero({ kicker: b.kicker, title: b.title, intro: b.intro, crumbs }),
      problems(), team(),
      c.ctaBand({
        title: content.careersIntro.cultureTitle,
        text: content.careersIntro.intro,
        actions: [[site.page("careers.html"), "Careers"], [c.contactHref({ type: "general" }), "Contact us", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "behind-the-brand.html", render }] };
