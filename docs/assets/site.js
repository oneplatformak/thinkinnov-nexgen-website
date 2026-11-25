(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header solid on scroll */
  const header = document.querySelector("[data-header]");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 24 || !document.body.classList.contains("has-hero"));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile drawer with focus trap */
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector("[data-drawer]");
  const backdrop = document.querySelector("[data-backdrop]");
  const closeBtn = document.querySelector(".drawer-close");
  let lastFocus = null;

  function focusables(root) {
    return [...root.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    toggle?.setAttribute("aria-expanded", "true");
    if (backdrop) backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    const items = focusables(drawer);
    items[0]?.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    toggle?.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus();
  }

  toggle?.addEventListener("click", () => {
    drawer?.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeLightbox();
      document.querySelectorAll(".nav-item.is-open").forEach((n) => n.classList.remove("is-open"));
    }
    if (e.key === "Tab" && drawer?.classList.contains("is-open")) {
      const items = focusables(drawer);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* Desktop dropdowns */
  document.querySelectorAll(".nav-item.has-dropdown").forEach((item) => {
    const btn = item.querySelector(".nav-link");
    btn?.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      document.querySelectorAll(".nav-item.has-dropdown").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-item.has-dropdown")) {
      document.querySelectorAll(".nav-item.has-dropdown").forEach((n) => {
        n.classList.remove("is-open");
        n.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* Reveal */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  }

  /* Hero tabs + optional auto-rotate with pause */
  const tabRoot = document.querySelector("[data-hero-tabs]");
  if (tabRoot) {
    const tabs = [...tabRoot.querySelectorAll('[role="tab"]')];
    const panels = [...tabRoot.querySelectorAll('[role="tabpanel"]')];
    const pauseBtn = tabRoot.querySelector("[data-hero-pause]");
    let index = 0;
    let paused = reduceMotion;
    let timer = null;

    function show(i) {
      index = (i + tabs.length) % tabs.length;
      tabs.forEach((tab, n) => {
        const selected = n === index;
        tab.setAttribute("aria-selected", String(selected));
        panels[n].hidden = !selected;
      });
    }

    function start() {
      stop();
      if (paused || reduceMotion || tabs.length < 2) return;
      timer = window.setInterval(() => show(index + 1), 7000);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        show(i);
        start();
      });
    });
    pauseBtn?.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.setAttribute("aria-pressed", String(paused));
      pauseBtn.setAttribute("aria-label", paused ? "Play rotation" : "Pause rotation");
      pauseBtn.innerHTML = paused
        ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 5v14l11-7-11-7Z"/></svg>'
        : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 6v12M16 6v12"/></svg>';
      start();
    });
    show(0);
    start();
  }

  /* Lightbox */
  let galleryItems = [];
  let galleryIndex = 0;
  const lightbox = document.querySelector("[data-lightbox]");
  const lbImg = lightbox?.querySelector("[data-lightbox-img]");
  const lbCap = lightbox?.querySelector("[data-lightbox-cap]");
  let lbReturn = null;

  function openLightbox(items, index) {
    if (!lightbox || !lbImg) return;
    galleryItems = items;
    galleryIndex = index;
    lbReturn = document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    lightbox.querySelector(".lightbox-close")?.focus();
    document.body.style.overflow = "hidden";
  }

  function renderLightbox() {
    const item = galleryItems[galleryIndex];
    if (!item || !lbImg) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt || "";
    if (lbCap) lbCap.textContent = item.alt || "";
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    if (lbImg) lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    lbReturn?.focus();
  }

  function collectGallery(fromEl) {
    const root = fromEl.closest("[data-gallery]") || document;
    return [...root.querySelectorAll("[data-gallery-src]")].map((btn) => ({
      src: btn.getAttribute("data-gallery-src"),
      alt: btn.getAttribute("data-gallery-alt") || "",
      el: btn,
    }));
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gallery-src]");
    if (!btn) return;
    const items = collectGallery(btn);
    const index = items.findIndex((i) => i.el === btn);
    openLightbox(items, Math.max(0, index));
  });

  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", () => {
    galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
    renderLightbox();
  });
  lightbox?.querySelector(".lightbox-next")?.addEventListener("click", () => {
    galleryIndex = (galleryIndex + 1) % galleryItems.length;
    renderLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "ArrowLeft") {
      galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
      renderLightbox();
    }
    if (e.key === "ArrowRight") {
      galleryIndex = (galleryIndex + 1) % galleryItems.length;
      renderLightbox();
    }
  });

  /* Forms */
  function setStarted(form) {
    const field = form.querySelector('[name="form_started"]');
    if (field && !field.value) field.value = String(Date.now());
  }

  document.querySelectorAll("form[data-form]").forEach((form) => {
    setStarted(form);
    form.addEventListener("focusin", () => setStarted(form), { once: true });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const type = form.getAttribute("data-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Please complete the required fields.";
        }
        return;
      }

      const fd = new FormData(form);
      const endpoint = form.getAttribute("action") || (type === "apply" ? "apply.php" : "contact.php");

      if (status) {
        status.className = "form-status";
        status.textContent = "Sending…";
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });
        let data = null;
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) data = await res.json();
        if (res.ok && data && data.ok) {
          if (status) {
            status.className = "form-status is-success";
            status.textContent = data.message || "Thank you — your message was sent.";
          }
          form.reset();
          setStarted(form);
          return;
        }
        throw new Error((data && data.error) || "Server did not confirm.");
      } catch (err) {
        const mailto = buildMailto(form, type);
        if (status) {
          status.className = "form-status is-error";
          status.innerHTML = `We could not reach the mail server from this preview. You can still send via email: <a href="${mailto}">open your email app</a>.`;
        }
      }
    });
  });

  function buildMailto(form, type) {
    const email = "info@thinkinnovnexgen.co.jp";
    const fd = new FormData(form);
    let subject = "Website enquiry";
    const lines = [];
    if (type === "apply") {
      subject = "Job application — " + (fd.get("job") || "general");
      for (const [k, v] of fd.entries()) {
        if (k === "website" || k === "form_started" || k === "resume" || k === "consent") continue;
        lines.push(`${k}: ${v}`);
      }
      lines.push("(Please attach your CV manually.)");
    } else {
      subject = "Contact form — " + (fd.get("name") || "website");
      ["name", "email", "company", "phone", "message"].forEach((k) => {
        if (fd.get(k)) lines.push(`${k}: ${fd.get(k)}`);
      });
    }
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  /* Apply page: preselect job from ?job= */
  const jobSelect = document.getElementById("job-select");
  if (jobSelect) {
    const params = new URLSearchParams(location.search);
    const job = params.get("job");
    if (job) {
      jobSelect.value = job;
    }
  }
})();
