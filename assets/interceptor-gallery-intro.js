(function () {
  'use strict';
  var root = document.querySelector('[data-av-intro]');
  if (!root || !root.avSlideshow) return;
  var layer = root.querySelector('[data-interceptor-intro]');
  var video = layer.querySelector('video');

  var timing = {
    fadeInMs: 400,
    fadeOutMs: 400,
    endLeadMs: 100,
    galleryFadeMs: 600,
    videoScale: 1.25,
    maskFeatherPct: 12,
    frameFeatherPct: 4
  };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var state = 'waiting';
  var visible = false;
  var frozen = false;
  var pendingPlay = false;
  var phaseMs = 0;
  var stalledMs = 0;
  var previousTime = -1;
  var lastTick = 0;
  var animation;

  function ease(value) {
    value = Math.max(0, Math.min(1, value));
    return value * value * (3 - 2 * value);
  }
  function paint(videoOpacity, layerOpacity) {
    video.style.opacity = String(videoOpacity);
    layer.style.opacity = String(layerOpacity);
  }
  function applyFraming() {
    layer.style.setProperty('--intro-video-scale', timing.videoScale);
    layer.style.setProperty('--intro-mask-edge', timing.maskFeatherPct + '%');
    layer.style.setProperty('--intro-frame-edge', timing.frameFeatherPct + '%');
  }
  function opacityAt(seconds) {
    var ms = seconds * 1000;
    var fadeIn = ease(ms / timing.fadeInMs);
    if (!Number.isFinite(video.duration)) return fadeIn;
    var fadeEnd = Math.max(0, video.duration * 1000 - timing.endLeadMs);
    var fadeStart = Math.max(0, fadeEnd - timing.fadeOutMs);
    return fadeIn * (1 - ease((ms - fadeStart) / Math.max(1, fadeEnd - fadeStart)));
  }
  function finish() {
    state = 'done';
    video.pause();
    layer.hidden = true;
    root.removeAttribute('data-intro-active');
    root.avSlideshow.setPaused(false, true);
    cancelAnimationFrame(animation);
  }
  function play() {
    if (pendingPlay || !video.paused || video.ended) return;
    pendingPlay = true;
    var result = video.play();
    if (result && result.then) {
      result.then(function () { pendingPlay = false; }).catch(function (error) {
        pendingPlay = false;

        if (error.name !== 'AbortError') finish();
      });
    } else { pendingPlay = false; }
  }
  function syncVisibility() {
    if (state === 'done' || frozen) return;
    if (visible && !document.hidden) {
      if (state === 'waiting' || state === 'video') play();
    } else { video.pause(); }
  }
  function tick(now) {
    var delta = lastTick ? Math.min(now - lastTick, 100) : 0;
    lastTick = now;
    if (state === 'done') return;
    if (!frozen && visible && !document.hidden) {
      if (state === 'waiting' || state === 'video') {
        paint(opacityAt(video.currentTime), 1);
        stalledMs = video.currentTime === previousTime ? stalledMs + delta : 0;
        previousTime = video.currentTime;

        if (stalledMs > 10000) { finish(); return; }
      } else {
        phaseMs += delta;
        if (state === 'reveal') {
          paint(0, 1 - ease(phaseMs / timing.galleryFadeMs));
          if (phaseMs >= timing.galleryFadeMs) { finish(); return; }
        }
      }
    }
    animation = requestAnimationFrame(tick);
  }
  function replay() {
    cancelAnimationFrame(animation);
    frozen = false;
    state = 'waiting';
    phaseMs = stalledMs = lastTick = 0;
    previousTime = -1;
    video.pause();
    video.currentTime = 0;
    root.avSlideshow.setPaused(true, true);
    root.setAttribute('data-intro-active', '');
    layer.hidden = false;
    paint(0, 1);
    syncVisibility();
    animation = requestAnimationFrame(tick);
  }
  video.muted = true;
  video.addEventListener('playing', function () { if (state === 'waiting') state = 'video'; });
  video.addEventListener('ended', function () {
    if (frozen || state === 'done') return;
    paint(0, 1);
    state = 'reveal'; phaseMs = 0;
  });
  video.addEventListener('error', finish);
  video.querySelector('source').addEventListener('error', finish);
  document.addEventListener('visibilitychange', syncVisibility);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      syncVisibility();
    }, { threshold: 0 }).observe(root);
  } else { visible = true; }
  if (reduced.addEventListener) reduced.addEventListener('change', function () {
    if (reduced.matches) finish();
  });
  if (reduced.matches || video.error) { finish(); return; }
  applyFraming();
  replay();

}());
