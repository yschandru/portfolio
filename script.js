/* ==========================================================================
   Y S CHANDRASHEKAR - PERSONAL PORTFOLIO SCRIPT
   Vanilla JavaScript for Particles, Typing, Scroll Reveal, Modals & Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticles();
  initTypingAnimation();
  initThemeSwitcher();
  initNavigation();
  initScrollObservers();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. LOADING OVERLAY
   -------------------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 600);
}

/* --------------------------------------------------------------------------
   2. PARTICLES CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 15), 80);
  const particles = [];

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(59, 130, 246, '
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw & update particles
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion/glow
      if (mouse.x && mouse.y) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color + (1 - dist / 110) * 0.25 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   3. TYPING ANIMATION FOR SKILLS
   -------------------------------------------------------------------------- */
const skillsList = [
  "Java Development",
  "Python & Machine Learning",
  "SQL & Database Design",
  "AI-Based Applications",
  "Full-Stack Web Development"
];

let skillIdx = 0;
let charIdx = 0;
let isDeletingSkill = false;

function initTypingAnimation() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  function typeStep() {
    const currentSkill = skillsList[skillIdx];

    if (isDeletingSkill) {
      typingEl.textContent = currentSkill.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = currentSkill.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeletingSkill ? 40 : 80;

    if (!isDeletingSkill && charIdx === currentSkill.length) {
      speed = 2200;
      isDeletingSkill = true;
    } else if (isDeletingSkill && charIdx === 0) {
      isDeletingSkill = false;
      skillIdx = (skillIdx + 1) % skillsList.length;
      speed = 400;
    }

    setTimeout(typeStep, speed);
  }

  typeStep();
}

/* --------------------------------------------------------------------------
   4. NAVIGATION & ACTIVE HIGHLIGHT & STICKY HEADER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky & Scroll Progress
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) scrollProgress.style.width = scrolled + '%';

    // Active Section Highlight
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileBtn.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileBtn.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. THEME SWITCHER (DARK / LIGHT)
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('ysc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ysc-theme', newTheme);
    showToast(`Switched to ${newTheme} theme`);
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL OBSERVERS (SKILL BARS, COUNTERS, REVEALS)
   -------------------------------------------------------------------------- */
function initScrollObservers() {
  const reveals = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.progress-fill');
  const statNumbers = document.querySelectorAll('.stat-number');

  const observerOptions = { threshold: 0.2 };

  // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));

  // Skill Fill Observer
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width;
        skillObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  skillFills.forEach(fill => skillObserver.observe(fill));

  // Stats Counter Observer
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStatCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateStatCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const isFloat = target % 1 !== 0;
  let current = 0;
  const duration = 1600;
  const stepTime = 30;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = isFloat ? target.toFixed(2) : Math.round(target);
      clearInterval(timer);
    } else {
      el.textContent = isFloat ? current.toFixed(2) : Math.round(current);
    }
  }, stepTime);
}

/* --------------------------------------------------------------------------
   7. PROJECT CARDS FILTERING
   -------------------------------------------------------------------------- */
function filterProjectCards(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat.includes(category)) {
      card.style.display = 'flex';
      card.style.animation = 'fadeIn 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE PROJECT DEMO MODALS
   -------------------------------------------------------------------------- */
function openDemoModal(type) {
  const modal = document.getElementById('demo-modal');
  const bodyContent = document.getElementById('modal-body-content');
  if (!modal || !bodyContent) return;

  if (type === 'ai') {
    bodyContent.innerHTML = `
      <h3 style="font-size: 1.5rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">AI Career Guidance & Recommendation Simulator</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
        Simulates the ML recommendation pipeline engineered by Y S Chandrashekar using Python, Scikit-Learn, and Streamlit.
      </p>

      <div style="background: rgba(0,0,0,0.3); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-glass);">
        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-heading); font-weight: 600;">Select Skill Focus Area:</label>
        <select id="modal-skill-select" class="form-input" style="margin-bottom: 1rem;">
          <option value="ai">AI / Data Science (Python, Machine Learning)</option>
          <option value="java">Java Development (Java, SQL)</option>
          <option value="web">Web Development (HTML, CSS, JavaScript)</option>
        </select>

        <button class="btn btn-primary btn-sm" onclick="calcCareerSim()">Compute Career Trajectory</button>

        <div id="modal-sim-out" style="margin-top: 1.25rem; display: none; padding: 1rem; background: rgba(0, 242, 254, 0.1); border: 1px solid var(--accent-cyan); border-radius: 8px;"></div>
      </div>
    `;
  } else if (type === 'doctor') {
    bodyContent.innerHTML = `
      <h3 style="font-size: 1.5rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">Doctor Appointment System Overview</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
        A database-driven appointment management system built with HTML, CSS, JavaScript, and SQL.
      </p>
      <ul style="color: var(--text-main); font-size: 0.92rem; line-height: 1.8; margin-left: 1.2rem;">
        <li><b>Patient Scheduling:</b> Book, view, and manage appointment slots with doctors.</li>
        <li><b>Notification Functionality:</b> Automated reminders for upcoming appointments.</li>
        <li><b>Database Layer:</b> SQL-backed storage for patients, doctors, and appointment records.</li>
        <li><b>Front-End:</b> Responsive interface built with HTML, CSS, and JavaScript.</li>
      </ul>
    `;
  } else if (type === 'cnn') {
    bodyContent.innerHTML = `
      <h3 style="font-size: 1.5rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">Handwriting Recognition with CNN</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
        A deep learning model using Convolutional Neural Networks (CNN) and Python to classify handwritten characters.
      </p>
      <ul style="color: var(--text-main); font-size: 0.92rem; line-height: 1.8; margin-left: 1.2rem;">
        <li><b>Input:</b> Handwritten character image samples.</li>
        <li><b>Model:</b> Convolutional Neural Network built with Python for feature extraction and classification.</li>
        <li><b>Goal:</b> Improved recognition accuracy on handwritten character datasets.</li>
      </ul>
    `;
  } else {
    bodyContent.innerHTML = `
      <h3 style="font-size: 1.5rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">Project Feature Overview</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem;">
        Designed and developed by Y S Chandrashekar with responsive glassmorphism UI, clean typography, and optimized code architecture.
      </p>
    `;
  }

  modal.classList.add('active');
}

function closeDemoModal() {
  const modal = document.getElementById('demo-modal');
  if (modal) modal.classList.remove('active');
}

function closeDemoModalOnBackdrop(e) {
  if (e.target.id === 'demo-modal') closeDemoModal();
}

function calcCareerSim() {
  const val = document.getElementById('modal-skill-select').value;
  const out = document.getElementById('modal-sim-out');
  out.style.display = 'block';

  if (val === 'java') {
    out.innerHTML = `<b>🎯 Recommended Role:</b> Java Developer<br><b>Required Skills:</b> Java, SQL, MySQL, Git/GitHub<br><b>Target Companies:</b> Enterprise Software & IT Services`;
  } else if (val === 'web') {
    out.innerHTML = `<b>🎯 Recommended Role:</b> Full-Stack Web Developer<br><b>Required Skills:</b> HTML, CSS, JavaScript, SQL<br><b>Target Companies:</b> Product & Web Development Firms`;
  } else {
    out.innerHTML = `<b>🎯 Recommended Role:</b> AI / Machine Learning Engineer<br><b>Required Skills:</b> Python, Machine Learning, SQL, Streamlit<br><b>Target Companies:</b> AI Labs & Analytics Firms`;
  }
}

/* --------------------------------------------------------------------------
   9. FAQ ACCORDION TOGGLE
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
  const faqItem = btn.parentElement;
  faqItem.classList.toggle('active');
}

/* --------------------------------------------------------------------------
   10. COPY CONTACT DETAILS & TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function copyContactDetail(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg || 'Copied to clipboard!');
  }).catch(() => {
    showToast('Copying failed');
  });
}

function showToast(msg) {
  const wrapper = document.getElementById('toast-wrapper');
  if (!wrapper) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>✨</span> ${msg}`;
  wrapper.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --------------------------------------------------------------------------
   11. CONTACT FORM SUBMISSION
   -------------------------------------------------------------------------- */
function handleFormSubmission(e) {
  e.preventDefault();
  const name = document.getElementById('form-name').value;
  showToast(`Thank you, ${name}! Your message has been sent.`);
  e.target.reset();
}

/* --------------------------------------------------------------------------
   12. BACK TO TOP
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}