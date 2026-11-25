/**
 * What the company offers, from staging (assets/page-data.js and index.html).
 * Meaning preserved; typos and stray capitals fixed. Relationships between
 * these items live in relations.js.
 */

// The three staging hero messages. All three stay on the home page.
const heroMessages = {
  partner: {
    label: "Siemens Solution Partner",
    title: "Your partner for innovation and digital transformation",
    text: "As experts in specific industries, innovative digital technologies and systems, we reliably meet your requirements using Siemens product and system portfolios.",
  },
  innovate: {
    label: "ThinkInnov-NexGen",
    title: "Enable customers to innovate more and faster.",
    text: "Reuse product lifecycle knowledge through innovative digital solutions that improve design, manufacturing and decision-making.",
  },
  mendix: {
    label: "Low code no code platform",
    title: "Mendix accelerates scalable business applications.",
    text: "Build, integrate and deploy applications rapidly while improving collaboration and agility in a dynamic digital landscape.",
  },
};

// Supporting lines that exist in the staging language dictionary.
const supportingLines = {
  coCreated: "The future is co-created",
  foundation: "Connect PLM, ERP, MES and product knowledge into one practical digital foundation.",
  delivery: "On premises, cloud or SaaS delivery aligned to your operating model.",
  lowCode: "Move faster from idea to usable application with enterprise-ready low-code delivery.",
  plmYourWay: "PLM your way",
  plmYourWayText: "Get Teamcenter delivered any way you want it – on premises or on the cloud – operated by your IT team or Siemens.",
};

const homeAbout = {
  title: "End-to-end PLM solutions for consulting, mapping, implementation and adoption",
  text: "ThinkInnov-NexGen combines PLM domain expertise, technical delivery and a consultative approach to help companies build a practical digital thread across product development.",
};

const homePlm = {
  title: "Product Lifecycle Management",
  text: "Collect, analyse and visualize data and processes throughout the product lifecycle. Create closed-loop analytics from development to manufacturing to real-world feedback and then back to design.",
};

const deployment = [
  { key: "on-premises", icon: "building", title: "On premises", text: "Host, manage and support your PLM software with your IT team." },
  { key: "on-cloud", icon: "cloud", title: "On cloud", text: "Choose your cloud provider, managed by your IT team." },
  { key: "saas", icon: "layers", title: "On cloud, SaaS by Siemens", text: "Get started quickly using software as a service. Operation, maintenance and upgrades are included." },
];

const servicesIntro = {
  home: "From startup to enterprise — we guide you to the right software solution, manage implementation, and provide training and ongoing support (sustenance) so you get the best value from your investment.",
  page: "From startup to enterprise, ThinkInnov-NexGen guides teams to the right software solution, manages implementation and supports adoption.",
  kicker: "Consulting to Adoption",
  boardText: "Structured consulting, implementation and sustaining services grouped for clearer reading.",
};

const services = [
  {
    key: "pre-implementation",
    title: "Pre-Implementation",
    blocks: [
      ["Consulting", ["Strategic business consulting", "Business process re-engineering", "Solution evaluation consulting"]],
      ["Sales", ["Solution mapping", "Service positioning", "Proof of concepts"]],
      ["State of the art", ["Cloud transition & upgrades", "User enablement by training"]],
    ],
  },
  {
    key: "implementation",
    title: "Implementation",
    blocks: [
      ["Development", ["Solution architecting", "Technical architecting", "Project management", "Customization", "Configuration"]],
      ["Performance optimization", ["Performance tuning"]],
      ["Infrastructure management", ["Deployment architecture", "System setup"]],
    ],
  },
  {
    key: "post-implementation",
    title: "Post-Implementation",
    blocks: [
      ["Sustaining service", []],
      ["Support", ["L1 support", "L2 support", "L3 support"]],
      // Staging prints "Production Development"; the previous pass read it as
      // a typo for deployment. Listed as an open client question.
      ["Enhancements", ["Requirement analysis", "Design", "Development", "UAT", "Production deployment"]],
    ],
  },
];

// [name, key, monogram, category, description]
const products = [
  ["NX", "nx", "NX", "Design Solutions", "Advanced design solutions for modern product engineering."],
  ["Solid Edge", "solid-edge", "SE", "3D Modeling", "3D modeling tools for efficient product development."],
  ["Capital", "capital", "CAP", "Electrical Design", "Electrical design capabilities for connected engineering workflows."],
  ["Teamcenter", "teamcenter", "Tc", "Lifecycle Management", "Lifecycle management for product data, collaboration and change control."],
  ["Tecnomatix", "tecnomatix", "Tx", "Process Automation", "Process automation and digital manufacturing planning."],
  ["Mendix", "mendix", "mx", "Low Code Development", "Low-code development for connected business applications."],
].map(([name, key, mark, category, text]) => ({ name, key, mark, category, text }));

const productsIntro = {
  kicker: "Siemens Portfolio",
  page: "A catalogue of product development and digital engineering tools for design, modeling, lifecycle management and low-code delivery.",
  home: "Core Siemens solutions for design, lifecycle management, manufacturing automation and low-code development.",
};

// [key, title, description, home title, home blurb]. The last two are the
// shorter texts staging used for the nine solutions previewed on the home page.
const solutions = [
  ["design-data-management", "Design Data Management", "Reduce product development cycle time and rapidly search, revise and manage design data and product configurations.", "Design Data Management", "Reduce development cycle time and manage revisions, configurations and product data."],
  ["3d-shape-search", "3D Shape Search", "Find similar parts and reuse knowledge to consolidate suppliers and make informed decisions.", "3D Shape Search", "Reuse similar parts knowledge to improve sourcing and engineering decisions."],
  ["quality-management", "Quality Management Solution", "Support the full quality lifecycle from planning to production and lessons learned for the next planning cycle.", "Quality Management Solution", "Support quality from planning to production and lessons learned."],
  ["quality-issue-management", "Quality Issue Management Solution", "Integrating quality planning in the design phase is critical to competitive advantage. Engineering data provides the information needed to successfully manage quality projects and real products.", "Quality Issue Management", "Integrate quality planning and manage real product issues during engineering."],
  ["design-verification-management", "Design Verification Management", "Manage the design verification plan as one critical activity in product development. Parts designed and requirements defined by internal specification as well as external specification like regulatory authorities.", "Design Verification Management", "Manage verification plans, requirements and internal or regulatory specifications."],
  ["engineering-change-management", "Engineering Change Management Solution", "Continuously improve product offerings with best practice solutions for rapid change and full change management using a leading PLM digital enterprise backbone.", "Engineering Change Management", "Improve offerings with digital enterprise change and full change management."],
  ["requirements-management", "Requirements Management Solution", "Requirements are the blueprint for product development, but traditional paper and document-driven approaches are not sufficient for meeting complex customer needs.", "Requirements Management", "Manage complex customer needs beyond traditional document-driven approaches."],
  ["mendix-low-code", "Mendix | Low-Code Application Development Platform", "With ever-evolving technology and digital transformation pressures, modern enterprises often need flexible change without relying on legacy systems and outdated tech."],
  ["digital-factory-enterprise", "Digital Factory/Enterprise", "Digitalization helps companies respond to rapidly changing industrial challenges, geopolitical tensions, technological change, labour markets and climate impact.", "Digital Factory / Enterprise", "Meet industrial change with connected digital manufacturing and enterprise tools."],
  ["project-management", "Project Management Solution", "With schedule manager, team leaders can create project plans with work breakdown structures and schedule task hierarchy from best-practice templates."],
  ["active-integration", "Active Integration Solution", "Realize your digital threads with ERP, MES and enterprise applications by using the Teamcenter connection platform.", "Active Integration Solution", "Connect Teamcenter with ERP, MES and enterprise execution systems."],
  ["teamcenter-gateway-sap", "Teamcenter Gateway for SAP Business Suite", "Integrate Teamcenter with SAP S/4HANA or SAP ECC so teams can start or end tasks from either Teamcenter or SAP."],
  ["teamcenter-gateway-oracle", "Teamcenter Gateway for Oracle E-Business Suite", "Combine Teamcenter-managed engineering data and processes with product information and enterprise processes controlled by Oracle ERP."],
  ["nx-programming-customization", "NX programming and customization", "NX programming and customization software tools help companies extend and tailor NX capabilities to fit specific needs."],
  ["simulation-process-data-management", "Simulation process and data management", "Find, share and reuse simulation and test data in a fully integrated multi-discipline PLM environment to improve engineering productivity."],
].map(([key, title, text, homeTitle, homeText]) => ({ key, title, text, homeTitle, homeText }));

// Order of the nine home-page previews on staging.
const homeSolutionOrder = [
  "design-data-management", "3d-shape-search", "quality-management", "quality-issue-management",
  "design-verification-management", "engineering-change-management", "requirements-management",
  "active-integration", "digital-factory-enterprise",
];

const solutionsIntro = {
  kicker: "Engineering Outcomes",
  page: "ThinkInnov-NexGen helps customers progress to the next level of product design innovation, manufacturing efficiency and performance.",
  home: "Focused PLM and engineering solutions for product data, quality, change, integration and digital manufacturing.",
};

// [key, title, description, conceptual image, infographic number]
const industries = [
  ["component-manufacturers", "PLM for Component Manufacturers", "PLM foundations for component design, reuse and supplier collaboration.", "ind-components", 1],
  ["pdm-to-plm", "Siemens SW PDM to PLM", "Move from product data management to connected PLM practices.", "ind-pdm-plm", 2],
  ["aerospace-defense", "Teamcenter X for Aerospace & Defense", "Cloud PLM workflows for regulated and complex aerospace and defense programs.", "ind-aerospace", 3],
  ["industrial-machinery", "Teamcenter X for AME Industrial Machinery", "Advanced manufacturing engineering and machinery-focused lifecycle management.", "ind-machinery", 4],
  ["automotive", "Teamcenter X for Automotive", "Cloud PLM for automotive development, collaboration and faster launch cycles.", "ind-automotive", 5],
  ["battery", "Teamcenter X for Battery", "Support battery product development with connected cloud PLM.", "ind-battery", 6],
  ["battery-machine-builders", "Teamcenter X for Battery Machine Builders", "PLM practices for battery machine builders and production ecosystems.", "ind-battery-machines", 7],
  ["consumer-products", "Teamcenter X for Consumer Products", "Manage consumer product complexity from design through launch.", "ind-consumer", 8],
  ["electronics", "Teamcenter X for Electronics", "Support electronics lifecycle and cross-domain product data.", "ind-electronics", 9],
  ["marine", "Teamcenter X for Marine", "PLM workflows for marine product development.", "ind-marine", 10],
  ["cloud-saas-plm", "Teamcenter X — Cloud-based SaaS PLM", "Understand the business value of cloud-based SaaS PLM with Teamcenter X.", "ind-saas-cloud", 11],
].map(([key, title, text, visual, n]) => ({ key, title, text, visual, n }));

const industriesIntro = {
  kicker: "Industry PLM",
  page: "Industry-specific PLM solutions tailored to accelerate innovation and digital transformation.",
  sectionTitle: "PLM industry focus",
};

const customersIntro = {
  title: "Our key customers",
  text: "Trusted by product-led teams across automotive, aerospace, energy, electrical and manufacturing industries.",
};

const testimonialsIntro = {
  title: "What our clients say",
  text: "Customer feedback from PLM upgrades, implementation pace and long-term support.",
};

const contactIntro = {
  title: "We're here to help and answer any questions you might have.",
  text: "We look forward to hearing from you.",
};

const plm = {
  title: "PLM For Everyone",
  kicker: "Smart PLM Tools",
  navText: "Smart PLM options for startups, SMBs and global enterprises.",
  intro: "PLM should be accessible to businesses of every size, from small startups and micro-industries to global enterprises.",
  benefits: {
    title: "Benefits of PLM",
    text: "PLM reduces time to market, improves quality and sustainability, increases efficiency and lowers costs by helping teams make informed decisions.",
    cards: [
      ["Interconnect", "Bring product and process information together so knowledge is no longer siloed across disconnected systems."],
      ["Synchronize", "Help stakeholders find, share, reuse and automate product data and processes."],
      ["Integrate", "Connect systems and sub-systems to avoid late-stage problems and build accurate definitions earlier."],
      ["Collaborate", "Enable cross-domain collaboration to accelerate innovation and decision-making."],
    ],
  },
  businessSize: {
    title: "Solutions for Every Business Size",
    cards: [
      ["startups", "Startups", "Organize product data, facilitate collaboration, ensure quality and track everything from the beginning."],
      ["smbs", "SMBs", "Simplify data management, enhance communication and accelerate time to market."],
      ["enterprises", "Enterprises", "Gain end-to-end visibility, global collaboration, compliance, risk control and innovation at scale."],
    ],
  },
  npd: {
    title: "New Product Development Process",
    cards: [
      ["Structured Ideation", "Capture and manage ideas with a repeatable path toward product decisions."],
      ["Collaborative Design", "Give teams shared spaces for design, review and product definition."],
      ["Real-Time Tracking", "Track milestones, quality controls and commercialization readiness."],
    ],
  },
  why: {
    title: "Why ThinkInnov-NexGen for PLM",
    cards: [
      ["Implementation Expertise", "Tailored PLM implementation and integration for your industry and operating model."],
      ["Business Benefits", "Faster time to market, improved quality, cost reduction, innovation and regulatory compliance."],
      ["Better Collaboration", "Real-time information sharing, task management and streamlined communication across functions."],
    ],
  },
};

const digitalTransformation = {
  title: "Digital Transformation",
  kicker: "Driving Digital",
  intro:
    "ThinkInnov-NexGen enables digital transformation with Product Data Maturity Model strategy, roadmap thinking and connected product data platforms.",
  pdmm: {
    title: "Product Data Maturity Model",
    text: "PDMM defines the maturity of product data managed by a company and helps create the PLM strategy and roadmap.",
    // [level, name, description] — "PDMM L1 / System Definition: ..." on staging.
    levels: [
      ["PDMM L1", "System Definition", "Defines the data and information that must be collected or managed for the product."],
      ["PDMM L2", "System to Digital", "Structured and connected data management with a digital foundation."],
      ["PDMM L3", "Augmented Intelligence Platform", "Effective usage of existing product data to reduce time-to-market and cost."],
      ["PDMM L4", "Innovation Platform", "Engineering-powered predictive layer for the right feature mix of the product."],
    ],
  },
  outcomes: {
    title: "Digital Outcomes",
    cards: [
      ["Closed Loop Design", "Connect product data and quality feedback into a reusable digital thread."],
      ["Process Data", "Structure process knowledge so teams can make faster and better decisions."],
      ["Predictive Innovation", "Use augmented intelligence to identify patterns and improve product choices."],
    ],
  },
};

module.exports = {
  heroMessages, supportingLines, homeAbout, homePlm, deployment, servicesIntro, services,
  products, productsIntro, solutions, homeSolutionOrder, solutionsIntro, industries, industriesIntro,
  customersIntro, testimonialsIntro, contactIntro, plm, digitalTransformation,
};
