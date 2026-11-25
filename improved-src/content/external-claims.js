/**
 * The only sentences on the site that are not sourced from staging.
 * Each is a category-level description of a Siemens product, checked on the
 * vendor's own website on the date shown. No features, compatibility,
 * licensing or pricing. Mirrored in notes/CLAIM-REGISTER.md by the build.
 */
const retrieved = "2026-11-25";

// Who owns the product names. One sentence, shown on every product page.
const trademarks = {
  text: "Siemens lists this name among the trademarks or registered trademarks of Siemens Industry Software Inc., or its subsidiaries or affiliates.",
  url: "https://www.siemens.com/en-us/company/digital-industries-software-trademarks/",
  evidence: "Page text: “Unless otherwise noted, the following are trademarks or registered trademarks of Siemens Industry Software Inc., or its subsidiaries or affiliates, in the United States and in other countries.” The list includes Capital, Designcenter NX, Designcenter Solid Edge, Solid Edge, Mendix, Teamcenter, Teamcenter X and Tecnomatix, and many NX product names.",
};

module.exports = {
  retrieved,
  trademarks,
  products: {
    nx: {
      text: "Siemens describes NX as integrated software for design, simulation and manufacturing.",
      url: "https://www.siemens.com/en-us/products/cad-cam-software/",
      evidence: "Page description: “…Siemens NX and Designcenter software, the integrated software solution for design, simulation and manufacturing.”",
    },
    "solid-edge": {
      text: "Siemens describes Solid Edge as a portfolio of product development software, used for design, simulation, manufacturing and data management.",
      url: "https://www.siemens.com/en-us/products/designcenter/solid-edge/",
      evidence: "Page text: “…a portfolio of affordable, easy-to-use software tools that address all aspects of the product development process.” Siemens now presents the product as Designcenter Solid Edge.",
    },
    capital: {
      text: "Siemens describes Capital as a software portfolio for developing electrical and electronic (E/E) systems.",
      url: "https://www.siemens.com/en-us/products/capital/",
      evidence: "Page heading: “Capital software for E/E systems development”.",
    },
    teamcenter: {
      text: "Siemens describes Teamcenter as product lifecycle management (PLM) software that connects people and processes across the product lifecycle.",
      url: "https://www.siemens.com/en-us/products/teamcenter/",
      evidence: "Page description: “Connect people and processes throughout your product lifecycle with a single source of data with Siemens Teamcenter product lifecycle management (PLM) software.”",
    },
    tecnomatix: {
      text: "Siemens describes Tecnomatix as digital manufacturing software for modelling, simulating and optimizing manufacturing processes.",
      url: "https://www.siemens.com/en-us/products/tecnomatix/",
      evidence: "Page heading: “Tecnomatix digital manufacturing software”. Page text: “Model, simulate and optimize a comprehensive digital twin of your manufacturing processes…”",
    },
    mendix: {
      text: "Mendix, which publishes its website under the Siemens name, describes its product as a low-code application development platform.",
      url: "https://www.mendix.com/company/",
      evidence: "Page description: “Mendix is an industry-leading low-code application development platform.” Page title ends “| Siemens | Mendix”.",
    },
  },
};
