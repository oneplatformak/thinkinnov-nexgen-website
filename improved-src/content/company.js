/**
 * Company content from staging (assets/page-data.js and index.html).
 * Meaning preserved; typos and stray capitals fixed. Do not add facts here
 * that are not in staging-original/.
 */
const config = require("../config");
const { pad2 } = require("../lib/html");

// File name, display name. All 21 logos from the staging customer row.
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

// Verbatim. Do not edit the quotes, including "Thinkin(g) No(w)".
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

// Alt text describes only what is visible in each real photograph.
const galleryAlt = [
  "Team members gathered around a table with food, smiling at the camera",
  "Four people beside a lit ceremonial lamp in front of the ThinkInnov-NexGen sign",
  "A group standing in the office beside the ThinkInnov-NexGen sign and a ceremonial lamp",
  "A guest lighting the ceremonial lamp in front of the ThinkInnov-NexGen sign",
  "Guests gathered in a corridor in front of a red ribbon at the office entrance",
  "Two people exchanging a bouquet of flowers in the office",
  "Hands cutting a red ribbon at the office entrance",
  "Guests lined up along a corridor behind a red ribbon",
  "A group cutting a red ribbon at the office entrance",
  "Guests gathered in the corridor outside the office entrance",
  "A guest holding a bouquet of flowers in the corridor",
  "Guests talking in the corridor outside the office entrance",
  // The next two come from the official Nexware package (notes/nexware-official-src/).
  "People standing on both sides of a corridor behind a red ribbon tied with a bow",
  "Two people walking along an office corridor",
];

// [width, height] of each full-size gallery image, for layout without shift.
const gallerySize = [
  [1280, 960], [1200, 1600], [1600, 1200], [900, 1600], [1200, 1600], [900, 1600],
  [1200, 1600], [1200, 1600], [900, 1600], [1200, 1600], [1200, 1600], [1200, 1600],
  [1200, 1600], [1200, 1600],
];

const about = {
  title: "About Us",
  kicker: "ThinkInnov-NexGen",
  // From the staging Japanese/English dictionary (about intro).
  intro: "A software development service provider since 2014, focused on turning inspiration into practical digital solutions.",
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
  galleryTitle: "Captured Moments",
  galleryText: "A closer look at the spaces, collaborations and delivery culture behind the ThinkInnov-NexGen team.",
  gallery: galleryAlt.map((alt, i) => ({
    full: `assets/img/gallery/gallery-${pad2(i + 1)}.webp`,
    thumb: `assets/img/gallery/gallery-${pad2(i + 1)}-thumb.webp`,
    alt,
    width: gallerySize[i][0],
    height: gallerySize[i][1],
  })),
  leadershipTitle: "Executive Leadership",
  leadershipText: "ThinkInnov-NexGen is led by a hands-on leadership team focused on strategy, delivery quality and global growth.",
  leaders: [
    ["assets/img/leadership/rajesh.webp", "Rajeshkumar Sankarlingam", "CEO & Founder"],
    ["assets/img/leadership/mohan.webp", "Mohan Govindasamy", "MD & Founder"],
    ["assets/img/leadership/bala.webp", "Bala Sabari D", "Director - CEO"],
    ["assets/img/leadership/sindhu.webp", "Sindhuja Jayaprakash", "Executive Director"],
  ],
  partnership: {
    title: "ThinkInnov-NexGen KK - A Strategic Partnership in Japan",
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
  profileTitle: "Company Profile",
  profileText: "Key ThinkInnov-NexGen Corporation details for leadership, headquarters and branch offices.",
  profile: [
    ["Company Name", config.legalNameProfile],
    ["President/CEO", "Rajeshkumar Sankarlingam"],
    ["Managing Director", "Mohan Govindasamy"],
    ["Director - CEO", "Bala Sabari D"],
    ["Executive Director", "Sindhuja Jayaprakash"],
    ["Head Office", config.addressSingle],
    ["Map", "map-link"],
    ["Branch Office", config.branches],
  ],
  // Head office plus the three branches in the profile table. Only the head
  // office has a published address.
  locations: [
    { city: "Tokyo", country: "Japan", role: "Head Office", address: config.addressSingle, map: true },
    { city: "Nagaoka", country: "Japan", role: "Branch Office" },
    { city: "Coimbatore", country: "India", role: "Branch Office" },
    { city: "Chennai", country: "India", role: "Branch Office" },
  ],
};

const behind = {
  title: "Behind the Brand",
  kicker: "People and Stories",
  intro: "The people, problem-solving approach and delivery culture behind ThinkInnov-NexGen.",
  problemTitle: "Problem We Solve",
  problemText: "We help companies to effectively address the critical business issues of new product development.",
  // key links each problem to the finder (content/relations.js).
  problems: [
    ["unlock-data", "Unlocking the Potential", "Digital & technology disruption facilitated collecting a lot of product data, but making meaningful information & insights out of the product data needs a well-defined digital foundation and vision; lack of it reduces the effective usage of existing product data."],
    ["reuse-ip", "Maximizing Efficiency", "Re-using the existing IP during the new product development is the biggest opportunity for the companies to reduce new product development cost & time."],
    ["duplication", "Duplication Concerns", "System(s) / part(s) duplication is the main concern area for the companies in new product introduction."],
    ["predict", "Navigating Uncertainty", "Predicting the performance of the new product is not possible at the early stages of the product development."],
  ],
  teamTitle: "Our Team",
  teamText: "Delivery leaders and specialists helping customers adopt practical PLM and digital transformation.",
  team: [
    ["assets/img/team/haritha.webp", "Haritha CL", "Solution Architect"],
    ["assets/img/team/muthu.webp", "Muthukumar S", "Delivery Manager"],
    ["assets/img/team/sri.webp", "Srikanth K", "Business Consultant"],
    ["assets/img/team/javid.webp", "K.S. Mohammed Javid Rahman", "Technical Architect"],
  ],
};

const careersIntro = {
  title: "Careers",
  kicker: "Join the Team",
  intro: "Create your own journey in an environment designed to be meaningful, rewarding and enriching.",
  cultureTitle: "Ready to create your own journey?",
  cultureText:
    "We know that finding a meaningful and rewarding career can be a long journey. Our goal is to make that process easy for you and to create a work environment that's enriching, one that you'll look forward to every day.",
  areasTitle: "Current Opportunity Areas",
  ctaTitle: "Can't find what you're looking for?",
  ctaLabel: "Register here",
};

module.exports = { customers, testimonials, about, behind, careersIntro };
