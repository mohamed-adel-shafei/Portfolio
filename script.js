// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-link");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close mobile menu on click
links.forEach((a) => {
  a.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

// Active link on scroll
const sections = document.querySelectorAll("section[id]");
function setActive() {
  const y = window.scrollY + 140;

  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute("id");

    if (y >= top && y < top + height) {
      links.forEach((l) => l.classList.remove("active"));
      document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActive);
setActive();

// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());
