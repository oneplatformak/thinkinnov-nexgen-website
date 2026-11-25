/**
 * Explicit relationships between the items on the site. The lifecycle
 * diagram, the finder, the product sections and the contact form all read
 * from here, so a recommendation can only appear if it is written down in
 * this file with the staging text that supports it (`basis`).
 *
 * Keys refer to: products and solutions in offerings.js (by key), service
 * phases in offerings.js (by key), and page anchors.
 */

/* ---- Which product each solution relates to, and why ---- */
const solutionProducts = {
  "design-data-management": { product: "teamcenter", basis: "Staging describes Teamcenter as lifecycle management for product data, collaboration and change control." },
  "engineering-change-management": { product: "teamcenter", basis: "Staging describes Teamcenter as covering change control; the Tech Lead role lists Change Management as a Teamcenter module." },
  "requirements-management": { product: "teamcenter", basis: "The Tech Lead role lists Requirements Management as a Teamcenter module." },
  "active-integration": { product: "teamcenter", basis: "The solution text names the Teamcenter connection platform." },
  "teamcenter-gateway-sap": { product: "teamcenter", basis: "Named in the solution title." },
  "teamcenter-gateway-oracle": { product: "teamcenter", basis: "Named in the solution title." },
  "nx-programming-customization": { product: "nx", basis: "Named in the solution title." },
  "mendix-low-code": { product: "mendix", basis: "Named in the solution title." },
  "digital-factory-enterprise": { product: "tecnomatix", basis: "Staging describes both as digital manufacturing." },
};

/* ---- Service items or expertise the source ties to a solution by name ---- */
const solutionServices = {
  "nx-programming-customization": { href: "services.html#implementation", label: "Customization", small: "Implementation", basis: "Both the solution and the service item are about customization." },
  "active-integration": { href: "about.html#partnership", label: "Digital thread delivery combining PLM, ERP and MES", small: "Key Value Drivers", basis: "The solution text and the Key Value Driver both name the digital thread with ERP and MES." },
  "teamcenter-gateway-sap": { href: "about.html#partnership", label: "SAP is listed among our areas of expertise", small: "Key Value Drivers", basis: "Key Value Drivers: “Expertise: … Mendix, SAP, …”" },
  "mendix-low-code": { href: "about.html#partnership", label: "Mendix is listed among our areas of expertise", small: "Key Value Drivers", basis: "Key Value Drivers: “Expertise: … Teamcenter, Mendix, …”" },
};

/* ---- Editorial grouping of the 15 solutions (navigation only) ---- */
const solutionGroups = [
  { key: "data", title: "Product data and reuse", items: ["design-data-management", "3d-shape-search", "simulation-process-data-management"] },
  { key: "quality", title: "Quality and verification", items: ["quality-management", "quality-issue-management", "design-verification-management"] },
  { key: "change", title: "Requirements, change and projects", items: ["requirements-management", "engineering-change-management", "project-management"] },
  { key: "integration", title: "Enterprise integration", items: ["active-integration", "teamcenter-gateway-sap", "teamcenter-gateway-oracle"] },
  { key: "extend", title: "Manufacturing, low-code and customization", items: ["digital-factory-enterprise", "mendix-low-code", "nx-programming-customization"] },
];

/* ---- Product lifecycle stages ----
 * `text` is general education about the stage, not a claim about the company.
 * `products`, `solutions` and `links` must be supported by staging text. */
const lifecycle = [
  {
    key: "idea", title: "Idea",
    text: "Ideas and market needs are captured and assessed so that the strongest candidates move forward as product decisions.",
    products: [], solutions: [],
    links: [["plm.html#npd", "Structured Ideation in the NPD process"]],
  },
  {
    key: "requirements", title: "Requirements",
    text: "Customer, internal and regulatory needs are written down as requirements that the product must satisfy and can later be verified against.",
    products: ["teamcenter"], solutions: ["requirements-management", "design-verification-management"],
    links: [],
  },
  {
    key: "design", title: "Design",
    text: "Mechanical and electrical teams define the product in 3D models and schematics, reusing existing parts and knowledge where they can.",
    products: ["nx", "solid-edge", "capital"], solutions: ["3d-shape-search", "nx-programming-customization", "design-data-management"],
    links: [["plm.html#npd", "Collaborative Design in the NPD process"]],
  },
  {
    key: "engineering", title: "Engineering",
    text: "Design data is released, revised and configured under change control so that every team works from the same product definition.",
    products: ["teamcenter"], solutions: ["design-data-management", "engineering-change-management"],
    links: [],
  },
  {
    key: "validation", title: "Validation",
    text: "Simulation and testing check the design against its requirements before it is committed to production.",
    products: [], solutions: ["design-verification-management", "simulation-process-data-management"],
    links: [],
  },
  {
    key: "manufacturing", title: "Manufacturing",
    text: "Production processes are planned, and engineering data is handed over to the ERP and MES systems that run the factory.",
    products: ["tecnomatix"], solutions: ["digital-factory-enterprise", "active-integration", "teamcenter-gateway-sap", "teamcenter-gateway-oracle"],
    links: [],
  },
  {
    key: "quality", title: "Quality",
    text: "Quality is planned alongside the design, followed through production, and issues are traced back to their cause.",
    products: [], solutions: ["quality-management", "quality-issue-management"],
    links: [],
  },
  {
    key: "service", title: "Service",
    text: "Products in use generate real-world feedback that shows how they actually perform.",
    products: [], solutions: [],
    links: [["digital-transformation.html#outcomes", "Closed Loop Design"]],
  },
  {
    key: "improvement", title: "Continuous improvement",
    text: "Feedback and lessons learned return to design as changes, so the next revision starts from what is already known.",
    products: [], solutions: ["engineering-change-management", "quality-management", "3d-shape-search"],
    links: [["digital-transformation.html#pdmm", "Product Data Maturity Model"]],
  },
];

// Present at every stage, per the staging product descriptions.
const lifecycleAcross = {
  products: ["teamcenter", "mendix"],
  solutions: ["project-management"],
};

// Stages each product is shown against in the portfolio map.
const productStages = {
  nx: ["design"],
  "solid-edge": ["design"],
  capital: ["design"],
  teamcenter: lifecycle.map((s) => s.key),
  tecnomatix: ["manufacturing"],
  mendix: [],
};

// Expertise terms from the staging "Key Value Drivers" list that name each product's field.
const productExpertise = {
  nx: "MCAD",
  "solid-edge": "MCAD",
  capital: "ECAD",
  teamcenter: "Teamcenter",
  mendix: "Mendix",
};

/* ---- Business needs for the finder ----
 * `source` is the sentence on this site, word for word and in full, that
 * justifies showing these items (check-source.py compares them). `services` are [phase key, item] pairs. */
const needGroups = [
  { key: "npd", title: "New product development issues" },
  { key: "specific", title: "Specific needs" },
];

const needs = [
  {
    key: "unlock-data", group: "npd", title: "We collect product data but gain little insight from it",
    source: "Digital & technology disruption facilitated collecting a lot of product data, but making meaningful information & insights out of the product data needs a well-defined digital foundation and vision; lack of it reduces the effective usage of existing product data.",
    solutions: ["design-data-management", "simulation-process-data-management"], products: ["teamcenter"],
    services: [["pre-implementation", "Strategic business consulting"]],
    links: [["digital-transformation.html#pdmm", "Product Data Maturity Model"], ["digital-transformation.html#outcomes", "Process Data"]],
  },
  {
    key: "reuse-ip", group: "npd", title: "We want to reuse existing designs and IP in new products",
    source: "Re-using the existing IP during the new product development is the biggest opportunity for the companies to reduce new product development cost & time.",
    solutions: ["3d-shape-search", "simulation-process-data-management", "design-data-management"], products: ["teamcenter"],
    services: [],
    links: [["plm.html#benefits", "Synchronize: find, share and reuse product data"]],
  },
  {
    key: "duplication", group: "npd", title: "Duplicate parts and systems keep appearing",
    source: "System(s) / part(s) duplication is the main concern area for the companies in new product introduction.",
    solutions: ["3d-shape-search", "design-data-management"], products: ["teamcenter"],
    services: [],
    links: [],
  },
  {
    key: "predict", group: "npd", title: "We cannot predict product performance early enough",
    source: "Predicting the performance of the new product is not possible at the early stages of the product development.",
    solutions: ["simulation-process-data-management", "design-verification-management"], products: [],
    services: [],
    links: [["digital-transformation.html#pdmm", "PDMM L4: Innovation Platform"], ["digital-transformation.html#outcomes", "Predictive Innovation"]],
  },
  {
    key: "time-to-market", group: "specific", title: "Shorten the product development cycle",
    source: "Reduce product development cycle time and rapidly search, revise and manage design data and product configurations.",
    solutions: ["design-data-management"], products: ["teamcenter"],
    services: [],
    links: [["plm.html#benefits", "Benefits of PLM"], ["plm.html#npd", "New Product Development Process"]],
  },
  {
    key: "quality", group: "specific", title: "Manage quality from planning to production",
    source: "Support the full quality lifecycle from planning to production and lessons learned for the next planning cycle.",
    solutions: ["quality-management", "quality-issue-management"], products: [],
    services: [],
    links: [],
  },
  {
    key: "change", group: "specific", title: "Keep engineering change under control",
    source: "Continuously improve product offerings with best practice solutions for rapid change and full change management using a leading PLM digital enterprise backbone.",
    solutions: ["engineering-change-management"], products: ["teamcenter"],
    services: [],
    links: [],
  },
  {
    key: "requirements", group: "specific", title: "Manage requirements and verify designs against them",
    source: "Requirements are the blueprint for product development, but traditional paper and document-driven approaches are not sufficient for meeting complex customer needs.",
    solutions: ["requirements-management", "design-verification-management"], products: ["teamcenter"],
    services: [],
    links: [],
  },
  {
    key: "integrate", group: "specific", title: "Connect PLM with ERP and MES",
    source: "Realize your digital threads with ERP, MES and enterprise applications by using the Teamcenter connection platform.",
    solutions: ["active-integration", "teamcenter-gateway-sap", "teamcenter-gateway-oracle"], products: ["teamcenter"],
    services: [],
    links: [["about.html#partnership", "Digital thread delivery combining PLM, ERP and MES"]],
  },
  {
    key: "manufacturing", group: "specific", title: "Plan and digitalize manufacturing",
    source: "Digitalization helps companies respond to rapidly changing industrial challenges, geopolitical tensions, technological change, labour markets and climate impact.",
    solutions: ["digital-factory-enterprise"], products: ["tecnomatix"],
    services: [],
    links: [],
  },
  {
    key: "apps", group: "specific", title: "Build business applications faster",
    source: "Build, integrate and deploy applications rapidly while improving collaboration and agility in a dynamic digital landscape.",
    solutions: ["mendix-low-code"], products: ["mendix"],
    services: [],
    links: [],
  },
  {
    key: "cad", group: "specific", title: "Extend or tailor our NX environment",
    source: "NX programming and customization software tools help companies extend and tailor NX capabilities to fit specific needs.",
    solutions: ["nx-programming-customization"], products: ["nx"],
    services: [["implementation", "Customization"]],
    links: [],
  },
  {
    key: "projects", group: "specific", title: "Plan and track development projects",
    source: "With schedule manager, team leaders can create project plans with work breakdown structures and schedule task hierarchy from best-practice templates.",
    solutions: ["project-management"], products: [],
    services: [],
    links: [["plm.html#npd", "Real-Time Tracking in the NPD process"]],
  },
  {
    key: "start", group: "specific", title: "Choose the right PLM and plan the rollout",
    source: "Start-up to enterprise — we have the expertise to guide you to the right software solution, manage the implementation, and provide the training and sustenance support so that you will get the best value from your investment.",
    solutions: [], products: [],
    services: [
      ["pre-implementation", "Strategic business consulting"],
      ["pre-implementation", "Business process re-engineering"],
      ["pre-implementation", "Solution evaluation consulting"],
      ["pre-implementation", "Solution mapping"],
      ["pre-implementation", "Proof of concepts"],
    ],
    links: [["plm.html", "PLM For Everyone"], ["plm.html#deployment", "Deployment options"], ["digital-transformation.html#pdmm", "PLM strategy and roadmap with PDMM"]],
  },
  {
    key: "cloud", group: "specific", title: "Upgrade PLM or move it to the cloud",
    source: "Get Teamcenter delivered any way you want it – on premises or on the cloud – operated by your IT team or Siemens.",
    solutions: [], products: ["teamcenter"],
    services: [["pre-implementation", "Cloud transition & upgrades"]],
    links: [["plm.html#deployment", "Deployment options"], ["industries.html#cloud-saas-plm", "Teamcenter X: The business value of cloud-based SaaS PLM"]],
  },
  {
    key: "support", group: "specific", title: "Keep our PLM running and improving",
    source: "Start-up to enterprise — we have the expertise to guide you to the right software solution, manage the implementation, and provide the training and sustenance support so that you will get the best value from your investment.",
    solutions: [], products: [],
    services: [
      ["post-implementation", "L1 support"],
      ["post-implementation", "L2 support"],
      ["post-implementation", "L3 support"],
      ["post-implementation", "Enhancements"],
      ["pre-implementation", "User enablement by training"],
    ],
    links: [],
  },
];

/* ---- Product pages ----
 * What the source says about ThinkInnov-NexGen's work with each product.
 * `items` are [text shown, link, basis]. Text is source wording; nothing here
 * describes a feature, version, licence or price of the Siemens product. */
const productSupport = {
  nx: {
    items: [
      ["MCAD is listed among the areas of expertise in our Key Value Drivers.", "about.html#partnership", "About, Key Value Drivers: “Expertise: MCAD, ECAD, Teamcenter, Mendix, …”"],
      ["Customization is one of our implementation services.", "services.html#implementation", "Services, Implementation, Development: “Customization”"],
    ],
  },
  "solid-edge": {
    items: [
      ["MCAD is listed among the areas of expertise in our Key Value Drivers.", "about.html#partnership", "About, Key Value Drivers: “Expertise: MCAD, ECAD, Teamcenter, Mendix, …”"],
    ],
  },
  capital: {
    items: [
      ["ECAD is listed among the areas of expertise in our Key Value Drivers.", "about.html#partnership", "About, Key Value Drivers: “Expertise: MCAD, ECAD, Teamcenter, Mendix, …”"],
    ],
  },
  teamcenter: {
    items: [
      ["Teamcenter is listed among the areas of expertise in our Key Value Drivers.", "about.html#partnership", "About, Key Value Drivers: “Expertise: MCAD, ECAD, Teamcenter, Mendix, …”"],
      ["Get Teamcenter delivered any way you want it – on premises or on the cloud – operated by your IT team or Siemens.", "plm.html#deployment", "Home, “PLM your way”"],
      ["Cloud transition & upgrades is one of our pre-implementation services.", "services.html#pre-implementation", "Services, Pre-Implementation, State of the art"],
      ["End-to-end Digital Thread / Digital Transformation delivery combining the expertise of PLM, ERP and MES (onsite & offshore)", "about.html#partnership", "About, Key Value Drivers"],
    ],
  },
  // Nothing on staging names a service or expertise term for Tecnomatix alone.
  tecnomatix: { items: [] },
  mendix: {
    items: [
      ["Mendix is listed among the areas of expertise in our Key Value Drivers.", "about.html#partnership", "About, Key Value Drivers: “Expertise: MCAD, ECAD, Teamcenter, Mendix, …”"],
      ["Move faster from idea to usable application with enterprise-ready low-code delivery.", "", "Home hero, low-code message"],
      ["Build, integrate and deploy applications rapidly while improving collaboration and agility in a dynamic digital landscape.", "", "Home hero, Mendix message"],
    ],
  },
};

/* ---- Industry pages: what each card relates to ----
 * The eleven cards are titles of infographics shown on staging (nine of the
 * images are published; see content/offerings.js). A
 * relation is listed only where the card's own title or description names
 * the product or uses the same words as the related item (`basis`). */
const cloudCard = { need: "cloud", basis: "The card is about Teamcenter X, which staging describes as cloud-based SaaS PLM." };
const industryRelations = {
  "component-manufacturers": {
    products: [], solutions: ["3d-shape-search", "design-data-management"], needs: ["reuse-ip"],
    basis: "Card text: “component design, reuse and supplier collaboration”. 3D Shape Search: “find similar parts and reuse knowledge to consolidate suppliers”.",
  },
  "pdm-to-plm": {
    products: [], solutions: ["design-data-management"], needs: ["start"],
    links: [["digital-transformation.html#pdmm", "Product Data Maturity Model"], ["plm.html", "PLM For Everyone"]],
    basis: "Card text: “move from product data management to connected PLM practices”. PDMM L2: “structured and connected data management”.",
  },
  "aerospace-defense": {
    products: ["teamcenter"], solutions: ["design-verification-management"], needs: ["cloud"],
    basis: "Title names Teamcenter X. Card text: “regulated and complex … programs”. Design Verification Management: “external specification like regulatory authorities”.",
  },
  "industrial-machinery": {
    products: ["teamcenter"], solutions: [], needs: ["cloud"],
    basis: "Title names Teamcenter X.",
  },
  automotive: {
    products: ["teamcenter"], solutions: [], needs: ["cloud", "time-to-market"],
    basis: "Title names Teamcenter X. Card text: “faster launch cycles”. Finder need: “shorten the product development cycle”.",
  },
  battery: { products: ["teamcenter"], solutions: [], needs: ["cloud"], basis: "Title names Teamcenter X." },
  "battery-machine-builders": { products: ["teamcenter"], solutions: [], needs: ["cloud"], basis: "Title names Teamcenter X." },
  "consumer-products": { products: ["teamcenter"], solutions: [], needs: ["cloud"], basis: "Title names Teamcenter X." },
  electronics: {
    products: ["teamcenter"], solutions: ["design-data-management"], needs: ["cloud"],
    basis: "Title names Teamcenter X. Card text: “cross-domain product data”. Design Data Management: “manage design data and product configurations”.",
  },
  marine: { products: ["teamcenter"], solutions: [], needs: ["cloud"], basis: "Title names Teamcenter X." },
  "cloud-saas-plm": {
    products: ["teamcenter"], solutions: [], needs: ["cloud"],
    links: [["plm.html#deployment", "Deployment options"], ["services.html#pre-implementation", "Cloud transition & upgrades"]],
    basis: "Title names Teamcenter X and SaaS. Deployment option: “On cloud, SaaS by Siemens”.",
  },
};

/* ---- Contact form ---- */
const enquiryTypes = [
  ["general", "General enquiry"],
  ["product", "Product enquiry"],
  ["consultation", "PLM consultation"],
  ["dx", "Digital transformation"],
  ["implementation", "Implementation"],
  ["support", "Support"],
  ["partnership", "Partnership"],
];

module.exports = {
  solutionProducts, solutionGroups, lifecycle, lifecycleAcross, productStages, productExpertise,
  needGroups, needs, enquiryTypes, productSupport, industryRelations, cloudCard, solutionServices,
};
