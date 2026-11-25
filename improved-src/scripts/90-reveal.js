// Section headings ease in once as they enter the viewport. Skipped entirely
// when the visitor prefers reduced motion or the browser lacks the observer.
var $$ = window.TIN.$$;
if (!window.TIN.reducedMotion && "IntersectionObserver" in window) {
  var items = $$(".section-head, .fig-hero");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave as is
    el.classList.add("will-reveal");
    observer.observe(el);
  });
}
