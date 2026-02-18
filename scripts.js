/**
 * ATHARV AGARWAL — PORTFOLIO SCRIPTS
 * Clean, modern, performant JavaScript
 * No CSS injection. No global pollution. Progressive enhancement.
 */

(function () {
  "use strict";

  // ============================================================
  // INITIALIZATION
  // ============================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initScrollProgress();
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNav();
    initDraggableScroll();
    initCarouselControls();
    initScrollToTop();
    initFormValidation();
  });

  // ============================================================
  // PAGE LOADER
  // ============================================================
  function initLoader() {
    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    document.body.appendChild(loader);

    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 500);
      }, 400);
    });
  }

  // ============================================================
  // SCROLL PROGRESS BAR
  // ============================================================
  function initScrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", "Page scroll progress");
    document.body.appendChild(bar);

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
      bar.setAttribute("aria-valuenow", Math.round(pct));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
  }

  // ============================================================
  // THEME TOGGLE (reads from HTML element)
  // ============================================================
  function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const body = document.body;
    const iconEl = toggle.querySelector("i");

    const applyTheme = (isDark) => {
      body.classList.toggle("dark-mode", isDark);
      if (iconEl) {
        iconEl.className = isDark ? "ri-sun-line" : "ri-moon-line";
      }
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    };

    // Load saved preference, fallback to system preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    applyTheme(isDark);

    toggle.addEventListener("click", () => {
      const nowDark = !body.classList.contains("dark-mode");
      applyTheme(nowDark);
      localStorage.setItem("theme", nowDark ? "dark" : "light");
    });
  }

  // ============================================================
  // MOBILE MENU (reads from HTML elements)
  // ============================================================
  function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    if (!hamburger || !navLinks) return;

    const openMenu = () => {
      hamburger.classList.add("active");
      navLinks.classList.add("mobile-active");
      document.body.classList.add("menu-open");
      hamburger.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("mobile-active");
      document.body.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
    };

    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("mobile-active");
      isOpen ? closeMenu() : openMenu();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("mobile-active")) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const navHeight = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: "smooth" });
        history.pushState(null, "", href);
      });
    });
  }

  // ============================================================
  // SCROLL ANIMATIONS (CSS class-based, no inline styles)
  // ============================================================
  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      ".timeline-content, .portfolio__card1, .projects__card, .gallary__col img"
    );

    if (!("IntersectionObserver" in window)) {
      // Fallback: make everything visible immediately
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // ============================================================
  // ACTIVE NAV LINK TRACKING
  // ============================================================
  function initActiveNav() {
    const sections = document.querySelectorAll("section[id], header[id]");
    const navLinks = document.querySelectorAll(".nav__link");
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ============================================================
  // DRAGGABLE SCROLL (Timeline + Projects)
  // ============================================================
  function initDraggableScroll() {
    const draggables = [
      document.querySelector(".timeline"),
      document.querySelector(".projects__grid"),
    ].filter(Boolean);

    draggables.forEach(makeDraggable);
  }

  function makeDraggable(el) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let rafId = null;

    el.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      velocity = 0;
      cancelAnimationFrame(rafId);
      el.style.userSelect = "none";
    });

    el.addEventListener("mouseleave", () => { isDown = false; el.style.userSelect = ""; });
    el.addEventListener("mouseup", () => {
      isDown = false;
      el.style.userSelect = "";
      momentumScroll();
    });

    el.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      const prev = el.scrollLeft;
      el.scrollLeft = scrollLeft - walk;
      velocity = el.scrollLeft - prev;
    });

    // Prevent image drag
    el.querySelectorAll("img").forEach((img) => {
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    el.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX - el.offsetLeft;
      touchScrollLeft = el.scrollLeft;
    }, { passive: true });

    el.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX - el.offsetLeft;
      el.scrollLeft = touchScrollLeft - (x - touchStartX) * 1.5;
    }, { passive: true });

    function momentumScroll() {
      if (Math.abs(velocity) < 0.5) return;
      el.scrollLeft += velocity;
      velocity *= 0.92;
      rafId = requestAnimationFrame(momentumScroll);
    }
  }

  // ============================================================
  // CAROUSEL CONTROLS (Projects)
  // ============================================================
  function initCarouselControls() {
    const grid = document.getElementById("projects-grid");
    const prevBtn = document.getElementById("projects-prev");
    const nextBtn = document.getElementById("projects-next");
    const dotsContainer = document.getElementById("projects-dots");
    if (!grid || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = grid.querySelectorAll(".projects__card");
    const cardCount = cards.length;
    const visibleCount = () => Math.round(grid.clientWidth / (cards[0]?.offsetWidth + 24) || 1);

    // Build dots
    const pageCount = () => Math.ceil(cardCount / visibleCount());
    let dots = [];

    const buildDots = () => {
      dotsContainer.innerHTML = "";
      dots = [];
      const n = pageCount();
      for (let i = 0; i < n; i++) {
        const dot = document.createElement("button");
        dot.className = "carousel__dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Go to project page ${i + 1}`);
        dot.addEventListener("click", () => scrollToPage(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      }
      updateDots();
    };

    const currentPage = () => {
      const cardW = (cards[0]?.offsetWidth || 360) + 24;
      return Math.round(grid.scrollLeft / (cardW * visibleCount()));
    };

    const updateDots = () => {
      const page = currentPage();
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === page);
        d.setAttribute("aria-selected", i === page);
      });
      prevBtn.disabled = page === 0;
      nextBtn.disabled = page >= pageCount() - 1;
    };

    const scrollToPage = (page) => {
      const cardW = (cards[0]?.offsetWidth || 360) + 24;
      grid.scrollTo({ left: page * cardW * visibleCount(), behavior: "smooth" });
    };

    prevBtn.addEventListener("click", () => scrollToPage(Math.max(0, currentPage() - 1)));
    nextBtn.addEventListener("click", () => scrollToPage(Math.min(pageCount() - 1, currentPage() + 1)));

    grid.addEventListener("scroll", updateDots, { passive: true });
    window.addEventListener("resize", buildDots);

    buildDots();
  }

  // ============================================================
  // SCROLL TO TOP
  // ============================================================
  function initScrollToTop() {
    const btn = document.getElementById("scroll-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================================
  // FORM VALIDATION
  // ============================================================
  function initFormValidation() {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const textarea = form.querySelector("textarea");
      const value = textarea.value.trim();

      if (!value) {
        showNotification("Please enter your feedback.", "error");
        textarea.focus();
        return;
      }

      if (value.length < 10) {
        showNotification("Feedback must be at least 10 characters.", "error");
        textarea.focus();
        return;
      }

      showNotification("Thank you for your feedback!", "success");
      textarea.value = "";

      setTimeout(() => {
        window.location.href = "thanks.html";
      }, 1500);
    });
  }

  // ============================================================
  // NOTIFICATION SYSTEM
  // ============================================================
  function showNotification(message, type = "info") {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const el = document.createElement("div");
    el.className = `notification notification-${type}`;
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "polite");
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.animation = "notifSlideOut 0.3s ease forwards";
      setTimeout(() => el.remove(), 300);
    }, 3500);
  }

  // ============================================================
  // LAZY IMAGE LOADING (native + polyfill)
  // ============================================================
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — already handled via HTML attribute
  } else if ("IntersectionObserver" in window) {
    // Polyfill for older browsers
    const lazyImages = document.querySelectorAll("img[loading='lazy']");
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => imgObserver.observe(img));
  }

  // ============================================================
  // CONSOLE EASTER EGG
  // ============================================================
  console.log(
    "%c Atharv Agarwal Portfolio ",
    "background: linear-gradient(135deg,#3685fb,#8b5cf6); color:#fff; font-size:16px; font-weight:700; padding:6px 12px; border-radius:6px;"
  );
  console.log(
    "%cInterested in the code? Check out my GitHub → https://github.com/AtharvAg84",
    "color:#6b7280; font-size:13px;"
  );

})();
