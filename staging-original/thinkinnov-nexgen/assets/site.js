const navToggle = document.querySelector(".nav-toggle");
const drawer = document.querySelector(".mobile-drawer");
const closeDrawer = document.querySelector(".drawer-close");
const backdrop = document.querySelector(".backdrop");
const header = document.querySelector(".site-header");
const revealSelectors = [
  ".hero [data-reveal]",
  ".section-head",
  ".media-frame",
  ".rich-text",
  ".card",
  ".gallery-item",
  ".leader-card",
  ".partnership-panel",
  ".testimonial-card",
  ".job-card",
  ".logo-marquee",
  ".contact-form",
  ".site-footer .footer-grid > div",
  ".footer-bottom"
].join(",");

document.querySelectorAll(revealSelectors).forEach((node) => {
  node.setAttribute("data-reveal", "");
});

function setDrawer(open) {
  document.body.classList.toggle("drawer-open", open);
  navToggle?.setAttribute("aria-expanded", String(open));
  drawer?.setAttribute("aria-hidden", String(!open));
}

navToggle?.addEventListener("click", () => setDrawer(!document.body.classList.contains("drawer-open")));
closeDrawer?.addEventListener("click", () => setDrawer(false));
backdrop?.addEventListener("click", () => setDrawer(false));
document.querySelectorAll(".drawer-links a").forEach((link) => {
  link.addEventListener("click", () => setDrawer(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setDrawer(false);
});

const markHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
markHeader();
window.addEventListener("scroll", markHeader, { passive: true });

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll("[data-reveal]").forEach((node, index) => {
    node.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
    observer.observe(node);
  });

  document.querySelectorAll("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    const suffix = node.dataset.suffix || "";
    let started = false;
    const counterObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        node.textContent = `${Math.floor(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.disconnect();
    }, { threshold: 0.4 });
    counterObserver.observe(node);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
}

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    if (prefersReduced) return;
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

document.querySelectorAll(".customer-logo img").forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
    image.nextElementSibling.hidden = false;
  });
});

const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dots button")];
let heroIndex = 0;
function showHeroSlide(index) {
  if (!heroSlides.length) return;
  heroIndex = index % heroSlides.length;
  heroSlides.forEach((slide, itemIndex) => slide.classList.toggle("is-active", itemIndex === heroIndex));
  heroDots.forEach((dot, itemIndex) => dot.classList.toggle("is-active", itemIndex === heroIndex));
}
heroDots.forEach((dot, index) => dot.addEventListener("click", () => showHeroSlide(index)));
if (heroSlides.length > 1 && !prefersReduced) {
  setInterval(() => showHeroSlide(heroIndex + 1), 5600);
}

const galleryButtons = [...document.querySelectorAll("[data-gallery-index]")];
if (galleryButtons.length) {
  const galleryItems = galleryButtons.map((button) => {
    const image = button.querySelector("img");
    return {
      src: image?.getAttribute("src") || "",
      alt: image?.getAttribute("alt") || "Gallery image"
    };
  });
  let activeGalleryIndex = 0;
  let lastGalleryTrigger = null;

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Gallery image viewer");
  lightbox.innerHTML = `
    <div class="gallery-lightbox-top">
      <p class="gallery-lightbox-title">Gallery Media</p>
      <button class="gallery-lightbox-close" type="button" aria-label="Close gallery">x</button>
    </div>
    <div class="gallery-lightbox-stage">
      <button class="gallery-lightbox-nav prev" type="button" aria-label="Previous image">&lsaquo;</button>
      <img src="" alt="">
      <button class="gallery-lightbox-nav next" type="button" aria-label="Next image">&rsaquo;</button>
    </div>
    <div class="gallery-lightbox-bottom">
      <span class="gallery-lightbox-count"></span>
      <div class="gallery-lightbox-thumbs" aria-label="Gallery thumbnails"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".gallery-lightbox-stage img");
  const lightboxCount = lightbox.querySelector(".gallery-lightbox-count");
  const thumbs = lightbox.querySelector(".gallery-lightbox-thumbs");

  thumbs.innerHTML = galleryItems.map((item, index) => `<button type="button" data-lightbox-thumb="${index}" aria-label="Show image ${index + 1}"><img src="${item.src}" alt=""></button>`).join("");

  function renderLightbox(index) {
    activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeGalleryIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxCount.textContent = `${activeGalleryIndex + 1} / ${galleryItems.length}`;
    thumbs.querySelectorAll("button").forEach((button, itemIndex) => {
      button.classList.toggle("is-active", itemIndex === activeGalleryIndex);
    });
    thumbs.querySelector(".is-active")?.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function openLightbox(index, trigger) {
    lastGalleryTrigger = trigger;
    renderLightbox(index);
    lightbox.classList.add("is-open");
    document.body.classList.add("gallery-open");
    lightbox.querySelector(".gallery-lightbox-close")?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("gallery-open");
    lastGalleryTrigger?.focus();
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index, button));
  });

  lightbox.querySelector(".gallery-lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox.querySelector(".gallery-lightbox-nav.prev")?.addEventListener("click", () => renderLightbox(activeGalleryIndex - 1));
  lightbox.querySelector(".gallery-lightbox-nav.next")?.addEventListener("click", () => renderLightbox(activeGalleryIndex + 1));
  thumbs.querySelectorAll("[data-lightbox-thumb]").forEach((button) => {
    button.addEventListener("click", () => renderLightbox(Number(button.dataset.lightboxThumb)));
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") renderLightbox(activeGalleryIndex - 1);
    if (event.key === "ArrowRight") renderLightbox(activeGalleryIndex + 1);
  });
}
