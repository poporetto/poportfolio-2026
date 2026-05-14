/* ============================================================
   ANDRIAS TANIWAN — Portfolio interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const isTouch = !window.matchMedia('(pointer: fine)').matches;

  /* ── 1. Custom cursor ─────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!isTouch && cursor && follower) {
    let mx = -100, my = -100;   // mouse
    let fx = -100, fy = -100;   // follower (lagged)

    // Cursor dot follows instantly
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(cursor, { x: mx, y: my });
    });

    // Follower lerps toward cursor on every frame
    gsap.ticker.add(() => {
      fx += (mx - fx) * 0.11;
      fy += (my - fy) * 0.11;
      gsap.set(follower, { x: fx, y: fy });
    });

    // Hover states
    const hoverEls   = document.querySelectorAll('a, button, .client-logo');
    const projectEls = document.querySelectorAll('.project-card');

    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('is-hovering'));
    });

    projectEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        follower.classList.remove('is-hovering');
        follower.classList.add('is-project');
      });
      el.addEventListener('mouseleave', () => follower.classList.remove('is-project'));
    });

    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.2 });
    });
  }

  /* ── 2. Hero load animation ───────────────────────────── */
  if (typeof gsap !== 'undefined') {
    gsap.set('.hero-heading, .text-accent, .hero-subtitle, .hero-cta, .hero-illustration', {
      opacity: 0,
      y: 30,
    });
    gsap.set('.floating-illustration', { opacity: 0, scale: 0.5 });
    gsap.set('.navbar', { opacity: 0, y: -16 });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .to('.navbar',           { opacity: 1, y: 0, duration: 0.5 })
      .to('.hero-heading',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.2')
      .to('.text-accent',      { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
      .to('.hero-subtitle',    { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-cta',         { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
      .to('.hero-illustration',{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to('.floating-illustration', {
          opacity: 1, scale: 1,
          duration: 0.6, ease: 'back.out(1.4)',
          stagger: 0.04,
        }, '-=0.6');
  }

  /* ── 3. GSAP floating shapes ──────────────────────────── */
  if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.floating-illustration').forEach((el) => {
      gsap.to(el, {
        y: -(12 + Math.random() * 14),
        rotation: (Math.random() - 0.5) * 20,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }

  /* ── 4. Hero illustration mouse parallax ─────────────── */
  const heroSection = document.querySelector('.hero-section');
  const heroIllus   = document.querySelector('.hero-illustration');

  if (!isTouch && heroSection && heroIllus && typeof gsap !== 'undefined') {
    heroSection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const x = ((e.clientX - left) / width  - 0.5) * 22;
      const y = ((e.clientY - top)  / height - 0.5) * 14;
      gsap.to(heroIllus, { x, y, duration: 0.9, ease: 'power2.out' });
    });
    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroIllus, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
    });
  }

  /* ── 5. Magnetic buttons ──────────────────────────────── */
  if (!isTouch && typeof gsap !== 'undefined') {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.32;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.32;
        gsap.to(btn, { x, y, duration: 0.35, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  /* ── 6. Project card 3D tilt ──────────────────────────── */
  if (!isTouch) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(card, {
          rotationY:  x * 10,
          rotationX: -y * 10,
          z: 16,
          duration: 0.35,
          ease: 'power2.out',
          transformPerspective: 900,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0, rotationX: 0, z: 0,
          duration: 0.7, ease: 'elastic.out(1, 0.6)',
          transformPerspective: 900,
        });
      });
    });
  }

  /* ── 7. Scroll reveal ─────────────────────────────────── */
  // Attach .reveal class to elements we want to animate in
  const revealSelectors = [
    { sel: '.projects-section header > *',   dir: '' },
    { sel: '.project-card',                  dir: '' },
    { sel: '.clients-section header > *',    dir: '' },
    { sel: '.about-section .section-eyebrow, .about-section h2', dir: '' },
    { sel: '.about-lead, .about-bio',        dir: 'from-left' },
    { sel: '.about-content',                 dir: 'from-right' },
    { sel: '.contact-section header > *',    dir: '' },
    { sel: '.contact-form > *',              dir: '' },
  ];

  revealSelectors.forEach(({ sel, dir }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (dir) el.classList.add(dir);
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── 8. Active nav link on scroll ────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active-link',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach((s) => navObserver.observe(s));

  /* ── 9. Contact form ──────────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const msg     = document.getElementById('formMessage');
  const btn     = document.getElementById('submitBtn');

  if (form && btn) {
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner-border');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btnText.textContent = 'Sending…';
      spinner.classList.remove('d-none');
      msg.classList.add('d-none');

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          msg.className = 'alert alert-success';
          msg.textContent = "Message sent! I'll get back to you soon.";
          form.reset();
        } else {
          throw new Error();
        }
      } catch {
        msg.className = 'alert alert-danger';
        msg.textContent = 'Something went wrong. Email me at hello@poporetto.com';
      } finally {
        msg.classList.remove('d-none');
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        spinner.classList.add('d-none');
      }
    });
  }
});
