const jobs = [
  {
    title: "Tech Lead - Teamcenter",
    location: "Chennai/Bangalore",
    experience: "4 - 6 Years",
    responsibilities: [
      "Lead end-to-end technical delivery of Teamcenter PLM projects.",
      "Architect scalable and maintainable PLM solutions.",
      "Guide and mentor developers on Teamcenter customization and integration.",
      "Collaborate with business analysts and solution architects to translate requirements into technical designs.",
      "Ensure code quality, performance, and security compliance.",
      "Manage version upgrades, data migration, and system integrations (ERP, MES).",
      "Conduct code reviews and enforce best practices.",
      "Provide technical documentation and support UAT.",
      "Experience working in large-scale industrial or manufacturing environments."
    ],
    skills: [
      "Strong in Teamcenter modules such as Requirements Management, Systems Engineering, MPP and Change Management.",
      "Strong expertise in Siemens Teamcenter, Active Workspace, ITK, RAC and BMIDE.",
      "Proficiency in Java, C++, Webservice, SOA and scripting.",
      "Experience with Teamcenter integrations such as SAP and Oracle.",
      "Familiarity with cloud deployment and containerization.",
      "Good understanding of Product Development Lifecycle, SDLC and Agile/Scrum methodologies.",
      "Excellent leadership, communication and problem-solving skills."
    ]
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
    ["Mendix Developer", "Design, develop and deploy applications using the Mendix low-code platform.", "2+ Years"]
  ].map(([title, focus, experience]) => ({
    title,
    location: "Chennai/Bangalore",
    experience,
    responsibilities: [
      focus,
      "Work with customer and internal teams to understand requirements and delivery priorities.",
      "Prepare clear technical documentation and support implementation or UAT activities.",
      "Follow project quality, timeline and communication expectations.",
      "Contribute to continuous improvement in PLM and digital transformation delivery."
    ],
    skills: [
      "Relevant hands-on experience for the selected role.",
      "Good understanding of engineering, PLM or enterprise software workflows.",
      "Strong analytical, communication and problem-solving skills.",
      "Ability to collaborate with cross-functional teams and customers.",
      "Willingness to learn new technologies and support delivery outcomes."
    ]
  }))
];

const params = new URLSearchParams(window.location.search);
const id = Math.max(Number(params.get("id") || 1), 1);
const fallback = {
  title: "PLM Career Opportunity",
  location: "Chennai/Bangalore",
  experience: "Based on role",
  responsibilities: ["Deliver customer-focused PLM and digital transformation work.", "Collaborate with cross-functional teams and support project milestones.", "Create clear documentation and help users adopt practical solutions."],
  skills: ["Relevant experience in the selected role.", "Strong communication and problem-solving skills.", "Interest in PLM, engineering systems and digital transformation."]
};
const job = jobs[id - 1] || fallback;
document.title = `${job.title} | ThinkInnov-NexGen`;
document.getElementById("job-title").textContent = job.title;
document.getElementById("job-location").textContent = job.location;
document.getElementById("job-experience").textContent = job.experience;
document.getElementById("responsibilities").innerHTML = job.responsibilities.map((item) => `<li>${item}</li>`).join("");
document.getElementById("skills").innerHTML = job.skills.map((item) => `<li>${item}</li>`).join("");
document.getElementById("apply-link").href = `application.html?id=${id}`;
window.applyPreferredLanguage?.();
