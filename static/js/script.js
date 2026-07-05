/* ═══════════════════════════════════════════
   EMTRIXZ TECHNOLOGY — MAIN SCRIPT
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll behavior ── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile nav toggle ── */
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) navLinks.classList.remove('open');
    });
  }

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── Active nav link (single-page sections) ── */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const res = await fetch('/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.status === 'success') {
          form.reset();
          const success = document.getElementById('formSuccess');
          if (success) { success.style.display = 'block'; }
          btn.textContent = 'Message Sent';
        }
      } catch (err) {
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    });
  }

  /* ── Smooth counter animation ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const step = Math.ceil(duration / target);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + Math.ceil(target / 60), target);
          el.textContent = prefix + current + suffix;
          if (current >= target) clearInterval(timer);
        }, step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ── Cursor glow effect (desktop only) ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,102,255,0.06), transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      top: -150px; left: -150px;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ── Hero typewriter effect ── */
  const typeEl = document.getElementById('heroType');
  if (typeEl) {
    const phrases = [
      'Ideas Into Reality.',
      'Challenges Into Opportunities.',
      'Vision Into Impact.',
      'Problems Into Solutions.'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    function type() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        typeEl.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
      } else {
        typeEl.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
      }
      setTimeout(type, deleting ? 40 : 70);
    }
    type();
  }

});
