// Shared helpers, exposed on one namespace for the other modules.
var TIN = (window.TIN = window.TIN || {});
TIN.$ = function (sel, root) { return (root || document).querySelector(sel); };
TIN.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
TIN.lang = document.documentElement.lang === "ja" ? "ja" : "en";
TIN.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
TIN.store = {
  get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
  set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } },
};
// Elements that only make sense when scripts run are hidden in the HTML.
TIN.$$("[data-js-only]").forEach(function (el) { el.hidden = false; });
