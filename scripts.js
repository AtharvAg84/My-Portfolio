/**
 * ATHARV AGARWAL - PORTFOLIO SCRIPTS
 * Enhanced with modern features and smooth interactions
 */

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
  initDraggableSections();
  initThemeToggle();
  initSmoothScroll();
  initMobileMenu();
  initLoadingAnimation();
  initScrollProgress();
  initFormValidation();
  initTooltips();
});

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(section);
  });

  // Add animation class
  const style = document.createElement("style");
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ========== DRAGGABLE SECTIONS ==========
function initDraggableSections() {
  // Timeline Dragging
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    makeDraggable(timeline);
  }

  // Projects Dragging
  const projectsGrid = document.querySelector(".projects__grid");
  if (projectsGrid) {
    makeDraggable(projectsGrid);
  }
}

function makeDraggable(element) {
  let isDown = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let momentum;

  element.addEventListener("mousedown", (e) => {
    isDown = true;
    element.classList.add("active");
    element.style.cursor = "grabbing";
    element.style.userSelect = "none";
    startX = e.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
    cancelMomentumTracking();
  });

  element.addEventListener("mouseleave", () => {
    isDown = false;
    element.classList.remove("active");
    element.style.cursor = "grab";
  });

  element.addEventListener("mouseup", () => {
    isDown = false;
    element.classList.remove("active");
    element.style.cursor = "grab";
    beginMomentumTracking();
  });

  element.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 2;
    const prevScrollLeft = element.scrollLeft;
    element.scrollLeft = scrollLeft - walk;
    velocity = element.scrollLeft - prevScrollLeft;
  });

  // Prevent image dragging
  element.querySelectorAll("img").forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // Momentum scrolling
  function beginMomentumTracking() {
    cancelMomentumTracking();
    momentum = requestAnimationFrame(momentumLoop);
  }

  function cancelMomentumTracking() {
    cancelAnimationFrame(momentum);
  }

  function momentumLoop() {
    element.scrollLeft += velocity;
    velocity *= 0.95;
    if (Math.abs(velocity) > 0.5) {
      momentum = requestAnimationFrame(momentumLoop);
    }
  }

  // Touch support
  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchmove", handleTouchMove, { passive: false });

  let touchStartX = 0;
  let touchScrollLeft = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].pageX - element.offsetLeft;
    touchScrollLeft = element.scrollLeft;
  }

  function handleTouchMove(e) {
    if (!touchStartX) return;
    const x = e.touches[0].pageX - element.offsetLeft;
    const walk = (x - touchStartX) * 2;
    element.scrollLeft = touchScrollLeft - walk;
  }
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  // Check if theme toggle button exists
  let themeToggle = document.querySelector("#theme-toggle");

  // If not, create one
  if (!themeToggle) {
    themeToggle = document.createElement("button");
    themeToggle.id = "theme-toggle";
    themeToggle.className = "theme-toggle";
    themeToggle.setAttribute("aria-label", "Toggle theme");

    // Add to nav
    const nav = document.querySelector("nav");
    if (nav) {
      const rightSection = nav.querySelector("right") || nav;
      rightSection.insertBefore(themeToggle, rightSection.firstChild);
    }
  }

  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = "☀️";
  } else {
    themeToggle.innerHTML = "🌙";
  }

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = "🌙";
    }
  });

  // Add styles for theme toggle button
  const style = document.createElement("style");
  style.textContent = `
    .theme-toggle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      cursor: pointer;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-left: 1rem;
    }

    .dark-mode .theme-toggle {
      background: rgba(31, 41, 55, 0.9);
    }

    .theme-toggle:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .theme-toggle:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just "#"
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 100; // Account for fixed nav

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Update URL without jumping
        history.pushState(null, "", href);
      }
    });
  });
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav__links");

  if (!nav || !navLinks) return;

  // Create hamburger button
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.setAttribute("aria-label", "Toggle menu");
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  // Insert at beginning of nav
  nav.insertBefore(hamburger, nav.firstChild);

  // Toggle menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("mobile-active");
    document.body.classList.toggle("menu-open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !nav.contains(e.target) &&
      navLinks.classList.contains("mobile-active")
    ) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("mobile-active");
      document.body.classList.remove("menu-open");
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("mobile-active");
      document.body.classList.remove("menu-open");
    });
  });

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1001;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: var(--text-primary);
      border-radius: 3px;
      transition: all 0.3s ease;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    @media (max-width: 900px) {
      .hamburger {
        display: flex;
      }

      .nav__links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: var(--background);
        flex-direction: column;
        padding: 100px 2rem 2rem;
        gap: 2rem;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
        transition: right 0.3s ease;
        border-radius: 0;
      }

      .nav__links.mobile-active {
        right: 0;
      }

      .menu-open {
        overflow: hidden;
      }

      .link a {
        font-size: 1.1rem;
      }
    }
  `;
  document.head.appendChild(style);
}

// ========== LOADING ANIMATION ==========
function initLoadingAnimation() {
  // Create loader
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <p>Loading Portfolio...</p>
    </div>
  `;
  document.body.appendChild(loader);

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .page-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--background);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .page-loader.hidden {
      opacity: 0;
      visibility: hidden;
    }

    .loader-content {
      text-align: center;
    }

    .loader-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--gray-200);
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .loader-content p {
      color: var(--text-secondary);
      font-size: 1rem;
      font-weight: 500;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Hide loader when page loads
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
      setTimeout(() => loader.remove(), 500);
    }, 500);
  });
}

// ========== SCROLL PROGRESS ==========
function initScrollProgress() {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progress.style.width = scrollPercent + "%";
  });

  const style = document.createElement("style");
  style.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--accent-500));
      z-index: 9999;
      transition: width 0.1s ease;
      box-shadow: 0 0 10px rgba(54, 133, 251, 0.5);
    }
  `;
  document.head.appendChild(style);
}

// ========== FORM VALIDATION ==========
function initFormValidation() {
  const form = document.querySelector(".feedback__form form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = form.querySelector('input[type="text"]');
    const feedback = input.value.trim();

    if (!feedback) {
      showNotification("Please enter your feedback", "error");
      input.focus();
      return;
    }

    if (feedback.length < 10) {
      showNotification("Feedback must be at least 10 characters", "error");
      input.focus();
      return;
    }

    // Store feedback (in real app, send to backend)
    console.log("Feedback submitted:", feedback);
    localStorage.setItem("lastFeedback", feedback);

    // Show success and redirect
    showNotification("Thank you for your feedback!", "success");

    setTimeout(() => {
      window.location.href = "thanks.html";
    }, 1500);
  });
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Add styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--background);
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid var(--primary-500);
        max-width: 300px;
      }

      .notification-success {
        border-left-color: #10b981;
        background: #ecfdf5;
        color: #065f46;
      }

      .notification-error {
        border-left-color: #ef4444;
        background: #fef2f2;
        color: #991b1b;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Auto remove
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========== TOOLTIPS ==========
function initTooltips() {
  // Add tooltip to rating stars
  document.querySelectorAll(".rating").forEach((rating) => {
    rating.setAttribute("title", "Project difficulty rating");
  });

  // Add tooltip to tech tags
  document.querySelectorAll(".price").forEach((tag) => {
    tag.setAttribute("title", "Technologies used in this project");
  });
}

// ========== SCROLL TO TOP ==========
function initScrollToTop() {
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.innerHTML = "↑";
  scrollBtn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const style = document.createElement("style");
  style.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(54, 133, 251, 0.3);
      z-index: 999;
    }

    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
    }

    .scroll-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(54, 133, 251, 0.4);
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize scroll to top
initScrollToTop();

// ========== PERFORMANCE OPTIMIZATION ==========
// Lazy load images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ========== CONSOLE MESSAGE ==========
console.log(
  "%c🚀 Atharv Agarwal Portfolio",
  "color: #3685fb; font-size: 20px; font-weight: bold;",
);
console.log(
  "%cInterested in the code? Check out my GitHub!",
  "color: #6b7280; font-size: 14px;",
);
console.log(
  "%chttps://github.com/AtharvAg84",
  "color: #10b981; font-size: 14px;",
);
