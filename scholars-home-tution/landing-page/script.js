/* ============================================================
   SCHOLARS HOME TUITION — script.js
   ============================================================ */

(function () {
  "use strict";

  /* ── Sticky Navbar ── */
  const navbar = document.getElementById("navbar");
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ── Mobile Hamburger ── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });

  // Close nav on outside click
  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
    }
  });

  /* ── Intersection Observer — Fade-up animations ── */
  const fadeEls = document.querySelectorAll(".fade-up");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    fadeEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ── Contact Form Submission via Formspree ── */
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name       = form.querySelector("#name").value.trim();
      const phone      = form.querySelector("#phone").value.trim();
      const classLevel = form.querySelector("#classLevel").value;

      // Validate required fields
      if (!name || !phone || !classLevel) {
        const emptyFields = [];
        if (!name)       emptyFields.push(form.querySelector("#name"));
        if (!phone)      emptyFields.push(form.querySelector("#phone"));
        if (!classLevel) emptyFields.push(form.querySelector("#classLevel"));

        emptyFields.forEach(function (field) {
          field.style.borderColor = "#ef4444";
          field.style.boxShadow   = "0 0 0 3px rgba(239,68,68,0.12)";
          setTimeout(function () {
            field.style.borderColor = "";
            field.style.boxShadow   = "";
          }, 2500);
        });
        return;
      }

      // Check if Formspree ID has been set
      const formAction = form.getAttribute("action");
      if (formAction.includes("YOUR_FORM_ID")) {
        alert("⚠️ Formspree not configured yet.\n\nReplace YOUR_FORM_ID in the form action with your actual Formspree endpoint.");
        return;
      }

      // Submit to Formspree
      const btn = form.querySelector("[type='submit']");
      btn.textContent = "Sending…";
      btn.disabled = true;

      try {
        const response = await fetch(formAction, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });

        if (response.ok) {
          // Success
          formSuccess.textContent = "✅ Enquiry sent! We'll get back to you within 24 hours.";
          formSuccess.style.background = "#f0fdf4";
          formSuccess.style.borderColor = "#86efac";
          formSuccess.style.color = "#166534";
          formSuccess.classList.add("show");
          form.reset();
          setTimeout(function () { formSuccess.classList.remove("show"); }, 6000);
        } else {
          // Formspree returned an error
          const data = await response.json();
          throw new Error(data.error || "Submission failed");
        }
      } catch (err) {
        formSuccess.textContent = "❌ Something went wrong. Please call or WhatsApp us directly.";
        formSuccess.style.background = "#fef2f2";
        formSuccess.style.borderColor = "#fca5a5";
        formSuccess.style.color = "#991b1b";
        formSuccess.classList.add("show");
        setTimeout(function () { formSuccess.classList.remove("show"); }, 6000);
      } finally {
        btn.textContent = "Send Enquiry →";
        btn.disabled = false;
      }
    });
  }

  /* ── Smooth active nav highlighting ── */
  const sections = document.querySelectorAll("section[id]");
  const navALinks = document.querySelectorAll(".nav-links a:not(.btn-nav)");

  function updateActiveNav() {
    let current = "";
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navALinks.forEach(function (link) {
      link.style.color = "";
      const href = link.getAttribute("href");
      if (href === "#" + current) {
        link.style.color = "var(--blue-600)";
        link.style.fontWeight = "600";
      } else {
        link.style.fontWeight = "";
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ── Gallery lightbox hint (subtle scale effect already in CSS) ── */
  // Additional: add a subtle glow when hovering gallery items
  const galItems = document.querySelectorAll(".gal-item");
  galItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      item.style.zIndex = "2";
    });
    item.addEventListener("mouseleave", function () {
      item.style.zIndex = "";
    });
  });

  /* ── Stagger why-cards on scroll ── */
  // Already handled by delay classes in CSS, but add class for mobile fallback
  const whyCards = document.querySelectorAll(".why-card");
  whyCards.forEach(function (card, i) {
    card.style.transitionDelay = i * 0.08 + "s";
  });

  /* ── Count-up animation for stat numbers ── */
  function countUp(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    function update() {
      start += step;
      if (start >= target) {
        el.textContent = target + (el.dataset.suffix || "");
        return;
      }
      el.textContent = Math.floor(start) + (el.dataset.suffix || "");
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll(".astat-num, .sc-number");
  const statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.replace(/\D/g, "");
          const suffix = el.textContent.replace(/\d/g, "");
          if (raw) {
            el.dataset.suffix = suffix;
            countUp(el, parseInt(raw, 10), 1200);
          }
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(function (el) {
    statObserver.observe(el);
  });
})();