// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navMenu.classList.remove('active');
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// ── Skill items: staggered pop-in on scroll ──
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.skill-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('skill-visible');
        }, i * 60); // 60ms stagger between each icon
      });
      skillObserver.unobserve(entry.target); // fire only once
    }
  });
}, { threshold: 0.15 });

const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObserver.observe(skillsGrid);


// Scroll up arrow functionality
const scrollUpBtn = document.getElementById('scrollUp');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollUpBtn.classList.add('show');
  } else {
    scrollUpBtn.classList.remove('show');
  }
});

// Enhanced smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = target.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Hero typewriter effect
(function () {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = ['AI/ML Enthusiast', 'Data Science Explorer', 'Web Developer'];
  const TYPE_SPEED = 80;    // ms per character typed
  const DELETE_SPEED = 45;  // ms per character deleted
  const HOLD = 1600;        // pause after a role is fully typed
  const GAP = 400;          // pause before typing the next role

  // Respect users who prefer reduced motion: show one static role
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  el.textContent = '';

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, HOLD);
      }
      return setTimeout(tick, TYPE_SPEED);
    }

    charIndex--;
    el.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      return setTimeout(tick, GAP);
    }
    setTimeout(tick, DELETE_SPEED);
  }

  tick();
})();