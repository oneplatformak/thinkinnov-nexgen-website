/**
 * The product-lifecycle diagram. Rendered as plain links and readable panels;
 * scripts/lifecycle.js upgrades it to an ARIA tab interface.
 * Stage text is general education. Every product and solution link comes from
 * content/relations.js.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const { productMark } = require("../lib/components");
const { polar } = require("../lib/diagrams");
const content = require("../content");

function productItem(key) {
  const p = content.productByKey[key];
  return `<li><a class="chip chip-product" href="${site.page(content.productPath(p.key))}">${productMark(p, "sm")}<span><span class="chip-label">${esc(p.name)}</span><span class="chip-small">${esc(p.category)}</span></span></a></li>`;
}

function solutionItem(key) {
  const s = content.solutionByKey[key];
  return `<li><a class="chip" href="${site.page(`solutions.html#${s.key}`)}"><span class="chip-label">${esc(s.title)}</span>${icons.arrow}</a></li>`;
}

function panel(stage, index, total) {
  const blocks = [];
  if (stage.products.length) {
    blocks.push(`<div class="lc-block"><h4>Siemens products at this stage</h4><ul class="chips">${stage.products.map(productItem).join("")}</ul></div>`);
  }
  if (stage.solutions.length) {
    blocks.push(`<div class="lc-block"><h4>Related solutions</h4><ul class="chips">${stage.solutions.map(solutionItem).join("")}</ul></div>`);
  }
  if (stage.links.length) {
    blocks.push(
      `<div class="lc-block"><h4>Related on this site</h4><ul class="chips">${stage.links
        .map(([href, label]) => `<li><a class="chip" href="${site.page(href)}"><span class="chip-label">${esc(label)}</span>${icons.arrow}</a></li>`)
        .join("")}</ul></div>`
    );
  }
  return `<section class="lc-panel" id="lc-${stage.key}" data-lc-panel>
          <p class="lc-count"><span>${pad2(index + 1)}</span> / ${pad2(total)}</p>
          <h3 id="lc-title-${stage.key}">${esc(stage.title)}</h3>
          <p class="lc-text">${esc(stage.text)}</p>
          ${blocks.join("")}
        </section>`;
}

function lifecycle() {
  const stages = content.lifecycle;
  const step = 360 / stages.length;
  const tabs = stages
    .map((stage, i) => {
      const [x, y] = polar(50, 50, 50, -90 + i * step);
      return `<li style="--x:${x}%;--y:${y}%"><a class="lc-tab" href="#lc-${stage.key}" id="lc-tab-${stage.key}" data-lc-tab><span class="lc-tab-n">${pad2(i + 1)}</span><span class="lc-tab-label">${esc(stage.title)}</span></a></li>`;
    })
    .join("");
  const across = [
    ...content.lifecycleAcross.products.map(productItem),
    ...content.lifecycleAcross.solutions.map(solutionItem),
  ].join("");
  return `<div class="lc" id="lifecycle" data-lifecycle>
        <div class="lc-map">
          <div class="lc-ring">
            <svg class="lc-ring-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="50" vector-effect="non-scaling-stroke"/></svg>
            <div class="lc-centre" aria-hidden="true"><span class="lc-centre-label">Product lifecycle</span><span class="lc-centre-stage" data-lc-current>${esc(stages[0].title)}</span></div>
            <ol class="lc-tabs" aria-label="Lifecycle stages" data-lc-tablist>${tabs}</ol>
          </div>
          <p class="lc-hint" data-js-only hidden>Select a stage, or use the arrow keys, to see what happens there and what relates to it.</p>
        </div>
        <div class="lc-panels">${stages.map((s, i) => panel(s, i, stages.length)).join("")}</div>
        <div class="lc-across">
          <h3>Not tied to a single stage</h3>
          <ul class="chips">${across}</ul>
        </div>
      </div>`;
}

module.exports = { lifecycle };
