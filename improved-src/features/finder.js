/**
 * Finder by business need. Rule-based: every suggestion is written down in
 * content/relations.js together with the staging sentence that supports it.
 * All panels are in the HTML; scripts/finder.js shows one at a time and adds
 * the optional industry and company-size context.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const { productMark, contactHref } = require("../lib/components");
const content = require("../content");

function needPanel(need, index) {
  const blocks = [];
  if (need.solutions.length) {
    blocks.push(`<div class="need-block">
            <h4>Solutions</h4>
            <ul class="need-list">${need.solutions
              .map((key) => {
                const s = content.solutionByKey[key];
                return `<li><a href="${site.page(`solutions.html#${s.key}`)}"><span class="need-item-title">${esc(s.title)}</span><span class="need-item-text">${esc(s.text)}</span></a></li>`;
              })
              .join("")}</ul>
          </div>`);
  }
  if (need.products.length) {
    blocks.push(`<div class="need-block">
            <h4>Siemens products</h4>
            <ul class="chips">${need.products
              .map((key) => {
                const p = content.productByKey[key];
                return `<li><a class="chip chip-product" href="${site.page(`products.html#${p.key}`)}">${productMark(p, "sm")}<span><span class="chip-label">${esc(p.name)}</span><span class="chip-small">${esc(p.category)}</span></span></a></li>`;
              })
              .join("")}</ul>
          </div>`);
  }
  if (need.services.length) {
    blocks.push(`<div class="need-block">
            <h4>Services</h4>
            <ul class="chips">${need.services
              .map(([phase, item]) => {
                const svc = content.serviceByKey[phase];
                return `<li><a class="chip" href="${site.page(`services.html#${phase}`)}"><span><span class="chip-label">${esc(item)}</span><span class="chip-small">${esc(svc.title)}</span></span>${icons.arrow}</a></li>`;
              })
              .join("")}</ul>
          </div>`);
  }
  if (need.links.length) {
    blocks.push(`<div class="need-block">
            <h4>Related on this site</h4>
            <ul class="chips">${need.links
              .map(([href, label]) => `<li><a class="chip" href="${site.page(href)}"><span class="chip-label">${esc(label)}</span>${icons.arrow}</a></li>`)
              .join("")}</ul>
          </div>`);
  }
  return `<article class="need" id="need-${need.key}" data-need-panel="${need.key}" tabindex="-1">
          <p class="need-count">${pad2(index + 1)}</p>
          <h3>${esc(need.title)}</h3>
          <p class="need-source"><span class="need-source-label">What our site says</span> ${esc(need.source)}</p>
          ${blocks.join("")}
          <p class="need-cta"><a class="btn btn-primary" href="${contactHref({ type: "consultation", need: need.key })}" data-need-cta>Discuss this need with us${icons.arrow}</a></p>
        </article>`;
}

function contextControls() {
  const industries = content.industries.map((i) => `<option value="${i.key}">${esc(i.title)}</option>`).join("");
  const sizes = content.plm.businessSize.cards.map(([key, title]) => `<option value="${key}">${esc(title)}</option>`).join("");
  const industryNotes = content.industries
    .map(
      (i) =>
        `<p class="finder-note" data-industry-note="${i.key}" hidden><a href="${site.page(`industries.html#${i.key}`)}">${esc(i.title)}</a> <span>${esc(i.text)}</span></p>`
    )
    .join("");
  const sizeNotes = content.plm.businessSize.cards
    .map(
      ([key, title, text]) =>
        `<p class="finder-note" data-size-note="${key}" hidden><a href="${site.page("plm.html#business-size")}">${esc(title)}</a> <span>${esc(text)}</span></p>`
    )
    .join("");
  return `<div class="finder-context" data-finder-context data-js-only hidden>
          <p class="finder-context-title">Optional: add your context</p>
          <div class="finder-fields">
            <label class="field"><span class="field-label">Industry</span>
              <select data-finder-industry><option value="">Not specified</option>${industries}</select>
            </label>
            <label class="field"><span class="field-label">Company size</span>
              <select data-finder-size><option value="">Not specified</option>${sizes}</select>
            </label>
          </div>
          <div class="finder-notes" aria-live="polite">${industryNotes}${sizeNotes}</div>
          <p class="finder-context-help">Your choices do not change the suggestions. They show the related page and are passed to the contact form.</p>
        </div>`;
}

function finder({ level = 2 } = {}) {
  let n = 0;
  const groups = content.needGroups
    .map((group) => {
      const items = content.needs
        .filter((need) => need.group === group.key)
        .map((need) => {
          n += 1;
          return `<li><a href="#need-${need.key}" data-need-link="${need.key}"><span class="finder-n">${pad2(n)}</span><span>${esc(need.title)}</span></a></li>`;
        })
        .join("");
      return `<div class="finder-group"><h3>${esc(group.title)}</h3><ul>${items}</ul></div>`;
    })
    .join("");
  return `<div class="finder" data-finder>
        <nav class="finder-needs" aria-label="Business needs">${groups}${contextControls()}</nav>
        <div class="finder-panels" data-finder-panels>${content.needs.map(needPanel).join("")}</div>
      </div>`;
}

module.exports = { finder };
