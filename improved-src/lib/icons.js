/** One icon set: 24px grid, 1.5px stroke, square joins. Decorative by default. */
const svg = (d, extra = "") =>
  `<svg class="icon${extra}" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">${d}</svg>`;

module.exports = {
  arrow: svg('<path d="M4 12h15M13 6l6 6-6 6"/>', " icon-arrow"),
  arrowUpRight: svg('<path d="M7 17 17 7M9 7h8v8"/>'),
  chevron: svg('<path d="m6 9 6 6 6-6"/>', " icon-chevron"),
  chevronLeft: svg('<path d="m15 6-6 6 6 6"/>'),
  chevronRight: svg('<path d="m9 6 6 6-6 6"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>', " icon-plus"),
  mail: svg('<rect x="3" y="5" width="18" height="14"/><path d="m3.5 6 8.5 7 8.5-7"/>'),
  phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z"/>'),
  map: svg('<path d="M12 21s7-6 7-11.5a7 7 0 1 0-14 0C5 15 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>'),
  building: svg('<path d="M5 21V4h9v17M14 9h5v12M3 21h18M8 8h3M8 12h3M8 16h3"/>'),
  cloud: svg('<path d="M7 18h10.5a3.5 3.5 0 0 0 .5-7 6 6 0 0 0-11.6 1.3A3 3 0 0 0 7 18Z"/>'),
  layers: svg('<path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z"/><path d="m3 13 9 4.5 9-4.5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  expand: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
  menu: svg('<path d="M4 8h16M4 16h16"/>'),
};
