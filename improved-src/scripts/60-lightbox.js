// Photo and infographic viewer. Each trigger is a plain link to the image, so
// without scripts the image simply opens.
var $ = window.TIN.$, $$ = window.TIN.$$;
var triggers = $$("[data-lightbox]");
if (triggers.length && typeof HTMLDialogElement !== "undefined") {
  var ja = window.TIN.lang === "ja";
  var label = ja
    ? { close: "閉じる", prev: "前へ", next: "次へ", viewer: "画像ビューア" }
    : { close: "Close", prev: "Previous", next: "Next", viewer: "Image viewer" };
  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", label.viewer);
  dialog.innerHTML =
    '<div class="lightbox-bar"><span data-lb-count aria-live="polite"></span><button type="button" data-lb-close></button></div>' +
    '<div class="lightbox-stage"><img alt="" data-lb-img></div>' +
    '<div class="lightbox-foot"><button type="button" data-lb-prev></button><p class="lightbox-caption" data-lb-caption></p><button type="button" data-lb-next></button></div>';
  document.body.appendChild(dialog);
  var img = $("[data-lb-img]", dialog), caption = $("[data-lb-caption]", dialog), counter = $("[data-lb-count]", dialog);
  var prev = $("[data-lb-prev]", dialog), next = $("[data-lb-next]", dialog), close = $("[data-lb-close]", dialog);
  close.textContent = label.close; prev.textContent = "← " + label.prev; next.textContent = label.next + " →";
  var index = 0, opener = null;

  var show = function (i) {
    index = (i + triggers.length) % triggers.length;
    var t = triggers[index];
    img.src = t.href;
    img.width = t.getAttribute("data-width");
    img.height = t.getAttribute("data-height");
    img.alt = t.getAttribute("data-caption") || "";
    caption.textContent = t.getAttribute("data-caption") || "";
    counter.textContent = index + 1 + " / " + triggers.length;
  };

  triggers.forEach(function (t, i) {
    t.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      opener = t;
      show(i);
      dialog.showModal();
      close.focus();
    });
  });
  prev.hidden = next.hidden = triggers.length < 2;
  prev.addEventListener("click", function () { show(index - 1); });
  next.addEventListener("click", function () { show(index + 1); });
  close.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog || e.target.classList.contains("lightbox-stage")) dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", function () {
    img.removeAttribute("src");
    if (opener) opener.focus();
  });
}
