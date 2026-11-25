// Contact page: read the context passed in the URL (type, topic, need,
// industry, size), show it, and put it in the form. Unknown values are ignored.
var $ = window.TIN.$, $$ = window.TIN.$$;
var type = $("[data-enquiry-type]");
if (type) {
  var form = type.form;
  var topic = $("[data-enquiry-topic]");
  var box = $("[data-enquiry-context]");
  var params = new URLSearchParams(location.search);
  var has = function (select, value) {
    return Array.prototype.some.call(select.options, function (o) { return o.value === value; });
  };
  if (params.get("type") && has(type, params.get("type"))) type.value = params.get("type");
  if (params.get("topic") && has(topic, params.get("topic"))) topic.value = params.get("topic");

  var any = false;
  ["need", "industry", "size"].forEach(function (kind) {
    var value = params.get(kind);
    if (!value) return;
    var item = $$("[data-context-item]", box).filter(function (li) { return li.getAttribute("data-context-item") === kind + ":" + value; })[0];
    if (!item) return;
    item.hidden = false;
    form.elements[kind].value = value;
    any = true;
  });
  box.hidden = !any;

  var clear = function () {
    ["need", "industry", "size"].forEach(function (kind) { form.elements[kind].value = ""; });
    $$("[data-context-item]", box).forEach(function (li) { li.hidden = true; });
    box.hidden = true;
  };
  $("[data-context-clear]", box).addEventListener("click", function () { clear(); type.focus(); });
  form.addEventListener("tin:sent", clear);
}
