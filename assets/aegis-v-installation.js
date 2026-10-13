
(() => {
  'use strict';
  const section = document.querySelector('[data-aegis-installation]');
  if (!section) return;
  const moduleBase = document.currentScript.src;
  const stage = section.querySelector('.av-stage');
  const host = section.querySelector('.av-viewer');
  const status = section.querySelector('.av-status');
  const buttons = [...section.querySelectorAll('[data-av-shot]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let viewer, scenes, config, transition, elapsed = 0, active = 0;
  let frame = 0, scrollFrame = 0, lastTime = 0, inView = false;
  let loading = false, ready = false, disposed = false, pinned = false;
  let statusKey = 'idle', loadPercent = null;
  const labels = {
    idle: ['Vehicle system view', '차량 시스템 3D 보기'],
    loading: ['Loading 3D view', '3D 모델 불러오는 중'],
    error: ['The 3D view is unavailable. Please reload to try again.', '3D 화면을 불러오지 못했습니다. 새로고침해 주세요.'],
    local: ['3D cannot load when this HTML file is opened directly. Run “홈페이지 미리보기.command” in the 01_홈페이지 folder and use the Chrome window it opens.', 'HTML 파일을 직접 열면 3D를 불러올 수 없습니다. 01_홈페이지 폴더의 “홈페이지 미리보기.command”를 실행하고 열린 Chrome 창에서 확인해 주세요.'],
    canvas: ['AEGIS-V vehicle model. Select a description or scroll to change the view.', 'AEGIS-V 차량 모델. 설명을 선택하거나 스크롤하면 구도가 바뀝니다.']
  };
  function localized(key) { return labels[key][document.documentElement.dataset.lang === 'ko' ? 1 : 0]; }
  function language() {
    status.textContent = localized(statusKey) + (statusKey === 'loading' && loadPercent !== null ? ` · ${loadPercent}%` : '');
    host.querySelector('canvas')?.setAttribute('aria-label', localized('canvas'));
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; }
  function finish() {
    stop();
    if (transition) viewer.configure(transition.to);
    transition = null;
  }
  function wake() {
    if (transition && ready && inView && !document.hidden && !frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function tick(now) {
    frame = 0;
    if (!ready || !transition || !inView || document.hidden) return;
    elapsed = Math.min(transition.duration, elapsed + Math.min((now - lastTime) / 1000, 0.08));
    lastTime = now;
    viewer.configure(scenes.sampleTransition(transition, elapsed, config.motion));
    if (elapsed >= transition.duration) transition = null;
    else frame = requestAnimationFrame(tick);
  }
  function select(index, animate = true) {
    active = index;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (!viewer) return;
    stop();
    transition = scenes.createTransition(viewer.getState(), config.shots[index], config.motion);
    elapsed = 0;
    if (!animate || reduced.matches || !inView || document.hidden) finish();
    else wake();
  }
  function step() { return stage.clientHeight * config.motion.scrollScreens; }
  function start() { return section.getBoundingClientRect().top + window.scrollY - 56; }
  function syncScroll(animate = true) {
    if (!ready || !pinned) return;
    const index = scenes.shotAtScroll(window.scrollY, start(), step(), buttons.length);
    if (index !== active) select(index, animate);
  }
  function onScroll() {
    if (scrollFrame || !ready || !pinned) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; syncScroll(); });
  }
  function layout() {
    if (!ready) return;
    pinned = window.innerHeight > 620 && stage.clientHeight <= window.innerHeight - 55;
    section.classList.toggle('av-pinned', pinned);
    section.style.height = pinned ? `${stage.clientHeight + step() * (buttons.length - 1)}px` : '';
    syncScroll(false);
  }
  function unavailable(error, reason = 'error') {
    stop(); transition = null; ready = false; pinned = false;
    section.classList.remove('av-ready', 'av-pinned');
    section.classList.add('av-unavailable'); section.style.height = '';
    buttons.forEach(button => { button.disabled = true; });
    statusKey = reason; status.hidden = false; host.setAttribute('aria-busy', 'false');
    language();
    if (error) console.error('AEGIS-V 3D view:', error);
  }
  async function load() {
    if (loading || disposed) return;

    if (new URL(moduleBase).protocol === 'file:') { unavailable(null, 'local'); return; }
    loading = true; statusKey = 'loading'; language();
    try {
      const [sceneModule, viewModule] = await Promise.all([
        import(new URL('./aegis-v-scenes.js?v=20261013-tuned1', moduleBase).href),
        import(new URL('./aegis-v-viewer.js?v=20261013-tuned1', moduleBase).href)
      ]);
      if (disposed) return;
      scenes = sceneModule; config = scenes.AEGIS_V_STORY;
      viewer = await viewModule.createAegisVViewer(host, {
        interactive: false, lowKey: true, settings: scenes.sceneOf(config.shots[0]),
        onProgress: event => {
          if (event.total) { loadPercent = Math.round(event.loaded / event.total * 100); language(); }
        },
        onError: () => unavailable()
      });
      if (disposed) { viewer.dispose(); return; }
      ready = true; section.classList.add('av-ready');
      status.hidden = true; host.setAttribute('aria-busy', 'false');
      buttons.forEach(button => { button.disabled = false; });
      language(); layout(); select(active, false);
    } catch (error) { if (!disposed) unavailable(error); }
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    if (!ready) return;
    select(index);

    if (pinned) window.scrollTo({ top: start() + index * step(), behavior: 'instant' });
  }));
  const nearObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { nearObserver.disconnect(); load(); }
  }, { rootMargin: '800px 0px' });
  nearObserver.observe(section);
  const visibleObserver = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) { syncScroll(false); wake(); } else stop();
  });
  visibleObserver.observe(host);
  const sizeObserver = new ResizeObserver(layout);
  sizeObserver.observe(stage);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', layout);
  document.addEventListener('ba:lang', language);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else { syncScroll(false); wake(); }
  });
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
  window.addEventListener('pageshow', () => { layout(); wake(); });
  window.addEventListener('pagehide', event => {
    stop(); cancelAnimationFrame(scrollFrame); scrollFrame = 0;
    if (!event.persisted) {
      disposed = true; nearObserver.disconnect(); visibleObserver.disconnect(); sizeObserver.disconnect(); viewer?.dispose();
    }
  });
})();
