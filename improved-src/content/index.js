/** One import for all content. Edit the files beside this one, then rebuild. */
const { jobs, disciplines, bands } = require("./jobs");
const company = require("./company");
const offerings = require("./offerings");
const relations = require("./relations");
const external = require("./external-claims");

const byKey = (list) => Object.fromEntries(list.map((item) => [item.key, item]));

const productByKey = byKey(offerings.products);
const solutionByKey = byKey(offerings.solutions);
const industryByKey = byKey(offerings.industries);
const serviceByKey = byKey(offerings.services);
const needByKey = byKey(relations.needs);

/** Roles whose title, summary or listing text names the product. */
function rolesForProduct(key) {
  const name = productByKey[key].name.toLowerCase();
  return jobs.filter((job) => `${job.title} ${job.summary} ${job.listing}`.toLowerCase().includes(name));
}

function solutionsForProduct(key) {
  return offerings.solutions.filter((s) => relations.solutionProducts[s.key]?.product === key);
}

function stagesForSolution(key) {
  return relations.lifecycle.filter((stage) => stage.solutions.includes(key));
}

function needsForSolution(key) {
  return relations.needs.filter((need) => need.solutions.includes(key));
}

/** Topics an enquiry can be about: every product, solution, industry and service phase. */
function enquiryTopics() {
  return {
    Products: offerings.products.map((p) => [`product-${p.key}`, p.name]),
    Solutions: offerings.solutions.map((s) => [`solution-${s.key}`, s.title]),
    Industries: offerings.industries.map((i) => [`industry-${i.key}`, i.title]),
    Services: offerings.services.map((s) => [`service-${s.key}`, s.title]),
  };
}

function validate() {
  const problems = [];
  const check = (ok, message) => { if (!ok) problems.push(message); };
  for (const [solution, rel] of Object.entries(relations.solutionProducts)) {
    check(solutionByKey[solution], `solutionProducts: unknown solution ${solution}`);
    check(productByKey[rel.product], `solutionProducts: unknown product ${rel.product}`);
  }
  const grouped = relations.solutionGroups.flatMap((g) => g.items);
  check(grouped.length === offerings.solutions.length && new Set(grouped).size === grouped.length, "solutionGroups must list each solution once");
  grouped.forEach((key) => check(solutionByKey[key], `solutionGroups: unknown solution ${key}`));
  for (const item of [...relations.lifecycle, ...relations.needs, relations.lifecycleAcross]) {
    (item.products || []).forEach((key) => check(productByKey[key], `${item.key}: unknown product ${key}`));
    (item.solutions || []).forEach((key) => check(solutionByKey[key], `${item.key}: unknown solution ${key}`));
    (item.services || []).forEach(([phase, name]) => {
      const svc = serviceByKey[phase];
      const names = svc ? svc.blocks.flatMap(([label, items]) => [label, ...items]) : [];
      check(names.includes(name), `${item.key}: unknown service item ${phase} / ${name}`);
    });
  }
  company.behind.problems.forEach(([key]) => check(needByKey[key], `behind.problems: no finder need ${key}`));
  if (problems.length) throw new Error("Content relations are inconsistent:\n  " + problems.join("\n  "));
}

module.exports = {
  jobs, disciplines, bands,
  ...company, ...offerings, ...relations, external,
  productByKey, solutionByKey, industryByKey, serviceByKey, needByKey,
  rolesForProduct, solutionsForProduct, stagesForSolution, needsForSolution, enquiryTopics, validate,
};
