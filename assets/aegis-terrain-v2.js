/* Pre-rendered terrain: one responsive source, no per-frame JavaScript. */
(function () {
  const section = document.querySelector('.aegis-sec');
  const video = section && section.querySelector('.aegis-terrain');
  if (!video) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let near = false, visible = false, loaded = false, prepared = false, failed = false;
  const allowed = () => !reduced.matches && !(connection && connection.saveData);
  function update() {
    if (!allowed() || document.hidden || !visible) video.pause();
    if (!allowed() || document.hidden || failed) return;
    if (near && !loaded) {
      loaded = true;
      const mobile = window.matchMedia('(max-width: 767px)').matches ||
        (connection && /^(slow-2g|2g|3g)$/.test(connection.effectiveType));
      video.src = mobile ? video.dataset.srcMobile : video.dataset.srcDesktop;
      video.load();
    }
    if (visible && prepared && video.paused) {
      const play = video.play();
      if (play && play.catch) play.catch(() => {});
    }
  }
  video.muted = true;
  video.addEventListener('loadedmetadata', function () {
    // Each scene holds for 3 seconds before morphing; select a stable start.
    const start = Math.floor(Math.random() * 9) * 4.2;
    if (start > 0) {
      video.addEventListener('seeked', function () { prepared = true; update(); }, { once: true });
      video.currentTime = Math.min(start, Math.max(0, video.duration - 1));
    } else { prepared = true; update(); }
  }, { once: true });
  video.addEventListener('playing', () => video.classList.add('is-ready'));
  video.addEventListener('error', () => { failed = true; video.classList.remove('is-ready'); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { near = entries[0].isIntersecting; update(); },
      { rootMargin: '300px' }).observe(section);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
      update();
    }, { threshold: [0, 0.01] }).observe(section);
  } else { near = visible = true; update(); }
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', update);
  if (reduced.addEventListener) reduced.addEventListener('change', update);
  else reduced.addListener(update);
  if (connection && connection.addEventListener) connection.addEventListener('change', update);
})();
