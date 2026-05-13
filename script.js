const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('[data-scroll]');
const navbar = document.querySelector('.navbar');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navList.classList.remove('active');
  });
});

const sections = document.querySelectorAll('.section');
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.35,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (entry.isIntersecting && navLink) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      navLink.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// Navbar scroll state
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }
});
