/**
 * The 18 roles from staging (assets/jobs.js + the careers list in
 * assets/page-data.js). Nothing here is new: `summary` is the focus line from
 * jobs.js, `listing` is the card text from the careers list, character for
 * character (its capitals and abbreviations included).
 * `discipline` is derived from the title only, to drive the filters.
 */
const { slugify, pad2 } = require("../lib/html");

const EMPLOYMENT = "Full Time"; // staging jobdetails.html hero
const LOCATION = "Chennai/Bangalore";

const disciplines = {
  architecture: "Architecture & technical leadership",
  development: "Development",
  application: "Application & support engineering",
  administration: "Administration & analysis",
  project: "Project management",
  sales: "Sales",
};

const bands = {
  early: "From 1–2 years",
  mid: "From 3–6 years",
  senior: "From 8 years",
};

const techLead = {
  title: "Tech Lead - Teamcenter",
  experience: "4 - 6 Years",
  summary: "Lead end-to-end technical delivery of Teamcenter PLM projects.",
  listing: "Lead end-to-end technical delivery of Teamcenter PLM projects.",
  discipline: "architecture",
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
};

const sharedResponsibilities = [
  "Work with customer and internal teams to understand requirements and delivery priorities.",
  "Prepare clear technical documentation and support implementation or UAT activities.",
  "Follow project quality, timeline and communication expectations.",
  "Contribute to continuous improvement in PLM and digital transformation delivery.",
];

const sharedSkills = [
  "Relevant hands-on experience for the selected role.",
  "Good understanding of engineering, PLM or enterprise software workflows.",
  "Strong analytical, communication and problem-solving skills.",
  "Ability to collaborate with cross-functional teams and customers.",
  "Willingness to learn new technologies and support delivery outcomes.",
];

// [title, focus (jobs.js), experience, careers-list text (page-data.js), discipline]
const rest = [
  ["Teamcenter Developer", "ITK Server side coding experience with C & C++.", "2+ Years", "ITK Server side coding experience with C & C++.", "development"],
  ["Support Engineer - Capital", "Mentor Graphics/Capital software support for Logic and Harness XC.", "1+ Years", "1 Yr Experience in Mentor Graphics/Capital software (logic and Harness XC).", "application"],
  ["Application Engineer - Capital", "Product positioning, demonstrations and support for business and technical users.", "2+ Years", "Articulate technology and product positioning to both business and technical users.", "application"],
  ["Project Manager", "PLM project planning, customer coordination and delivery governance.", "6+ Years", "Knowledge and Experience in PLM (preferably Teamcenter).", "project"],
  ["PLM Teamcenter Developer", "Teamcenter implementation, customization, configuration and development.", "8 - 10 Years", "Minimum 8 to 10 years of experience in Teamcenter implementation projects.", "development"],
  ["Teamcenter PLM Solution Architect", "Requirement gathering, solution signoff and UAT signoff with customer teams.", "10+ Years", "Should be able to Travel to Customer Site for Requirement Gathering, Solution Signoff and UAT Signoff Events.", "architecture"],
  ["Team Lead", "PLM delivery leadership with ITK server side coding experience.", "8+ Years", "Should have 8+ years of experience in PLM Domain. ITK Server side coding experience with C & C++.", "architecture"],
  ["PLM Teamcenter Developer", "Teamcenter PLM customization, configuration and development.", "2+ Years", "Minimum 2+ Years of Experience in Teamcenter PLM Customization, Configuration and Development.", "development"],
  ["PLM Teamcenter Administrator", "Teamcenter administration and environment setup with Oracle and MS SQL.", "2+ Years", "Should have minimum 2+ years experience in Teamcenter Administration Role, Oracle and MS SQL environment setup.", "administration"],
  ["Technical Lead", "Teamcenter customization, configuration, development and solution mapping.", "5+ Years", "Minimum 5+ years of experience in Teamcenter PLM customization, configuration, development and solution mapping.", "architecture"],
  ["Solution Architect - Digital Manufacturing", "Digital manufacturing solution architecture and customer delivery.", "10+ Years", "Should have 10+ years of experience as Solution Architect.", "architecture"],
  ["Sales Engineer", "Territory sales and business development with marketing and technical support teams.", "3+ Years", "Sales and business development for territories, working with marketing and technical support teams.", "sales"],
  ["Inside Sales Specialist", "Prospecting and customer lead generation from provided databases.", "1+ Years", "Generating new prospects and customer leads from the database provided.", "sales"],
  ["NX Application Engineer", "NX CAD demonstrations and customer problem solving with CAD features.", "2+ Years", "Responsible for NX CAD solution demonstration and addressing customer problems with appropriate CAD features.", "application"],
  ["PLM Analyst", "PDMLink environment setup and configuration for validation and testing.", "2+ Years", "Setup and configure new PDMLink environments for validation and testing.", "administration"],
  ["CATIA Support Engineer", "Technical support, software installation and configuration.", "1+ Years", "Technical support, software installation and configuration.", "application"],
  ["Mendix Developer", "Design, develop and deploy applications using the Mendix low-code platform.", "2+ Years", "Design, develop, and deploy applications using the Mendix low-code platform.", "development"],
].map(([title, summary, experience, listing, discipline]) => ({
  title,
  experience,
  summary,
  listing,
  discipline,
  responsibilities: [summary, ...sharedResponsibilities],
  skills: sharedSkills,
}));

function bandOf(experience) {
  const years = parseInt(experience, 10);
  if (years <= 2) return "early";
  if (years <= 6) return "mid";
  return "senior";
}

const jobs = [techLead, ...rest].map((job, index) => ({
  ...job,
  id: index + 1,
  location: LOCATION,
  employment: EMPLOYMENT,
  band: bandOf(job.experience),
  // Same slugs as the previous build so shared links keep working.
  slug: `${pad2(index + 1)}-${slugify(job.title).slice(0, 60)}`,
}));

module.exports = { jobs, disciplines, bands };
