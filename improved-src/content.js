/** Content extracted from staging — meaning preserved; typos fixed. */
const config = require("./config");

function slugify(title, index) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${String(index + 1).padStart(2, "0")}-${base || "role"}`;
}

const jobsRaw = [
  {
    title: "Tech Lead - Teamcenter",
    location: "Chennai/Bangalore",
    experience: "4 - 6 Years",
    summary: "Lead end-to-end technical delivery of Teamcenter PLM projects.",
    responsibilities: [
      "Lead end-to-end technical delivery of Teamcenter PLM projects.",
      "Architect scalable and maintainable PLM solutions.",
      "Guide and mentor developers on Teamcenter customization and integration.",
      "Collaborate with business analysts and solution architects to translate requirements into technical designs.",
      "Ensure code quality, performance, and security compliance.",
      "Manage version upgrades, data migration, and system integrations (ERP, MES).",
      "Conduct code reviews and enforce best practices.",
      "Provide technical documentation and support UAT.",
      "Experience working in large-scale industrial or manufacturing environments.",
    ],
    skills: [
      "Strong in Teamcenter modules such as Requirements Management, Systems Engineering, MPP and Change Management.",
      "Strong expertise in Siemens Teamcenter, Active Workspace, ITK, RAC and BMIDE.",
      "Proficiency in Java, C++, Webservice, SOA and scripting.",
      "Experience with Teamcenter integrations such as SAP and Oracle.",
      "Familiarity with cloud deployment and containerization.",
      "Good understanding of Product Development Lifecycle, SDLC and Agile/Scrum methodologies.",
      "Excellent leadership, communication and problem-solving skills.",
    ],
  },
  ...[
    ["Teamcenter Developer", "ITK Server side coding experience with C & C++.", "2+ Years"],
    ["Support Engineer - Capital", "Mentor Graphics/Capital software support for Logic and Harness XC.", "1+ Years"],
    ["Application Engineer - Capital", "Product positioning, demonstrations and support for business and technical users.", "2+ Years"],
    ["Project Manager", "PLM project planning, customer coordination and delivery governance.", "6+ Years"],
    ["PLM Teamcenter Developer", "Teamcenter implementation, customization, configuration and development.", "8 - 10 Years"],
    ["Teamcenter PLM Solution Architect", "Requirement gathering, solution signoff and UAT signoff with customer teams.", "10+ Years"],
    ["Team Lead", "PLM delivery leadership with ITK server side coding experience.", "8+ Years"],
    ["PLM Teamcenter Developer", "Teamcenter PLM customization, configuration and development.", "2+ Years"],
    ["PLM Teamcenter Administrator", "Teamcenter administration and environment setup with Oracle and MS SQL.", "2+ Years"],
    ["Technical Lead", "Teamcenter customization, configuration, development and solution mapping.", "5+ Years"],
    ["Solution Architect - Digital Manufacturing", "Digital manufacturing solution architecture and customer delivery.", "10+ Years"],
    ["Sales Engineer", "Territory sales and business development with marketing and technical support teams.", "3+ Years"],
    ["Inside Sales Specialist", "Prospecting and customer lead generation from provided databases.", "1+ Years"],
    ["NX Application Engineer", "NX CAD demonstrations and customer problem solving with CAD features.", "2+ Years"],
    ["PLM Analyst", "PDMLink environment setup and configuration for validation and testing.", "2+ Years"],
    ["CATIA Support Engineer", "Technical support, software installation and configuration.", "1+ Years"],
    ["Mendix Developer", "Design, develop and deploy applications using the Mendix low-code platform.", "2+ Years"],
  ].map(([title, focus, experience]) => ({
    title,
    location: "Chennai/Bangalore",
    experience,
    summary: focus,
    responsibilities: [
      focus,
      "Work with customer and internal teams to understand requirements and delivery priorities.",
      "Prepare clear technical documentation and support implementation or UAT activities.",
      "Follow project quality, timeline and communication expectations.",
      "Contribute to continuous improvement in PLM and digital transformation delivery.",
    ],
    skills: [
      "Relevant hands-on experience for the selected role.",
      "Good understanding of engineering, PLM or enterprise software workflows.",
      "Strong analytical, communication and problem-solving skills.",
      "Ability to collaborate with cross-functional teams and customers.",
      "Willingness to learn new technologies and support delivery outcomes.",
    ],
  })),
];

const jobs = jobsRaw.map((job, index) => ({
  ...job,
  id: index + 1,
  slug: slugify(job.title, index),
}));

const customers = [
  ["mt1", "Mahindra"],
  ["ada", "ADA"],
  ["swaraj", "Swaraj"],
  ["agnikul", "Agnikul"],
  ["escorts", "Escorts"],
  ["sonalika", "Sonalika International"],
  ["lennox", "Lennox International"],
  ["br", "BR"],
  ["sts", "STS"],
  ["honeywell", "Honeywell"],
  ["hal", "HAL"],
  ["bae", "BAE Systems"],
  ["suv", "SUV"],
  ["ola", "Ola"],
  ["vf", "VinFast"],
  ["indpro", "Indpro"],
  ["luminous", "Luminous"],
  ["simple_energy", "Simple Energy"],
  ["kripya", "Kripya"],
  ["exide", "Exide"],
  ["bryka", "Bryka"],
];

const testimonials = [
  {
    quote:
      "Congratulations on the successful Teamcenter upgrade! Your team's dedication and collaboration, especially the impressive work of the Young Guns, have been exceptional.",
    name: "SWARAJ",
  },
  {
    quote:
      "We're thrilled with the successful Teamcenter upgrade and the incredible support provided by your team. Their dedication, professionalism, and teamwork made all the difference.",
    name: "EXIDE ENERGY",
    featured: true,
  },
  {
    quote:
      "We just Thinkin(g) No(w) that we have found a great vendor to support us on our needs. Your team deliveries are commendable.",
    name: "Ohmium",
  },
  {
    quote:
      "I am thrilled at the pace of implementation and that the system is up and running and the teams are using it.",
    name: "KISLAY PANKAJ",
    role: "CEO - LECTRIX",
  },
];

const solutions = [
  ["Design Data Management", "Reduce product development cycle time and rapidly search, revise and manage design data and product configurations."],
  ["3D Shape Search", "Find similar parts and reuse knowledge to consolidate suppliers and make informed decisions."],
  ["Quality Management Solution", "Support the full quality lifecycle from planning to production and lessons learned for the next planning cycle."],
  ["Quality Issue Management Solution", "Integrating quality planning in the design phase is critical to competitive advantage. Engineering data provides the information needed to successfully manage quality projects and real products."],
  ["Design Verification Management", "Manage the design verification plan as one critical activity in product development. Parts designed and requirements defined by internal specification as well as external specification like regulatory authorities."],
  ["Engineering Change Management Solution", "Continuously improve product offerings with best practice solutions for rapid change and full change management using a leading PLM digital enterprise backbone."],
  ["Requirements Management Solution", "Requirements are the blueprint for product development, but traditional paper and document-driven approaches are not sufficient for meeting complex customer needs."],
  ["Mendix | Low-Code Application Development Platform", "With ever-evolving technology and digital transformation pressures, modern enterprises often need flexible change without relying on legacy systems and outdated tech."],
  ["Digital Factory/Enterprise", "Digitalization helps companies respond to rapidly changing industrial challenges, geopolitical tensions, technological change, labour markets and climate impact."],
  ["Project Management Solution", "With schedule manager, team leaders can create project plans with work breakdown structures and schedule task hierarchy from best-practice templates."],
  ["Active Integration Solution", "Realize your digital threads with ERP, MES and enterprise applications by using the Teamcenter connection platform."],
  ["Teamcenter Gateway for SAP Business Suite", "Integrate Teamcenter with SAP S/4HANA or SAP ECC so teams can start or end tasks from either Teamcenter or SAP."],
  ["Teamcenter Gateway for Oracle E-Business Suite", "Combine Teamcenter-managed engineering data and processes with product information and enterprise processes controlled by Oracle ERP."],
  ["NX programming and customization", "NX programming and customization software tools help companies extend and tailor NX capabilities to fit specific needs."],
  ["Simulation process and data management", "Find, share and reuse simulation and test data in a fully integrated multi-discipline PLM environment to improve engineering productivity."],
];

const industries = [
  ["PLM for Component Manufacturers", "PLM foundations for component design, reuse and supplier collaboration.", "ind-components", 1],
  ["Siemens SW PDM to PLM", "Move from product data management to connected PLM practices.", "ind-pdm-plm", 2],
  ["Teamcenter X for Aerospace & Defense", "Cloud PLM workflows for regulated and complex aerospace and defense programs.", "ind-aerospace", 3],
  ["Teamcenter X for AME Industrial Machinery", "Advanced manufacturing engineering and machinery-focused lifecycle management.", "ind-machinery", 4],
  ["Teamcenter X for Automotive", "Cloud PLM for automotive development, collaboration and faster launch cycles.", "ind-automotive", 5],
  ["Teamcenter X for Battery", "Support battery product development with connected cloud PLM.", "ind-battery", 6],
  ["Teamcenter X for Battery Machine Builders", "PLM practices for battery machine builders and production ecosystems.", "ind-battery-machines", 7],
  ["Teamcenter X for Consumer Products", "Manage consumer product complexity from design through launch.", "ind-consumer", 8],
  ["Teamcenter X for Electronics", "Support electronics lifecycle and cross-domain product data.", "ind-electronics", 9],
  ["Teamcenter X for Marine", "PLM workflows for marine product development.", "ind-marine", 10],
  ["Teamcenter X — Cloud-based SaaS PLM", "Understand the business value of cloud-based SaaS PLM with Teamcenter X.", "ind-saas-cloud", 11],
];

const products = [
  ["NX", "nx", "NX", "Design Solutions", "Advanced design solutions for modern product engineering."],
  ["Solid Edge", "se", "SE", "3D Modeling", "3D modeling tools for efficient product development."],
  ["Capital", "cap", "CAP", "Electrical Design", "Electrical design capabilities for connected engineering workflows."],
  ["Teamcenter", "tc", "Tc", "Lifecycle Management", "Lifecycle management for product data, collaboration and change control."],
  ["Tecnomatix", "tx", "Tx", "Process Automation", "Process automation and digital manufacturing planning."],
  ["Mendix", "mx", "mx", "Low Code Development", "Low-code development for connected business applications."],
];

const services = [
  {
    title: "Pre-Implementation",
    blocks: [
      ["Consulting", ["Strategic business consulting", "Business process re-engineering", "Solution evaluation consulting"]],
      ["Sales", ["Solution mapping", "Service positioning", "Proof of concepts"]],
      ["State of the art", ["Cloud transition & upgrades", "User enablement by training"]],
    ],
  },
  {
    title: "Implementation",
    blocks: [
      ["Development", ["Solution architecting", "Technical architecting", "Project management", "Customization", "Configuration"]],
      ["Performance optimization", ["Performance tuning"]],
      ["Infrastructure management", ["Deployment architecture", "System setup"]],
    ],
  },
  {
    title: "Post-Implementation",
    blocks: [
      ["Sustaining service", []],
      ["Support", ["L1 support", "L2 support", "L3 support"]],
      ["Enhancements", ["Requirement analysis", "Design", "Development", "UAT", "Production deployment"]],
    ],
  },
];

module.exports = {
  jobs,
  customers,
  testimonials,
  solutions,
  industries,
  products,
  services,
  about: {
    title: "About Us",
    kicker: "ThinkInnov-NexGen",
    intro: "",
    identity: {
      title: "Who We Are",
      text: "ThinkInnov-NexGen is a next-generation IT services company helping businesses solve complex problems with modern cloud, IoT, AI and digital talent. The organization focuses on accelerating digital transformation with practical, human-centered technology delivery.",
      cards: [
        ["What is ThinkInnov-NexGen?", "A global software development services provider serving customers since 2014."],
        ["Operating Philosophy", "Create meaningful solutions from inspiration, with disciplined engineering and a customer-first delivery model."],
        ["Global Presence", "Japan headquarters with India delivery presence across Chennai and Coimbatore."],
      ],
    },
    principles: {
      title: "Vision, Mission and Values",
      cards: [
        ["Vision", "To become a pioneer in next-generation IT services and solutions, empowering individuals and organizations to lead change."],
        ["Mission", "To deliver effective IT services and solutions based on professional experience, best practices, global expertise and advanced technologies."],
        ["Values", "Head, Heart and Hand: wisdom, passion and execution. ThinkInnov-NexGen believes in giving back to customers, teams and society."],
      ],
    },
    gallery: Array.from({ length: 12 }, (_, i) => ({
      full: `assets/img/gallery/gallery-${String(i + 1).padStart(2, "0")}.webp`,
      thumb: `assets/img/gallery/gallery-${String(i + 1).padStart(2, "0")}-thumb.webp`,
      alt: `ThinkInnov-NexGen gallery photo ${i + 1}`,
    })),
    leaders: [
      ["assets/img/leadership/rajesh.webp", "Rajeshkumar Sankarlingam", "CEO & Founder"],
      ["assets/img/leadership/mohan.webp", "Mohan Govindasamy", "MD & Founder"],
      ["assets/img/leadership/bala.webp", "Bala Sabari D", "Director - CEO"],
      ["assets/img/leadership/sindhu.webp", "Sindhuja Jayaprakash", "Executive Director"],
    ],
    partnership: {
      title: "ThinkInnov-NexGen KK — A Strategic Partnership in Japan",
      intro:
        'A Siemens Certified "Expert Partner - PLM" synergizing with ThinkInnov-NexGen\'s extensive project delivery experience in Japan, to deliver high value to customers in Japan.',
      label: "Key Value Drivers",
      items: [
        "Japan on-site sales & market development and customer relationship",
        "Bilingual PM / PMO / Bridge Engineer / Coordinators with offshore and any onsite support",
        "Pre-sales support & PoC development",
        "End-to-end Digital Thread / Digital Transformation delivery combining the expertise of PLM, ERP and MES (onsite & offshore)",
        "Expertise: MCAD, ECAD, Teamcenter, Mendix, SAP, Web/Mobile Tech, IIoT, MES, Cloud and AI.",
      ],
    },
    profile: [
      ["Company Name", config.legalNameProfile],
      ["President/CEO", "Rajeshkumar Sankarlingam"],
      ["Managing Director", "Mohan Govindasamy"],
      ["Director - CEO", "Bala Sabari D"],
      ["Executive Director", "Sindhuja Jayaprakash"],
      ["Head Office", config.addressSingle],
      ["Map", "map-link"],
      ["Branch Office", config.branches.join("<br>")],
    ],
  },
  plm: {
    title: "PLM For Everyone",
    kicker: "Smart PLM Tools",
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
        ["Startups", "Organize product data, facilitate collaboration, ensure quality and track everything from the beginning."],
        ["SMBs", "Simplify data management, enhance communication and accelerate time to market."],
        ["Enterprises", "Gain end-to-end visibility, global collaboration, compliance, risk control and innovation at scale."],
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
  },
  digitalTransformation: {
    title: "Digital Transformation",
    kicker: "Driving Digital",
    intro:
      "ThinkInnov-NexGen enables digital transformation with Product Data Maturity Model strategy, roadmap thinking and connected product data platforms.",
    pdmm: {
      title: "Product Data Maturity Model",
      text: "PDMM defines the maturity of product data managed by a company and helps create the PLM strategy and roadmap.",
      cards: [
        ["PDMM L1", "System Definition: defines the data and information that must be collected or managed for the product."],
        ["PDMM L2", "System to Digital: structured and connected data management with a digital foundation."],
        ["PDMM L3", "Augmented Intelligence Platform: effective usage of existing product data to reduce time-to-market and cost."],
        ["PDMM L4", "Innovation Platform: engineering-powered predictive layer for the right feature mix of the product."],
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
  },
  behind: {
    title: "Behind the Brand",
    kicker: "People and Stories",
    intro: "The people, problem-solving approach and delivery culture behind ThinkInnov-NexGen.",
    problems: [
      ["Unlocking the Potential", "Digital & technology disruption facilitated collecting a lot of product data, but making meaningful information & insights out of the product data needs a well-defined digital foundation and vision; lack of it reduces the effective usage of existing product data."],
      ["Maximizing Efficiency", "Re-using the existing IP during new product development is the biggest opportunity for companies to reduce new product development cost & time."],
      ["Duplication Concerns", "System(s) / part(s) duplication is the main concern area for companies in new product introduction."],
      ["Navigating Uncertainty", "Predicting the performance of the new product is not possible at the early stages of product development."],
    ],
    team: [
      ["assets/img/team/haritha.webp", "Haritha CL", "Solution Architect"],
      ["assets/img/team/muthu.webp", "Muthukumar S", "Delivery Manager"],
      ["assets/img/team/sri.webp", "Srikanth K", "Business Consultant"],
      ["assets/img/team/javid.webp", "K.S. Mohammed Javid Rahman", "Technical Architect"],
    ],
  },
  careersIntro: {
    title: "Careers",
    kicker: "Join the Team",
    intro: "Create your own journey in an environment designed to be meaningful, rewarding and enriching.",
    cultureTitle: "Ready to create your own journey?",
    cultureText:
      "We know that finding a meaningful and rewarding career can be a long journey. Our goal is to make that process easy for you and to create a work environment that's enriching — one that you'll look forward to every day.",
    ctaTitle: "Can't find what you're looking for?",
    ctaLabel: "Register here",
  },
  homeSolutionsPreview: [
    "Design Data Management",
    "3D Shape Search",
    "Quality Management Solution",
    "Quality Issue Management",
    "Design Verification Management",
    "Engineering Change Management",
    "Requirements Management",
    "Active Integration Solution",
    "Digital Factory / Enterprise",
  ],
};
