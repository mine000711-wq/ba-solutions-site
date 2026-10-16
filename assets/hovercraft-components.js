
(() => {
  'use strict';
  const section = document.querySelector('[data-hovercraft-components]');
  if (!section || !window.HoverMotion || !window.HovercraftPlayback) return;
  const settings = { ...window.HovercraftPlayback };
  if (section.dataset.cameraAssets) settings.assets = section.dataset.cameraAssets;
  if (section.dataset.rotorAssets) settings.rotorAssets = section.dataset.rotorAssets;
  const media = section.querySelector('.hc-media');
  const canvas = section.querySelector('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return;
  const viewer = section.querySelector('.hc-viewer');
  const layout = section.querySelector('.hc-layout');
  const stage = section.querySelector('.hc-stage');
  const poster = section.querySelector('.hc-media img');
  const chapters = [...section.querySelectorAll('[data-hc-chapter]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = new window.HoverMotion.Motion();
  const cache = new Map(), failedLoops = new Set();
  const outgoing = document.createElement('canvas');
  outgoing.width = canvas.width; outgoing.height = canvas.height;
  const outgoingContext = outgoing.getContext('2d');
  let active = 0, enabled = false, inView = false, raf = 0, lastTime = 0;
  let drawn = '', scrollDirty = true, phase = 0, loopStarted = false;
  let fade = 0, paused = false, manualShot = null;

  layout.style.setProperty('--hc-chapter-count', chapters.length);
  chapters.forEach((el, i) => el.setAttribute('aria-hidden', String(i !== active)));
  section.classList.add('hc-enhanced');
  const pad = n => String(n).padStart(3, '0');
  const url = (edge, frame) => `${settings.assets}e${edge}_${pad(frame)}.jpg`;
  const rotorURL = (shot, frame) => `${settings.rotorAssets}s${shot}_${pad(frame)}.jpg`;
  const canRotate = () => !motion.moving && active > 0 && !reduced.matches && !failedLoops.has(active);

  function wake() {
    if (enabled && inView && !document.hidden && !raf) raf = requestAnimationFrame(tick);
  }
  function requestImage(src, shot) {
    if (cache.has(src)) {
      const entry = cache.get(src); cache.delete(src); cache.set(src, entry); return entry;
    }
    const entry = { image: new Image(), ready: false };
    cache.set(src, entry); entry.image.decoding = 'async';
    entry.image.onload = () => { entry.ready = true; wake(); };
    entry.image.onerror = () => {
      entry.failed = true;
      if (shot !== undefined) failedLoops.add(shot);
      wake();
    };
    entry.image.src = src;
    while (cache.size > settings.cacheFrames) cache.delete(cache.keys().next().value);
    return entry;
  }
  function paint(src, entry, dt) {
    if (!entry.ready) return;
    if (src === drawn && !fade) return;
    context.globalAlpha = 1;
    context.drawImage(entry.image, 0, 0, canvas.width, canvas.height);
    if (fade > 0) {
      fade = Math.max(0, fade - dt);
      context.globalAlpha = settings.handoffSeconds ? fade / settings.handoffSeconds : 0;
      context.drawImage(outgoing, 0, 0); context.globalAlpha = 1;
    }
    drawn = src; media.classList.add('has-frame');
  }
  function preloadLoop(shot, frame = 0) {
    if (!shot || failedLoops.has(shot) || reduced.matches) return;
    for (let n = 0; n <= settings.preloadFrames; n++) {
      requestImage(rotorURL(shot, (frame + n) % settings.rotorFrames), shot);
    }
  }
  function render(dt) {
    if (canRotate()) {
      preloadLoop(active, Math.floor(phase * settings.rotorFrames));
      const first = requestImage(rotorURL(active, 0), active);
      if (!loopStarted && first.ready) loopStarted = true;
      if (loopStarted) {
        const frame = Math.floor(phase * settings.rotorFrames) % settings.rotorFrames;
        const src = rotorURL(active, frame);
        paint(src, requestImage(src, active), dt);
        return;
      }
    }
    const frame = motion.frame(settings.edgeFrames), src = url(motion.edge, frame);
    paint(src, requestImage(src), dt);
    const segment = motion.queue[0];
    if (!segment || segment.edge !== motion.edge) return;
    const direction = Math.sign(segment.to - segment.from);
    for (let n = 1; n <= settings.preloadFrames; n++) {
      const next = frame + n * direction;
      if (next >= 0 && next < settings.edgeFrames) requestImage(url(motion.edge, next));
    }
  }
  function select(index) {
    if (index === active) return;
    if (loopStarted && !reduced.matches && outgoingContext) {
      outgoingContext.drawImage(canvas, 0, 0); fade = settings.handoffSeconds;
    }
    active = index; phase = 0; loopStarted = false;
    chapters.forEach((el, i) => {
      el.classList.toggle('is-active', i === index);
      el.setAttribute('aria-hidden', String(i !== index));
    });
    viewer.setAttribute('aria-labelledby', chapters[index].querySelector('h3').id);
    poster.src = url(index, 0);
    motion.select(index); preloadLoop(index);
    if (reduced.matches) motion.tick(100, settings.transitionSeconds);
    lastTime = 0; wake();
  }
  function selectFromScroll() {
    if (manualShot !== null) return;
    const bounds = layout.getBoundingClientRect();
    const travel = Math.max(1, bounds.height - stage.getBoundingClientRect().height);
    const stickyTop = parseFloat(window.getComputedStyle(stage).top) || 0;
    const progress = (stickyTop - bounds.top) / travel;
    select(Math.max(0, Math.min(chapters.length - 1, Math.floor(progress * chapters.length))));
  }
  function tick(time) {
    raf = 0;
    if (document.hidden || !inView) { lastTime = 0; return; }
    if (scrollDirty) { scrollDirty = false; selectFromScroll(); }
    const dt = lastTime && !paused ? Math.min(settings.maxDeltaSeconds, (time - lastTime) / 1000) : 0;
    lastTime = time;
    if (reduced.matches) { motion.tick(100, settings.transitionSeconds); fade = 0; }
    else if (!paused) motion.tick(dt, settings.transitionSeconds);
    if (canRotate() && loopStarted && !paused) {
      phase = (phase + dt / (active === 1 ? settings.rotorSeconds : settings.propellerSeconds)) % 1;
    }
    render(dt);
    if (!paused && (motion.moving || canRotate() || fade > 0)) wake();
    else lastTime = 0;
  }
  function onScroll() { scrollDirty = true; wake(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('visibilitychange', () => { lastTime = 0; wake(); });
  reduced.addEventListener('change', () => { lastTime = 0; wake(); });
  function enable() { enabled = true; wake(); }
  if ('IntersectionObserver' in window) {
    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        requestImage(url(0, 0)); enable(); preload.disconnect();
      }
    }, { rootMargin: settings.loadMargin });
    preload.observe(section);
    new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting); lastTime = 0;
      if (inView) { scrollDirty = true; wake(); }
    }).observe(section);
  } else { inView = true; enable(); }

})();
