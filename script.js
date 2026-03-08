(() => {
  const items = document.querySelectorAll("#anniv-grp6 .reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 45, 260)}ms`;
      observer.observe(el);
    });
  }

  const root = document.querySelector("#anniv-grp6");
  if (!root) return;

  const sectionNav = root.querySelector(".section-nav");
  const navLinks = sectionNav ? sectionNav.querySelectorAll('a[href^="#"]') : [];
  const getScrollOffset = () => {
    if (!sectionNav) return 0;
    return Math.ceil(sectionNav.getBoundingClientRect().height) + 12;
  };

  const scrollToSection = (hash, behavior = "smooth", updateHash = true) => {
    if (!hash || hash === "#") return;
    const target = root.querySelector(hash);
    if (!target) return;

    const top = window.scrollY + target.getBoundingClientRect().top - getScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior });

    if (updateHash && window.location.hash !== hash) {
      history.pushState(null, "", hash);
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash) return;
      event.preventDefault();
      scrollToSection(hash);
    });
  });

  if (window.location.hash && root.querySelector(window.location.hash)) {
    setTimeout(() => {
      scrollToSection(window.location.hash, "auto", false);
    }, 0);
  }

  const lightbox = document.querySelector("#grp6-lightbox");
  if (!lightbox) return;

  const sdgWraps = root.querySelectorAll(".sdg-icon-wrap");
  sdgWraps.forEach((wrap) => {
    const img = wrap.querySelector(".sdg-icon-img");
    if (!img) return;

    const applyState = () => {
      if (img.complete && img.naturalWidth > 0) {
        wrap.classList.add("has-img");
      } else {
        wrap.classList.remove("has-img");
      }
    };

    img.addEventListener("load", applyState);
    img.addEventListener("error", applyState);
    applyState();
  });

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const zoomables = root.querySelectorAll(".image-frame img");

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.setAttribute("src", "");
    lightboxImg.setAttribute("alt", "");
    lightboxCaption.textContent = "";
    document.body.style.overflow = "";
  };

  zoomables.forEach((img) => {
    img.addEventListener("click", () => {
      const captionEl = img.closest(".image-frame")?.querySelector("figcaption");
      lightboxImg.setAttribute("src", img.getAttribute("src") || "");
      lightboxImg.setAttribute("alt", img.getAttribute("alt") || "");
      lightboxCaption.textContent = captionEl ? captionEl.textContent : "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
})();