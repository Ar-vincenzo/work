document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* SCROLL SPY */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const mobileLinks = document.querySelectorAll('.nav-mobile a[href^="#"]');
        mobileLinks.forEach(a => a.classList.remove('active'));
        const selector = `.nav-links a[href="#${e.target.id}"]`;
        const active = document.querySelector(selector);
        if (active) active.classList.add('active');
        const activeMobile = document.querySelector(`.nav-mobile a[href="#${e.target.id}"]`);
        if (activeMobile) activeMobile.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spyObserver.observe(s));

  /* HAMBURGER */
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    document.getElementById('navMobileTop').addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  }
});

function toggleAccordion(btn) {
  btn.classList.toggle('open');
  const body = btn.nextElementSibling;
  body.classList.toggle('open');
}