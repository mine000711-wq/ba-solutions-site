(function () {
  'use strict';
  var root = document.querySelector('[data-av-slideshow]');
  if (!root) return;

  var timing = { intervalMs: 5000, fadeMs: 600 };
  var slides = Array.prototype.slice.call(root.querySelectorAll('.av-slide'));
  var current = 0;
  var timer;
  var visible = false;
  var frozen = false;
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
    if (!visible || document.hidden || frozen) return;
    timer = setTimeout(function () { show(current + 1); schedule(); }, timing.intervalMs);
  }
  function move(direction) { show(current + direction); schedule(); }
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

  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname) ||
      new URLSearchParams(location.search).get('tuneSlides') !== '1') return;
  var panel = document.createElement('aside');
  panel.className = 'av-slide-tuner';
  panel.setAttribute('aria-label', '슬라이드 미리보기 조절');
  panel.innerHTML = '<label>자동 넘김 간격 (초)<input data-interval type="range" min="2" max="12" step="0.5" value="5"><output data-interval-value>5</output></label>' +
    '<label>페이드 시간 (초)<input data-fade type="range" min="0.2" max="1.2" step="0.1" value="0.6"><output data-fade-value>0.6</output></label>' +
    '<label>시점 고정<input data-freeze type="checkbox"></label>' +
    '<label>고정 시점 (초)<input data-time type="range" min="0" max="14.9" step="0.1" value="0"></label>' +
    '<button data-replay type="button">다시 재생</button><button data-copy type="button">현재 값 복사</button><textarea data-values readonly aria-label="현재 설정값"></textarea>';
  document.body.appendChild(panel);
  var interval = panel.querySelector('[data-interval]');
  var fade = panel.querySelector('[data-fade]');
  var freeze = panel.querySelector('[data-freeze]');
  var time = panel.querySelector('[data-time]');
  time.max = timing.intervalMs * slides.length / 1000 - 0.1;
  var values = panel.querySelector('[data-values]');
  function updateValues() { values.value = JSON.stringify(timing); }
  interval.addEventListener('input', function () {
    timing.intervalMs = Number(interval.value) * 1000;
    panel.querySelector('[data-interval-value]').textContent = interval.value;
    time.max = timing.intervalMs * slides.length / 1000 - 0.1;
    updateValues(); schedule();
  });
  fade.addEventListener('input', function () {
    timing.fadeMs = Number(fade.value) * 1000;
    panel.querySelector('[data-fade-value]').textContent = fade.value;
    applyTiming(); updateValues();
  });
  freeze.addEventListener('change', function () {
    frozen = freeze.checked;
    if (frozen) sampleTime(); else show(current, true);
    schedule();
  });
  function sampleTime() {
    var milliseconds = Number(time.value) * 1000;
    var phase = milliseconds % timing.intervalMs;
    show(Math.floor(milliseconds / timing.intervalMs), true);
    var progress = milliseconds === 0 ? 1 : Math.min(1, phase / timing.fadeMs);
    var previous = (current + slides.length - 1) % slides.length;
    slides[current].style.opacity = String(progress);
    if (progress < 1) slides[previous].style.opacity = String(1 - progress);
  }
  time.addEventListener('input', function () {
    frozen = freeze.checked = true;
    sampleTime();
    schedule();
  });
  panel.querySelector('[data-replay]').addEventListener('click', function () {
    frozen = freeze.checked = false; time.value = 0; show(0, true); schedule();
  });
  panel.querySelector('[data-copy]').addEventListener('click', function () {
    values.select(); navigator.clipboard.writeText(values.value).catch(function () {});
  });
  updateValues();
}());
