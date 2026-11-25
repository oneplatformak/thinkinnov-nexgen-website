/**
 * Diagrams drawn in code. They explain concepts from the site's own text;
 * none of them depicts a real system, office or customer.
 */
const { esc, pad2 } = require("./html");
const content = require("../content");

const round = (n) => Math.round(n * 10) / 10;

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [round(cx + r * Math.cos(rad)), round(cy + r * Math.sin(rad))];
}

function cornerMarks(w, h, inset = 10, len = 14) {
  const c = [
    [inset, inset, 1, 1], [w - inset, inset, -1, 1], [inset, h - inset, 1, -1], [w - inset, h - inset, -1, -1],
  ];
  return c.map(([x, y, dx, dy]) => `<path d="M${x + dx * len} ${y}H${x}V${y + dy * len}"/>`).join("");
}

/**
 * Home hero: the lifecycle stages as one loop around the systems the staging
 * text says are connected (PLM, ERP, MES and product knowledge).
 */
function heroLoop() {
  const size = 560;
  const c = size / 2;
  const r = 186;
  const stages = content.lifecycle;
  const step = 360 / stages.length;
  const nodes = stages
    .map((s, i) => {
      const deg = -90 + i * step;
      const [x, y] = polar(c, c, r, deg);
      const [lx, ly] = polar(c, c, r + 26, deg);
      const cos = Math.cos((deg * Math.PI) / 180);
      const anchor = Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";
      const dy = Math.abs(cos) < 0.25 ? (deg < 0 ? -4 : 14) : 4;
      return `<g class="fig-node"><rect x="${x - 5}" y="${y - 5}" width="10" height="10"/><text class="fig-label" x="${lx}" y="${ly + dy}" text-anchor="${anchor}">${esc(s.title)}</text></g>`;
    })
    .join("");
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const [x1, y1] = polar(c, c, r - 14, i * 5);
    const [x2, y2] = polar(c, c, r - (i % 2 ? 18 : 22), i * 5);
    return `M${x1} ${y1}L${x2} ${y2}`;
  }).join("");
  const hub = [
    ["PLM", -62], ["ERP", -20], ["MES", 22],
  ]
    .map(([label, dy]) => `<g><rect class="fig-hub" x="${c - 62}" y="${c + dy}" width="124" height="34"/><text class="fig-hub-label" x="${c}" y="${c + dy + 22}" text-anchor="middle">${label}</text></g>`)
    .join("");
  const [ax, ay] = polar(c, c, r, -90 + step * 2.5);
  return `<figure class="fig fig-hero">
      <svg viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="fig-hero-caption" focusable="false">
        <g class="fig-corners">${cornerMarks(size, size)}</g>
        <path class="fig-ticks" d="${ticks}"/>
        <circle class="fig-ring" cx="${c}" cy="${c}" r="${r}"/>
        <g class="fig-orbit"><circle class="fig-arc" cx="${c}" cy="${c}" r="${r}" pathLength="360" stroke-dasharray="70 290"/></g>
        <path class="fig-link" d="M${c} ${c - 62}V${c - r + 8}M${c} ${c + 56}V${c + r - 8}M${c - 62} ${c - 3}H${c - r + 8}M${c + 62} ${c - 3}H${c + r - 8}"/>
        ${hub}
        <text class="fig-note" x="${c}" y="${c + 84}" text-anchor="middle">Product knowledge</text>
        ${nodes}
        <path class="fig-arrow" d="M${ax - 6} ${ay - 7}L${ax + 5} ${ay}L${ax - 6} ${ay + 7}" transform="rotate(${-90 + step * 2.5 + 90} ${ax} ${ay})"/>
      </svg>
      <figcaption id="fig-hero-caption"><span class="fig-no">Fig. 1</span> The product lifecycle as one connected loop, with PLM, ERP, MES and product knowledge at its centre.</figcaption>
    </figure>`;
}

/** "Consulting, mapping, implementation and adoption" as four connected steps. */
function approachStrip() {
  const steps = ["Consulting", "Mapping", "Implementation", "Adoption"];
  return `<ol class="strip" aria-label="How we work">${steps
    .map((s, i) => `<li><span class="strip-n">${pad2(i + 1)}</span><span class="strip-label">${esc(s)}</span></li>`)
    .join("")}</ol>`;
}

/** PDMM levels as rising steps. Purely presentational; the levels are listed in HTML beside it. */
function maturitySteps() {
  const w = 520;
  const h = 300;
  const levels = content.digitalTransformation.pdmm.levels;
  const sw = 108;
  const steps = levels
    .map(([level], i) => {
      const x = 28 + i * (sw + 12);
      const top = h - 60 - i * 52;
      return `<g><rect class="fig-step fig-step-${i + 1}" x="${x}" y="${top}" width="${sw}" height="${h - 28 - top}"/><text class="fig-step-label" x="${x + 10}" y="${top + 24}">L${i + 1}</text></g>`;
    })
    .join("");
  return `<svg class="fig-maturity" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">
      <g class="fig-corners">${cornerMarks(w, h, 6, 12)}</g>
      <path class="fig-axis" d="M20 ${h - 28}H${w - 16}M20 ${h - 28}V18"/>
      ${steps}
      <path class="fig-trend" d="M40 ${h - 74}L${w - 40} ${h - 74 - 3 * 52 - 10}"/>
    </svg>`;
}

/** Japan and India offices joined by the delivery model named on staging (onsite and offshore). */
function presenceLine() {
  const japan = content.about.locations.filter((l) => l.country === "Japan");
  const india = content.about.locations.filter((l) => l.country === "India");
  const group = (title, list) => `<div class="presence-group">
          <p class="presence-country">${esc(title)}</p>
          <ul>${list.map((l) => `<li><span class="presence-city">${esc(l.city)}</span><span class="presence-role">${esc(l.role)}</span></li>`).join("")}</ul>
        </div>`;
  return `<div class="presence-diagram">
        ${group("Japan", japan)}
        <div class="presence-link" aria-hidden="true"><span>Onsite</span><i></i><span>Offshore</span></div>
        ${group("India", india)}
      </div>`;
}

/**
 * The nine lifecycle stages in a row, with the given stages marked. Text, not
 * an image, so it reads in order and reflows on a phone.
 */
function stageStrip(onKeys) {
  const items = content.lifecycle
    .map((s, i) => {
      const on = onKeys.includes(s.key);
      return `<li class="${on ? "is-on" : ""}"><span class="stage-n">${pad2(i + 1)}</span><span class="stage-name">${esc(s.title)}</span>${on ? '<span class="visually-hidden"> (marked)</span>' : ""}</li>`;
    })
    .join("");
  return `<ol class="stage-strip" aria-label="Lifecycle stages">${items}</ol>`;
}

/** Wraps a conceptual diagram with its label and caption. */
function conceptualFigure(id, svg, caption) {
  return `<figure class="fig fig-concept">
      ${svg.replace("<svg ", `<svg role="img" aria-labelledby="${id}-caption" focusable="false" `)}
      <figcaption id="${id}-caption"><span class="fig-no">Conceptual diagram</span> ${esc(caption)}</figcaption>
    </figure>`;
}

const arrowHead = (id) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>`;

/**
 * "Closed-loop analytics from development to manufacturing to real-world
 * feedback and then back to design" (home page PLM text), drawn as a loop.
 */
function closedLoop() {
  const box = (x, y, w, label, cls = "") => `<g><rect class="fig-box${cls}" x="${x}" y="${y}" width="${w}" height="44"/><text class="fig-box-label" x="${x + w / 2}" y="${y + 28}" text-anchor="middle">${esc(label)}</text></g>`;
  const svg = `<svg viewBox="0 0 400 360">
        ${arrowHead("loop-arrow")}
        <g class="fig-corners">${cornerMarks(400, 360, 4, 12)}</g>
        <g class="fig-flow" marker-end="url(#loop-arrow)">
          <path d="M276 42Q326 46 326 152"/>
          <path d="M326 204Q326 314 292 318"/>
          <path d="M108 318Q74 314 74 206"/>
          <path d="M74 156Q74 46 122 42"/>
        </g>
        ${box(125, 20, 150, "Development")}
        ${box(261, 158, 130, "Manufacturing")}
        ${box(110, 296, 180, "Real-world feedback")}
        ${box(9, 158, 130, "Design", " fig-box-accent")}
        <text class="fig-centre" x="200" y="176" text-anchor="middle">Closed-loop</text>
        <text class="fig-centre" x="200" y="196" text-anchor="middle">analytics</text>
      </svg>`;
  return conceptualFigure("fig-loop", svg, "Development, manufacturing and real-world feedback connected back to design.");
}

/**
 * "Realize your digital threads with ERP, MES and enterprise applications by
 * using the Teamcenter connection platform" (Active Integration Solution),
 * with the two gateways the solutions list names.
 */
function integrationMap() {
  const box = (x, y, w, h, label, sub) => `<g><rect class="fig-box" x="${x}" y="${y}" width="${w}" height="${h}"/><text class="fig-box-label" x="${x + w / 2}" y="${y + (sub ? 24 : h / 2 + 5)}" text-anchor="middle">${esc(label)}</text>${sub ? `<text class="fig-box-sub" x="${x + w / 2}" y="${y + 42}" text-anchor="middle">${esc(sub)}</text>` : ""}</g>`;
  const svg = `<svg viewBox="0 0 400 330">
        ${arrowHead("map-arrow")}
        <g class="fig-corners">${cornerMarks(400, 330, 4, 12)}</g>
        ${box(110, 18, 180, 56, "Teamcenter", "PLM")}
        <g class="fig-flow" marker-end="url(#map-arrow)" marker-start="url(#map-arrow)">
          <path d="M200 80V118"/>
          <path d="M66 164V214"/><path d="M200 164V214"/><path d="M334 164V214"/>
        </g>
        <rect class="fig-bus" x="10" y="122" width="380" height="38"/>
        <text class="fig-bus-label" x="200" y="146" text-anchor="middle">Teamcenter connection platform</text>
        ${box(10, 220, 112, 56, "ERP")}
        ${box(144, 220, 112, 56, "MES")}
        <g><rect class="fig-box" x="278" y="220" width="112" height="56"/><text class="fig-box-label fig-box-label-sm" x="334" y="244" text-anchor="middle">Enterprise</text><text class="fig-box-label fig-box-label-sm" x="334" y="262" text-anchor="middle">applications</text></g>
        <text class="fig-box-sub" x="66" y="298" text-anchor="middle">SAP</text>
        <text class="fig-box-sub" x="66" y="316" text-anchor="middle">Oracle</text>
      </svg>`;
  return conceptualFigure("fig-map", svg, "Teamcenter connected to ERP, MES and enterprise applications through the Teamcenter connection platform.");
}

module.exports = { heroLoop, approachStrip, maturitySteps, presenceLine, stageStrip, closedLoop, integrationMap, cornerMarks, polar };
