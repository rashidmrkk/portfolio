const SECTIONS = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];

async function loadSections() {
  const app = document.getElementById('app');
  for (const name of SECTIONS) {
    const res = await fetch(`sections/${name}.html`);
    const html = await res.text();
    app.insertAdjacentHTML('beforeend', html);
  }
  initAll();
}

function initAll() {
  initParticles();
  initCursor();
  initScrollReveal();
  initCountUp();
  initNavScroll();
  initTyping();
  initCarousels();
  initReadMore();
}

/* ── PARTICLE CANVAS ── */
let _particleRaf = null;
let _particleDraw = null;

function initParticles() {
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function initParticleList() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: randomBetween(0.5, 2),
        dx: randomBetween(-0.3, 0.3),
        dy: randomBetween(-0.3, 0.3),
        alpha: randomBetween(0.2, 0.7),
        color: Math.random() > 0.5 ? '56,189,248' : '129,140,248'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    _particleRaf = requestAnimationFrame(draw);
  }

  _particleDraw = draw;
  resize();
  initParticleList();
  draw();
  window.addEventListener('resize', () => { resize(); initParticleList(); });
}

/* ── CURSOR GLOW ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
  }, { passive: true });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
}

/* ── COUNT-UP ── */
function initCountUp() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + '+';
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => observer.observe(el));
}

/* ── NAV SCROLL ── */
function initNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.background = window.scrollY > 50
      ? 'rgba(6,11,24,0.95)'
      : 'rgba(6,11,24,0.8)';
  });
}

/* ── TYPING EFFECT ── */
function initTyping() {
  const roles = ['Software Engineer', 'React Native Dev', 'Full Stack Developer', 'Data Engineer'];
  let ri = 0, ci = 0, deleting = false;
  const roleEl = document.querySelector('.hero-role');
  if (!roleEl) return;

  function type() {
    const role = roles[ri];
    if (!deleting) {
      roleEl.textContent = '< ' + role.slice(0, ci++) + ' />';
      if (ci > role.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      roleEl.textContent = '< ' + role.slice(0, ci--) + ' />';
      if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  setTimeout(type, 1000);
}

/* ── READ MORE (description only) ── */
function initReadMore() {
  document.querySelectorAll('.project-card').forEach(card => {
    const desc = card.querySelector('.project-desc');
    if (!desc) return;
    const btn = document.createElement('button');
    btn.className = 'read-more-btn';
    btn.textContent = '+ Read more';
    desc.after(btn);
    btn.addEventListener('click', () => {
      const expanded = desc.classList.toggle('expanded');
      btn.textContent = expanded ? '− Show less' : '+ Read more';
    });
  });
}

loadSections();

/* ── SCREENSHOT CAROUSEL + LIGHTBOX ── */
function initCarousels() {
  // Inject lightbox modal once
  document.body.insertAdjacentHTML('beforeend', `
    <div id="img-modal" class="img-modal" role="dialog" aria-modal="true">
      <div class="img-modal-backdrop"></div>
      <button class="img-modal-close" aria-label="Close"><i class="fas fa-times"></i></button>
      <button class="img-modal-nav img-modal-prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
      <button class="img-modal-nav img-modal-next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
      <div class="img-modal-frame">
        <img id="img-modal-img" src="" alt="">
        <span class="img-modal-counter" id="img-modal-counter"></span>
      </div>
    </div>
  `);

  const modal      = document.getElementById('img-modal');
  const modalImg   = document.getElementById('img-modal-img');
  const modalCount = document.getElementById('img-modal-counter');
  let mImages = [], mIndex = 0;

  const canvas = document.getElementById('canvas-bg');

  function openModal(srcs, i) {
    mImages = srcs; mIndex = i;
    syncModal();
    cancelAnimationFrame(_particleRaf);
    if (canvas) canvas.style.visibility = 'hidden';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (canvas) canvas.style.visibility = '';
    if (_particleDraw) _particleDraw();
  }

  function syncModal() {
    modalImg.src = mImages[mIndex];
    modalCount.textContent = `${mIndex + 1} / ${mImages.length}`;
  }

  function modalNav(dir) {
    mIndex = (mIndex + dir + mImages.length) % mImages.length;
    syncModal();
  }

  modal.querySelector('.img-modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.img-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.img-modal-prev').addEventListener('click', () => modalNav(-1));
  modal.querySelector('.img-modal-next').addEventListener('click', () => modalNav(1));
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   modalNav(-1);
    if (e.key === 'ArrowRight')  modalNav(1);
  });

  // Wire up each [data-carousel] independently
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const track  = root.querySelector('.screenshots-track');
    const dots   = [...root.querySelectorAll('.sc-dot')];
    const images = [...root.querySelectorAll('.screenshots-track img')];
    let idx = 0;

    // Hide nav controls when there's only one image
    if (images.length <= 1) {
      root.querySelector('.sc-prev').style.display = 'none';
      root.querySelector('.sc-next').style.display = 'none';
      root.querySelector('.sc-dots').style.display = 'none';
    }

    function update() {
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    root.querySelector('.sc-prev').addEventListener('click', e => {
      e.stopPropagation();
      idx = (idx - 1 + images.length) % images.length;
      update();
    });

    root.querySelector('.sc-next').addEventListener('click', e => {
      e.stopPropagation();
      idx = (idx + 1) % images.length;
      update();
    });

    dots.forEach((dot, i) => dot.addEventListener('click', e => {
      e.stopPropagation();
      idx = i; update();
    }));

    images.forEach((img, i) => img.addEventListener('click', () => {
      openModal(images.map(im => im.src), i);
    }));
  });
}
