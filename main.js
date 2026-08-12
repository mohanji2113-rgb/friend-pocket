/* ============================================================
   FRIEND POCKET — GLOBAL SITE BEHAVIOR
   Loaded on every page. Requires js/config.js loaded first.
   ============================================================ */

(function () {
  "use strict";

  /* ---- Loading screen ---- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loadingScreen");
    if (loader) {
      setTimeout(function () { loader.classList.add("hidden"); }, 350);
    }
  });

  /* ---- Inject shared header / footer partials ---- */
  function injectPartial(targetId, url, afterInject) {
    const target = document.getElementById(targetId);
    if (!target) return;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Partial not found: " + url);
        return res.text();
      })
      .then((html) => {
        target.innerHTML = html;
        if (afterInject) afterInject();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function initHeader() {
    const header = document.getElementById("siteHeader");
    const hamburger = document.getElementById("hamburgerBtn");
    const mobileNav = document.getElementById("mobileNav");
    const currentPage = document.body.getAttribute("data-page");

    // Active nav state
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.getAttribute("data-nav") === currentPage) {
        link.classList.add("active");
      }
    });

    // Scroll effect
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 24) header.classList.add("is-solid");
      else header.classList.remove("is-solid");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    if (hamburger && mobileNav) {
      hamburger.addEventListener("click", function () {
        const isOpen = mobileNav.classList.toggle("is-open");
        hamburger.classList.toggle("is-open", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", function () {
          mobileNav.classList.remove("is-open");
          hamburger.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }
  }

  function initFooter() {
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const waFloat = document.getElementById("waFloat");
    if (waFloat) {
      const link = typeof fpWhatsAppLink === "function" ? fpWhatsAppLink() : null;
      if (link) {
        waFloat.href = link;
      } else {
        waFloat.href = "contact.html";
        waFloat.target = "_self";
        waFloat.title = "WhatsApp number to be added — see contact page";
      }
    }

    if (document.querySelector(".mobile-sticky-cta")) {
      document.body.classList.add("has-sticky-cta");
    }
  }

  injectPartial("app-header", "partials/header.html", initHeader);
  injectPartial("app-footer", "partials/footer.html", initFooter);

  /* ---- Scroll reveal ---- */
  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".accordion-q").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = btn.closest(".accordion-item");
      const answer = item.querySelector(".accordion-a");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".accordion-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---- Simple toast helper (used across pages) ---- */
  window.fpToast = function (message) {
    let toast = document.getElementById("fpToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "fpToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window._fpToastTimer);
    window._fpToastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  /* ---- Generic field validation helpers ---- */
  window.fpValidateField = function (fieldEl, isValid, message) {
    const field = fieldEl.closest(".field");
    if (!field) return isValid;
    let msgEl = field.querySelector(".error-msg");
    if (!msgEl) {
      msgEl = document.createElement("span");
      msgEl.className = "error-msg";
      field.appendChild(msgEl);
    }
    if (isValid) {
      field.classList.remove("has-error");
    } else {
      field.classList.add("has-error");
      msgEl.textContent = message || "This field is required.";
    }
    return isValid;
  };

  window.fpMobileValid = function (val) {
    return /^[6-9]\d{9}$/.test((val || "").trim());
  };
})();
