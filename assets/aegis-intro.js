(function () {
  'use strict';
  var hero = document.getElementById('hero');
  var next = document.getElementById('three-no');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var timing = { holdMs: 2000, fadeOutMs: 400, fadeInMs: 400, effectScrollRatio: 0.3 };
  var intro = window.AEGIS_INTRO = { timing: timing, moving: false };

  var frame = 0, start = 0, active = false, elapsed = 0;
  function targetY() { return next.getBoundingClientRect().top + window.scrollY; }
  function ease(value) {
    value = Math.max(0, Math.min(1, value));
    return value * value * (3 - 2 * value);
  }
  function duration() { return timing.holdMs + (reduced.matches ? 0 : timing.fadeOutMs + timing.fadeInMs); }
  function paint(ms) {
    var fadeOut = reduced.matches ? 0 : timing.fadeOutMs;
    var fadeIn = reduced.matches ? 0 : timing.fadeInMs;
    var switchAt = timing.holdMs + fadeOut;
    var arrived = ms >= switchAt;
    intro.moving = ms >= timing.holdMs && ms < duration();

    hero.style.opacity = arrived ? '' : String(1 - ease((ms - timing.holdMs) / Math.max(1, fadeOut)));
    next.style.opacity = arrived ? String(fadeIn ? ease((ms - switchAt) / fadeIn) : 1) : '0';
    var y = arrived ? targetY() : 0;
    if (Math.abs(window.scrollY - y) > 0.5) window.scrollTo({ top: y, behavior: 'instant' });

  }
  function stop() {
    active = false;
    intro.moving = false;
    cancelAnimationFrame(frame);
    hero.style.opacity = '';
    next.style.opacity = '';
  }
  function tick(now) {
    if (!active) return;
    elapsed = now - start;
    paint(elapsed);
    if (elapsed < duration()) {
      frame = requestAnimationFrame(tick);
    } else stop();
  }
  function play() {
    stop();
    elapsed = 0;
    paint(0);
    window.dispatchEvent(new Event('aegis-intro-replay'));
    active = true;
    start = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function interrupt(event) {

    if (event.type === 'keydown' && !/^(ArrowDown|ArrowUp|PageDown|PageUp|Home|End| )$/.test(event.key)) return;
    stop();
  }
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (type) {
    window.addEventListener(type, interrupt, { passive: true });
  });
  window.addEventListener('hashchange', stop);
  window.addEventListener('pagehide', stop);

  requestAnimationFrame(function () {
    if ((!location.hash || location.hash === '#hero') && window.scrollY < 1) play();
  });

})();
