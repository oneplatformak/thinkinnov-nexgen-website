// Journey context: the industry, company size and business need a visitor
// picks are kept for this browser tab only (sessionStorage) and added to
// links that lead to the contact form, so an enquiry can say where it came
// from. Nothing is sent anywhere until the visitor submits the form.
var TIN = window.TIN;
var KEY = "tin-context";
var KINDS = ["industry", "size", "need"];
var valid = function (v) { return typeof v === "string" && /^[a-z0-9-]{1,60}$/.test(v); };
var read = function () {
  try {
    var data = JSON.parse(window.sessionStorage.getItem(KEY) || "{}");
    var out = {};
    KINDS.forEach(function (k) { if (valid(data[k])) out[k] = data[k]; });
    return out;
  } catch (e) { return {}; }
};
var write = function (data) {
  try {
    if (Object.keys(data).length) window.sessionStorage.setItem(KEY, JSON.stringify(data));
    else window.sessionStorage.removeItem(KEY);
  } catch (e) { /* storage unavailable: links still carry their own parameters */ }
};

var decorate = function () {
  var data = read();
  TIN.$$('a[href*="contact.html"]').forEach(function (a) {
    var url;
    try { url = new URL(a.href); } catch (e) { return; }
    if (!a.hasAttribute("data-context-own")) {
      // Remember which parameters the link was built with, so they are never overwritten.
      a.setAttribute("data-context-own", KINDS.filter(function (k) { return url.searchParams.has(k); }).join(","));
    }
    var own = a.getAttribute("data-context-own").split(",");
    KINDS.forEach(function (k) {
      if (own.indexOf(k) >= 0) return;
      if (data[k]) url.searchParams.set(k, data[k]);
      else url.searchParams.delete(k);
    });
    a.href = url.toString();
  });
};

TIN.context = {
  get: read,
  set: function (kind, value) {
    var data = read();
    if (valid(value)) data[kind] = value;
    else delete data[kind];
    write(data);
    decorate();
  },
  clear: function () { write({}); decorate(); },
};

// A link such as solutions.html?industry=automotive#finder starts a journey.
var params = new URLSearchParams(location.search);
var onContact = !!TIN.$("[data-enquiry-type]");
if (!onContact) {
  var incoming = read();
  var changed = false;
  KINDS.forEach(function (k) {
    if (valid(params.get(k))) { incoming[k] = params.get(k); changed = true; }
  });
  if (changed) write(incoming);
}
decorate();
