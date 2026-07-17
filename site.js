/* Packr — shared site behavior.
   Nav scrolled state, Calendly popup interception, scroll reveal,
   and the parallax engine. Loaded with `defer` on every page. */
(() => {
  'use strict';

  const doc = document.documentElement;
  doc.classList.add('js');

  /* ---- Sticky nav scrolled state ---- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onNavScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ---- Calendly popup interception ----
     Opens any calendly.com link as a modal instead of navigating.
     Falls back to a normal link if the widget script hasn't loaded. */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="calendly.com"]');
    if (!link || typeof Calendly === 'undefined') return;
    e.preventDefault();
    Calendly.initPopupWidget({ url: link.href });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Scroll reveal ---- */
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-revealed'));
    } else {
      const revealIO = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.setProperty('--reveal-delay', `${parseInt(delay, 10) || 0}ms`);
          el.classList.add('is-revealed');
          revealIO.unobserve(el);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -8%' });
      revealEls.forEach((el) => revealIO.observe(el));
    }
  }

  /* ---- Results carousel ----
     Coverflow of stat/quote cards: active card centered, neighbors
     scaled/faded behind. Auto-rotates every 5s; paused on hover or
     focus, disabled entirely under prefers-reduced-motion. */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const stage = carousel.querySelector('.pk-carousel-stage');
    const cards = Array.from(stage.querySelectorAll('.pk-result-card'));
    const dotsWrap = carousel.querySelector('.pk-carousel-dots');
    const count = cards.length;
    let active = 0;
    let spacing = 380;

    const dots = cards.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'pk-carousel-dot';
      dot.setAttribute('aria-label', `Go to item ${i + 1} of ${count}`);
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    const measure = () => {
      spacing = Math.min(400, Math.max(230, stage.clientWidth * 0.3));
    };

    const layout = () => {
      cards.forEach((card, i) => {
        let rel = i - active;
        if (rel > count / 2) rel -= count;
        if (rel < -count / 2) rel += count;
        const abs = Math.abs(rel);
        card.style.transform =
          `translate(-50%, -50%) translateX(${(rel * spacing).toFixed(1)}px) ` +
          `scale(${Math.max(0.72, 1 - abs * 0.09).toFixed(3)})`;
        card.style.opacity = abs === 0 ? '1' : abs === 1 ? '0.8' : abs === 2 ? '0.4' : '0';
        card.style.zIndex = String(20 - abs);
        card.style.pointerEvents = abs <= 2 ? 'auto' : 'none';
        card.classList.toggle('is-active', rel === 0);
        card.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
      });
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
    };

    const goTo = (i) => {
      active = ((i % count) + count) % count;
      layout();
    };

    cards.forEach((card, i) => card.addEventListener('click', () => {
      if (i !== active) { goTo(i); restartAutoplay(); }
    }));
    carousel.querySelector('[data-carousel-prev]')
      .addEventListener('click', () => { goTo(active - 1); restartAutoplay(); });
    carousel.querySelector('[data-carousel-next]')
      .addEventListener('click', () => { goTo(active + 1); restartAutoplay(); });

    let autoTimer = 0;
    const startAutoplay = () => {
      if (reducedMotion.matches || autoTimer) return;
      autoTimer = setInterval(() => goTo(active + 1), 5000);
    };
    const stopAutoplay = () => { clearInterval(autoTimer); autoTimer = 0; };
    const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };
    carousel.addEventListener('pointerenter', stopAutoplay);
    carousel.addEventListener('pointerleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    reducedMotion.addEventListener('change', () => { stopAutoplay(); startAutoplay(); });

    window.addEventListener('resize', () => { measure(); layout(); });
    measure();
    layout();
    startAutoplay();
  }

  /* ---- Parallax engine ----
     data-parallax="0.12"    speed — positive lags the scroll,
                             negative counters it (depth cue)
     data-parallax-max="48"  offset clamp in px (default 40)

     Transform-only writes from a single rAF loop; only elements near
     the viewport are updated (IntersectionObserver-tracked). Disabled
     on reduced-motion, coarse pointers, and viewports < 768px. */
  const layers = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
    el,
    speed: parseFloat(el.getAttribute('data-parallax')) || 0,
    max: Math.abs(parseFloat(el.getAttribute('data-parallax-max'))) || 40,
    center: 0,
    active: false,
  }));

  if (!layers.length) return;

  const coarsePointer = window.matchMedia('(pointer: coarse)');

  // Document-space Y via the offsetParent chain — unaffected by the
  // transforms this engine writes, so re-measuring never feeds back.
  const documentY = (el) => {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  };

  const measure = () => {
    for (const layer of layers) {
      layer.center = documentY(layer.el) + layer.el.offsetHeight / 2;
    }
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const vpCenter = window.scrollY + window.innerHeight / 2;
    for (const layer of layers) {
      if (!layer.active) continue;
      let offset = (layer.center - vpCenter) * layer.speed;
      if (offset > layer.max) offset = layer.max;
      else if (offset < -layer.max) offset = -layer.max;
      // rotate() keeps each shot's CSS tilt composed with the drift
      layer.el.style.transform =
        `translate3d(0, ${offset.toFixed(1)}px, 0) rotate(var(--shot-tilt, 0deg))`;
    }
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  let visibilityIO = null;
  let enabled = false;

  const enable = () => {
    if (enabled) return;
    enabled = true;
    doc.classList.add('pk-parallax-on');
    measure();
    visibilityIO = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const layer = layers.find((l) => l.el === entry.target);
        if (layer) layer.active = entry.isIntersecting;
      }
      requestUpdate();
    }, { rootMargin: '20% 0px 20% 0px' });
    layers.forEach((layer) => visibilityIO.observe(layer.el));
    window.addEventListener('scroll', requestUpdate, { passive: true });
    requestUpdate();
  };

  const disable = () => {
    if (!enabled) return;
    enabled = false;
    doc.classList.remove('pk-parallax-on');
    if (visibilityIO) { visibilityIO.disconnect(); visibilityIO = null; }
    window.removeEventListener('scroll', requestUpdate);
    for (const layer of layers) {
      layer.active = false;
      layer.el.style.transform = '';
    }
  };

  const evaluate = () => {
    const wanted = !reducedMotion.matches && !coarsePointer.matches && window.innerWidth >= 768;
    if (wanted) enable(); else disable();
  };

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      evaluate();
      if (enabled) { measure(); requestUpdate(); }
    }, 150);
  });
  reducedMotion.addEventListener('change', evaluate);
  coarsePointer.addEventListener('change', evaluate);

  // Late layout shifts (fonts, lazy screenshots) move layer centers
  window.addEventListener('load', () => {
    if (enabled) { measure(); requestUpdate(); }
  });

  evaluate();
})();
