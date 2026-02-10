document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // Handle Mobile Menu
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const links = document.querySelectorAll(".nav-link");

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    // Change icon between menu and x
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains("open")) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
  });

  // Close menu when clicking a link
  links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
  });

  // Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Auto Update Year
  document.getElementById("year").textContent = new Date().getFullYear();
});