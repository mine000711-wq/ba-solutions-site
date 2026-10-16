(function () {
  'use strict';
  var root = document.querySelector('[data-av-slideshow]');
  if (!root) return;

  var timing = { intervalMs: 5000, fadeMs: 600 };
  var slides = Array.prototype.slice.call(root.querySelectorAll('.av-slide'));
  if (!slides.length) return;
  var hasMultiple = slides.length > 1;
  Array.prototype.forEach.call(root.querySelectorAll('.av-slide-arrow'), function (button) {
    button.hidden = !hasMultiple;
  });
  var current = 0;
  var timer;
  var visible = false;
  var frozen = false;
  var paused = root.hasAttribute('data-av-intro');
  function applyTiming() { root.style.setProperty('--av-slide-fade', timing.fadeMs + 'ms'); }
  function show(index, instant) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.hidden = false;
      slide.style.transition = instant ? 'none' : '';
      slide.style.opacity = '';
      slide.dataset.active = String(i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    root.dataset.slide = String(current + 1);
  }
  function schedule() {
    clearTimeout(timer);
    if (!hasMultiple || !visible || document.hidden || frozen || paused) return;
    timer = setTimeout(function () { show(current + 1); schedule(); }, timing.intervalMs);
  }
  function move(direction) { if (!paused) { show(current + direction); schedule(); } }

  root.avSlideshow = {
    setPaused: function (value, reset) {
      paused = value;
      if (reset) show(0, true);
      schedule();
    }
  };
  root.querySelector('[data-av-prev]').addEventListener('click', function () { move(-1); });
  root.querySelector('[data-av-next]').addEventListener('click', function () { move(1); });
  root.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(root);
  } else { visible = true; }
  applyTiming();
  show(0, true);
  root.classList.add('av-slideshow-ready');
  schedule();

  }());
