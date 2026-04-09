// ============================================================
//  UK DEFENCE SERVICES — script.js
//
//  TABLE OF CONTENTS:
//  1.  Mobile Nav Toggle
//  2.  Hero Carousel (auto-advance + dot navigation)
//  3.  Gallery Tabs + Modal
//  4.  FAQ Accordion
//  5.  Scroll Reveal (IntersectionObserver)
//  6.  Custom Cursor (instant dot, smooth ring via RAF lerp)
//  7.  AI Chat Widget (knowledge-base powered)
//  8.  Services Video Player
//  9.  FAQ Tab Switcher (openTab function)
//  10. Review / Testimonial Carousel
//  11. Avatar Colour Assignment (Google-style)
//  12. Apply Modal (Vacancies page)
//  13. Services Page Tabs
//  14. Gallery Page
// ============================================================


// ── 1. MOBILE NAV TOGGLE ──────────────────────────────────
const menuToggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
const mobileNav  = document.getElementById('mobileNav')  || document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileNav.classList.toggle('active');
  });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    mobileNav &&
    menuToggle &&
    mobileNav.classList.contains('active') &&
    !mobileNav.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    mobileNav.classList.remove('active');
  }
});

// Reset menu on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileNav) {
    mobileNav.classList.remove('active');
  }
});

// ── Close mobile nav when any nav link is tapped ──────────
// Runs after DOM is ready so all mnav links exist
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mnav-link, .mnav-sub-item').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('active');
    });
  });
});

// ── 1b. MOBILE SERVICES ACCORDION ────────────────────────
function toggleMobileServices() {
  const drawer  = document.getElementById('svcDrawer');
  const trigger = document.getElementById('svcTrigger');
  const chevron = document.getElementById('svcChevron');
  if (!drawer || !trigger || !chevron) return;
  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open', !isOpen);
  trigger.classList.toggle('open', !isOpen);
  chevron.classList.toggle('up', !isOpen);
}


// ── 2. HERO CAROUSEL (SAFE VERSION) ─────────────────────
(function () {

  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dots button');

  if (!slides.length || !dots.length) return;

  let current = 0;
  let timer;

  function showSlide(idx) {
    slides.forEach((s, i) => {
      if (s) s.classList.toggle('active', i === idx);
    });
    dots.forEach((d, i) => {
      if (d) d.classList.toggle('active', i === idx);
    });
    current = idx;
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, 6000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.slide));
      startTimer();
    });
  });

  startTimer();

})();


// ── 4. FAQ ACCORDION ─────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;

    document.querySelectorAll('.faq-answer').forEach(a => {
      if (a !== answer) a.style.maxHeight = null;
    });
    document.querySelectorAll('.faq-question').forEach(q => {
      if (q !== btn) q.classList.remove('active');
    });

    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      btn.classList.remove('active');
    } else {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.classList.add('active');
    }
  });
});

function openTab(tabId, el) {
  document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.classList.add('active');
  document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
  document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
}


// ── 5. SCROLL REVEAL (IntersectionObserver) ───────────────
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.classList.add('active');
        }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-up').forEach(el => observer.observe(el));
})();


// ── 6. CUSTOM CURSOR ─────────────────────────────────────
(function () {
  if (window.innerWidth <= 820) return;

  const ring = document.querySelector('.cursor-ring');
  const dot  = document.querySelector('.cursor-dot');
  if (!ring || !dot) return;

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  const RING_LERP = 0.22;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function tick() {
    ringX += (mouseX - ringX) * RING_LERP;
    ringY += (mouseY - ringY) * RING_LERP;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    dot.style.left  = ringX + 'px';
    dot.style.top   = ringY + 'px';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function setCursorState(el) {
    ring.classList.remove('on-link', 'on-btn', 'on-input', 'on-img');
    if (!el) return;
    const tag = el.tagName;
    if      (tag === 'A' || el.closest('a'))                                         ring.classList.add('on-link');
    else if (tag === 'BUTTON' || el.classList.contains('btn') || el.closest('.btn')) ring.classList.add('on-btn');
    else if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')              ring.classList.add('on-input');
    else if (tag === 'IMG' || el.classList.contains('feature-tile') || el.classList.contains('gallery-block')) ring.classList.add('on-img');
  }

  document.addEventListener('mouseover',  e => setCursorState(e.target), { passive: true });
  document.addEventListener('mouseout',   ()  => ring.classList.remove('on-link', 'on-btn', 'on-input', 'on-img'), { passive: true });
  document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; dot.style.opacity = '1'; });
})();


// ── 8. SERVICES VIDEO PLAYER ─────────────────────────────
(function () {
  const poster  = document.getElementById('svsPoster');
  const playBtn = document.getElementById('svsPlayBtn');
  const video   = document.getElementById('svsVideo');
  if (!poster || !video) return;

  function play() {
    poster.style.display = 'none';
    video.style.display  = 'block';
    video.play().catch(() => { video.controls = true; });
  }
  poster.addEventListener('click', play);
  if (playBtn) playBtn.addEventListener('click', e => { e.stopPropagation(); play(); });
})();


// ── 9. FAQ TAB SWITCHER ──────────────────────────────────
function openTab(tabId, el) {
  document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.classList.add('active');
}


// ── 10. REVIEW / TESTIMONIAL CAROUSEL ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const track         = document.querySelector('.review-track');
  const cards         = Array.from(document.querySelectorAll('.review-card'));
  const prevBtn       = document.querySelector('.prev');
  const nextBtn       = document.querySelector('.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!track || !cards.length || !dotsContainer) return;

  const cardsPerView = 3;
  let currentIndex   = 0;
  let autoScroll;

  const totalSlides = Math.ceil(cards.length / cardsPerView);

  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }
  const dots = Array.from(document.querySelectorAll('.carousel-dots span'));

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap       = parseFloat(window.getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap) * cardsPerView}px)`;
    updateDots();
  }

  function nextSlide() { currentIndex = (currentIndex + 1) % totalSlides; updateCarousel(); }
  function prevSlide() { currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; updateCarousel(); }
  function startAuto() { autoScroll = setInterval(nextSlide, 6500); }
  function stopAuto()  { clearInterval(autoScroll); }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { currentIndex = i; updateCarousel(); stopAuto(); });
  });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  window.addEventListener('resize', updateCarousel);

  track.style.transition = 'transform 0.8s ease';
  updateCarousel();
  startAuto();
});


// ── 11. AVATAR COLOUR ASSIGNMENT ─────────────────────────
document.querySelectorAll('.avatar').forEach((avatar, i) => {
  const colors = ['g-blue', 'g-red', 'g-yellow', 'g-green'];
  avatar.classList.add(colors[i % colors.length]);
});


// ── 13. SERVICES PAGE TABS ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const ukdsSection = document.querySelector('.ukds-services');
  if (ukdsSection) {
    const tabs     = ukdsSection.querySelectorAll('.ukds-tab');
    const contents = ukdsSection.querySelectorAll('.ukds-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const target = this.dataset.ukds;
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        contents.forEach(c => c.classList.remove('active'));
        const el = ukdsSection.querySelector('#ukds-' + target);
        if (el) el.classList.add('active');
      });
    });
  }

  const serviceTabs     = document.querySelectorAll('.service-tab');
  const serviceContents = document.querySelectorAll('.service-content');
  if (serviceTabs.length) {
    serviceTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const target = this.getAttribute('data-tab');
        serviceTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        serviceContents.forEach(c => c.classList.remove('active'));
        const el = document.getElementById(target);
        if (el) el.classList.add('active');
      });
    });
  }

});

document.querySelectorAll('.srv-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.srv-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.srv-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) panel.classList.add('active');
  });
});

document.querySelectorAll('.ukds-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.ukds-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ukds-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) panel.classList.add('active');
  });
});


// ── 14. SCROLL REVEAL (IntersectionObserver) ──────────────────
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.classList.add('active');
        }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-up').forEach(el => observer.observe(el));
})();


/* ── Filter ── */
function glFilter(btn, cat) {
  glActiveFilter = cat;
  document.querySelectorAll('.gl__filter-pill').forEach(function(p) {
    p.classList.remove('gl__f-active');
  });
  btn.classList.add('gl__f-active');
  var cards = document.querySelectorAll('#glPhotoGrid .gl__card');
  var visible = 0;
  cards.forEach(function(c) {
    var match = cat === 'all' || c.dataset.cat === cat;
    if (match) { c.classList.remove('gl__hidden'); visible++; }
    else        { c.classList.add('gl__hidden'); }
  });
  var empty = document.getElementById('glEmpty');
  if (visible === 0) { empty.classList.add('gl__show'); }
  else               { empty.classList.remove('gl__show'); }
  document.getElementById('glImgCount').textContent = visible;
}

/* ── Lightbox ── */
function glBuildLbCards() {
  glLbCards = Array.from(
    document.querySelectorAll('#glPhotoGrid .gl__card:not(.gl__hidden)')
  ).filter(function(c) { return c.dataset.img; });
}

function glOpenLb(el) {
  glBuildLbCards();
  glLbIdx = glLbCards.indexOf(el);
  glRenderLb();
  document.getElementById('glLightbox').classList.add('gl__lb-open');
  document.body.style.overflow = 'hidden';
}

function glRenderLb() {
  var el = glLbCards[glLbIdx];
  if (!el) return;
  var img = document.getElementById('glLbImg');
  img.src = el.dataset.img;
  img.alt = el.querySelector('img').alt;
  document.getElementById('glLbTag').textContent   = el.dataset.tag;
  document.getElementById('glLbTitle').textContent = el.dataset.title;
  document.getElementById('glLbCounter').textContent =
    (glLbIdx + 1) + ' / ' + glLbCards.length;
}

function glNavLb(dir) {
  glLbIdx = (glLbIdx + dir + glLbCards.length) % glLbCards.length;
  glRenderLb();
}

function glCloseLb() {
  document.getElementById('glLightbox').classList.remove('gl__lb-open');
  document.body.style.overflow = '';
}

function glLbBgClick(e) {
  if (e.target.id === 'glLightbox') glCloseLb();
}

/* ── Video play ── */
function glPlayVid(n) {
  var vid = document.getElementById('glV' + n);
  var ov  = document.getElementById('glVo' + n);
  var lbl = document.getElementById('glVl' + n);
  var card= document.getElementById('glVc' + n);
  if (vid.paused) {
    vid.muted = false;
    vid.play();
    ov.style.opacity = '0';
    ov.style.pointerEvents = 'none';
    lbl.style.opacity = '0';
    card.classList.add('gl__vid-playing');
  } else {
    vid.pause();
    ov.style.opacity = '1';
    ov.style.pointerEvents = 'auto';
    lbl.style.opacity = '1';
    card.classList.remove('gl__vid-playing');
  }
}

/* ── Keyboard ── */
document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('glLightbox');
  if (!lb) return;
  if (!lb.classList.contains('gl__lb-open')) return;
  if (e.key === 'Escape')      glCloseLb();
  if (e.key === 'ArrowRight')  glNavLb(1);
  if (e.key === 'ArrowLeft')   glNavLb(-1);
});


/* ── Blog index filter — all vars/functions prefixed blgi ── */
var blgiActiveFilter = 'all';

function blgiFilter(btn, cat) {
  blgiActiveFilter = cat;

  document.querySelectorAll('.blgi__pill').forEach(function(p) {
    p.classList.remove('blgi__active');
  });
  btn.classList.add('blgi__active');

  var cards = document.querySelectorAll('#blgiGrid .blgi__card');
  var visible = 0;
  cards.forEach(function(c) {
    var match = cat === 'all' || c.dataset.cat === cat;
    c.classList.toggle('blgi__hidden', !match);
    if (match) visible++;
  });

  document.querySelectorAll('.blgi__cat-hdr').forEach(function(hdr) {
    if (cat === 'all') {
      hdr.style.display = 'flex';
    } else {
      hdr.style.display = hdr.dataset.section === cat ? 'flex' : 'none';
    }
  });

  document.getElementById('blgiCount').textContent = visible;

  var empty = document.getElementById('blgiEmpty');
  empty.classList.toggle('blgi__show', visible === 0);
}

// NOTE: blgiMenuToggle second listener REMOVED — it was adding a duplicate
// click handler on the same menuToggle button causing the menu to open
// and immediately close on every tap. Section 1 above handles all toggle logic.
