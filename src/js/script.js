document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
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
});
