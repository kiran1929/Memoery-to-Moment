document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for all anchor links, except dashboard view toggles
  document.querySelectorAll('a[href^="#"]:not([data-nav-view])').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const targetId = a.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        // Offset for the fixed headers
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });

  // Simple view switching between landing, auth, client dashboard, and admin dashboard
  const views = document.querySelectorAll("[data-view]");
  const navViewLinks = document.querySelectorAll("[data-nav-view]");

  let currentRole = null; // "admin" | "user" | null
  let pendingView = null;

  const showView = (target) => {
    views.forEach(view => {
      const isMatch = view.getAttribute("data-view") === target;
      view.classList.toggle("d-none", !isMatch);
    });

    // When coming back to landing, scroll to top smoothly
    if (target === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  navViewLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-nav-view");
      if (!target) return;

      // If navigating to dashboards, require auth
      if (target === "user" || target === "admin") {
        // If already logged in with correct role, go directly
        if ((target === "admin" && currentRole === "admin") ||
            (target === "user" && (currentRole === "user" || currentRole === "admin"))) {
          showView(target);
          return;
        }
        pendingView = target;
        showView("auth");
        return;
      }

      showView(target);
    });
  });

  // Updated Form Submission target
  const buildForm = document.getElementById("buildForm");
  if (buildForm) {
    buildForm.addEventListener("submit", e => {
      e.preventDefault(); 
      const w = (document.getElementById("whatsapp").value || "").trim();
      // Only keep basic validation
      if (!(w.length >= 10)) {
        return alert("Please enter a valid WhatsApp number so we can coordinate.");
      }
      alert("Brief received! Our coordination team will ping you on WhatsApp within the hour."); 
      e.target.reset();
    });
  }

  // Auth handling
  const authForm = document.getElementById("authForm");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const authError = document.getElementById("authError");
  const authBackToSite = document.getElementById("authBackToSite");

  if (authForm && authEmail && authPassword) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (authEmail.value || "").trim();
      const pass = (authPassword.value || "").trim();

      let role = null;
      if (email === "admin@mtm.com" && pass === "admin@123") {
        role = "admin";
      } else if (email === "user@mtm.com" && pass === "user@123") {
        role = "user";
      }

      if (!role) {
        authError && authError.classList.remove("d-none");
        return;
      }

      authError && authError.classList.add("d-none");
      currentRole = role;

      // Decide where to go after login
      if (pendingView === "admin" && role === "admin") {
        showView("admin");
      } else if (pendingView === "user" && (role === "user" || role === "admin")) {
        showView("user");
      } else if (role === "admin") {
        showView("admin");
      } else {
        showView("user");
      }

      pendingView = null;
      authForm.reset();
    });
  }

  if (authBackToSite) {
    authBackToSite.addEventListener("click", () => {
      pendingView = null;
      showView("landing");
    });
  }
});
