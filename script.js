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

// Hero particle network
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const hero = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINK_DIST = 120;

  let w = 0, h = 0, particles = [], rafId = null, running = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(70, Math.floor((w * h) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 1
    }));
    draw(); // draw one frame so reduced-motion users still see the pattern
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
  }

  function loop() {
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    loop();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  // Keep the canvas sized to the hero (also fires once on load)
  new ResizeObserver(resize).observe(hero);

  // Only animate while the hero is on screen (saves battery once you scroll past)
  new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? start() : stop();
  }).observe(hero);
})();

// 3D tilt effect for project & certificate cards
(function () {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduceMotion) return; // skip touch devices and reduced-motion users

  const MAX_TILT = 8; // degrees, raise for a stronger effect

  document.querySelectorAll('.project-card, .certificate-card').forEach((card) => {
    card.classList.add('tilt');
    let raf = null;

    card.addEventListener('mousemove', (e) => {
      if (raf) return; // one update per frame
      const { clientX, clientY } = e;

      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width;  // 0 to 1
        const y = (clientY - rect.top) / rect.height;  // 0 to 1

        card.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_TILT}deg`);
        card.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_TILT}deg`);
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        raf = null;
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      raf = null;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
})();