import * as THREE from 'three';
import { createLowKeyTreatment, AEGIS_V_LOW_KEY_DEFAULTS, AEGIS_V_LOW_KEY_FIELDS } from './aegis-v-low-key.js';
import { GLTFLoader } from './vendor/three-0.186.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './vendor/three-0.186.0/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from './vendor/three-0.186.0/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from './vendor/three-0.186.0/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from './vendor/three-0.186.0/examples/jsm/lights/RectAreaLightUniformsLib.js';

export const AEGIS_V_DEFAULTS = Object.freeze({
  speed: 1, progress: 0, azimuth: 38, elevation: 18, distance: 0.8,
  targetX: 0, targetY: 0, targetZ: 0,
  exposure: 0.9, environment: 0.22, windowBlur: 0.08,
  keyIntensity: 12, fillIntensity: 2.5, rimIntensity: 18, topIntensity: 5,
  keyAzimuth: -38, keyElevation: 48, keySize: 1,
  rimAzimuth: 145, rimElevation: 28, rimSize: 1,
  keyColor: '#ffe6ce', fillColor: '#c7dcff', rimColor: '#9fc6ff'
});

export const AEGIS_V_CONTROL_GROUPS = [
  { title: '밝기 · 유리', open: true, fields: [
    ['exposure', '전체 밝기', 0.2, 3, 0.05, ''],
    ['environment', '주변 반사광', 0, 1, 0.01, ''],
    ['windowBlur', '창문 블러', 0, 0.5, 0.01, '']
  ] },
  { title: '시네마틱 조명', open: true, fields: [
    ['keyIntensity', '주광 · 차체 윤곽', 0, 40, 0.5, ''],
    ['fillIntensity', '보조광 · 어두운 면', 0, 20, 0.5, ''],
    ['rimIntensity', '윤곽광 · 뒤쪽 테두리', 0, 50, 0.5, ''],
    ['topIntensity', '상부 조명 · 뚜껑', 0, 30, 0.5, ''],
    ['keyColor', '주광 색상'], ['fillColor', '보조광 색상'], ['rimColor', '윤곽광 색상']
  ] },
  { title: '조명 방향 · 폭', open: false, fields: [
    ['keyAzimuth', '주광 좌우 방향', -180, 180, 1, '°'],
    ['keyElevation', '주광 높이 각도', 5, 85, 1, '°'],
    ['keySize', '주광 폭', 0.3, 2.5, 0.05, '×'],
    ['rimAzimuth', '윤곽광 좌우 방향', -180, 180, 1, '°'],
    ['rimElevation', '윤곽광 높이 각도', 5, 85, 1, '°'],
    ['rimSize', '윤곽광 폭', 0.3, 2.5, 0.05, '×']
  ] },
  { title: '카메라 · 재생', open: false, fields: [
    ['speed', '재생 속도', 0.1, 3, 0.05, '×'],
    ['azimuth', '좌우 각도', -180, 180, 1, '°'],
    ['elevation', '위에서 보는 각도', 5, 85, 1, '°'],
    ['distance', '카메라 거리', 0.5, 2, 0.01, ''],
    ['targetX', '주목 위치 · 좌우', -0.5, 0.5, 0.01, ''],
    ['targetY', '주목 위치 · 높이', -0.5, 0.5, 0.01, ''],
    ['targetZ', '주목 위치 · 앞뒤', -0.5, 0.5, 0.01, '']
  ] }
];
const controlsByKey = new Map([...AEGIS_V_CONTROL_GROUPS.flatMap(group => group.fields), ...AEGIS_V_LOW_KEY_FIELDS].map(field => [field[0], field]));

export async function createAegisVViewer(host, options = {}) {
  const settings = { ...AEGIS_V_DEFAULTS, ...AEGIS_V_LOW_KEY_DEFAULTS, ...options.settings };
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = settings.exposure;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', options.interactive === false
    ? 'AEGIS-V 차량 3D 모델. 설명을 선택하거나 스크롤하면 구도가 바뀝니다.'
    : 'AEGIS-V 차량 3D 모델. 드래그로 회전, 휠로 확대·축소');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  if (options.lowKey) scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = options.interactive !== false;
  if (!controls.enabled) renderer.domElement.style.touchAction = 'pan-y';
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = Math.PI * 0.49;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  RectAreaLightUniformsLib.init();
  const key = new THREE.RectAreaLight();
  const fill = new THREE.RectAreaLight();
  const rim = new THREE.RectAreaLight();
  const top = new THREE.RectAreaLight();
  scene.add(key, fill, rim, top);
  const draco = new DRACOLoader();
  draco.setDecoderPath({
    js: new URL('./vendor/three-0.186.0/examples/jsm/libs/draco/gltf/draco_wasm_wrapper.js', import.meta.url).href,
    wasm: new URL('./vendor/three-0.186.0/examples/jsm/libs/draco/gltf/draco_decoder.wasm', import.meta.url).href
  });
  draco.setWorkerLimit(2);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  let gltf;
  try {
    gltf = await loader.loadAsync(new URL('./models/aegis-v/aegis-v.glb?v=cinematic-2', import.meta.url).href, options.onProgress);
  } catch (error) {
    draco.dispose(); controls.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    throw error;
  }
  draco.dispose();
  const model = gltf.scene;
  scene.add(model);
  const clip = THREE.AnimationClip.findByName(gltf.animations, 'Roof_Open');
  if (!clip) {
    controls.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    throw new Error('Roof_Open 애니메이션을 찾을 수 없습니다.');
  }
  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();
  action.paused = true;
  const envelope = new THREE.Box3();
  for (const p of [0, 0.5, 1]) {
    action.time = p * clip.duration;
    mixer.update(0);
    model.updateMatrixWorld(true);
    envelope.union(new THREE.Box3().setFromObject(model));
  }
  const center = envelope.getCenter(new THREE.Vector3());
  const sphere = envelope.getBoundingSphere(new THREE.Sphere());
  const windowMaterials = new Set();
  model.traverse(object => {
    for (const material of [].concat(object.material || [])) {
      if (material.name === 'windowglass') windowMaterials.add(material);
    }
  });
  const lowKey = options.lowKey ? createLowKeyTreatment(model) : null;
  function positionLight(light, azimuth, elevation, width, height) {
    const a = THREE.MathUtils.degToRad(azimuth), e = THREE.MathUtils.degToRad(elevation);
    const distance = sphere.radius * 2.1;
    light.position.set(
      center.x + distance * Math.sin(a) * Math.cos(e),
      center.y + distance * Math.sin(e),
      center.z + distance * Math.cos(a) * Math.cos(e)
    );
    light.width = sphere.radius * width;
    light.height = sphere.radius * height;
    light.lookAt(center);
  }
  function updateLighting() {
    lowKey?.configure(settings);
    renderer.toneMappingExposure = settings.exposure;
    scene.environmentIntensity = settings.environment;
    key.color.set(settings.keyColor); key.intensity = settings.keyIntensity;
    fill.color.set(settings.fillColor); fill.intensity = settings.fillIntensity;
    rim.color.set(settings.rimColor); rim.intensity = settings.rimIntensity;
    top.color.set(settings.keyColor); top.intensity = settings.topIntensity;
    positionLight(key, settings.keyAzimuth, settings.keyElevation, 1.7 * settings.keySize, 0.75 * settings.keySize);
    positionLight(fill, 65, 20, 1.5, 1);
    positionLight(rim, settings.rimAzimuth, settings.rimElevation, 0.45 * settings.rimSize, 1.8 * settings.rimSize);
    positionLight(top, -150, 82, 1.8, 0.5);
    windowMaterials.forEach(material => { material.roughness = settings.windowBlur; });
  }
  updateLighting();
  controls.target.copy(center);
  controls.minDistance = sphere.radius * 1.3;
  controls.maxDistance = sphere.radius * 8;
  let frame = 0, playing = false, direction = 1, previous = 0, disposed = false;
  let visible = true;
  let width = 1, height = 1;
  let fitting = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const emit = () => options.onChange?.({ ...settings, playing, duration: clip.duration });
  const render = () => { if (!disposed && !document.hidden && visible) renderer.render(scene, camera); };
  function pose(progress) {
    settings.progress = THREE.MathUtils.clamp(progress, 0, 1);
    action.time = settings.progress * clip.duration;
    mixer.update(0);
    model.updateMatrixWorld(true);
    render();
    emit();
  }
  function fit() {
    const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    const distance = sphere.radius / Math.sin(Math.min(vertical, horizontal)) * settings.distance * 1.06;
    const azimuth = THREE.MathUtils.degToRad(settings.azimuth);
    const elevation = THREE.MathUtils.degToRad(settings.elevation);
    controls.target.set(
      center.x + settings.targetX * sphere.radius,
      center.y + settings.targetY * sphere.radius,
      center.z + settings.targetZ * sphere.radius
    );
    camera.position.set(
      controls.target.x + distance * Math.sin(azimuth) * Math.cos(elevation),
      controls.target.y + distance * Math.sin(elevation),
      controls.target.z + distance * Math.cos(azimuth) * Math.cos(elevation)
    );
    fitting = true;
    controls.update();
    fitting = false;
  }
  function resize() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fit();
    render();
  }
  function pause() {
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
    emit();
  }
  function tick(now) {
    if (!playing || disposed) return;
    const delta = Math.min((now - previous) / 1000, 0.1);
    previous = now;
    pose(settings.progress + direction * delta * settings.speed / clip.duration);
    if ((direction > 0 && settings.progress >= 1) || (direction < 0 && settings.progress <= 0)) pause();
    else frame = requestAnimationFrame(tick);
  }
  function play(nextDirection = 1, { restart = false, userInitiated = false } = {}) {
    if (disposed || document.hidden || !visible) return;
    direction = nextDirection < 0 ? -1 : 1;

    if (reduced.matches && !userInitiated) { pause(); pose(direction > 0 ? 1 : 0); return; }
    pause();
    if (restart) pose(direction > 0 ? 0 : 1);
    if ((direction > 0 && settings.progress === 1) || (direction < 0 && settings.progress === 0)) return;
    playing = true; previous = performance.now(); emit();
    frame = requestAnimationFrame(tick);
  }
  function configure(values) {
    for (const [name, field] of controlsByKey) {
      if (field.length === 2) {
        if (typeof values[name] === 'string' && /^#[\da-f]{6}$/i.test(values[name])) settings[name] = values[name];
      } else if (Number.isFinite(values[name])) {
        settings[name] = THREE.MathUtils.clamp(values[name], field[2], field[3]);
      }
    }
    if ([...AEGIS_V_CONTROL_GROUPS.slice(0, 3).flatMap(group => group.fields), ...AEGIS_V_LOW_KEY_FIELDS].some(([name]) => name in values)) updateLighting();
    if (['azimuth', 'elevation', 'distance', 'targetX', 'targetY', 'targetZ'].some(name => Number.isFinite(values[name]))) fit();
    if (Number.isFinite(values.progress)) { if (playing) pause(); pose(values.progress); }
    else { render(); emit(); }
  }
  const onOrbit = () => {
    if (fitting) return;

    const offset = camera.position.clone().sub(controls.target);
    const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    settings.azimuth = THREE.MathUtils.radToDeg(Math.atan2(offset.x, offset.z));
    settings.elevation = THREE.MathUtils.radToDeg(Math.asin(offset.y / offset.length()));
    settings.distance = offset.length() / (sphere.radius / Math.sin(Math.min(vertical, horizontal)) * 1.06);
    render(); emit();
  };
  controls.addEventListener('change', onOrbit);
  const onHidden = () => { if (document.hidden) pause(); else render(); };
  const onReduced = () => { if (reduced.matches) pause(); };
  document.addEventListener('visibilitychange', onHidden);
  reduced.addEventListener('change', onReduced);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) pause(); else render();
  });
  intersectionObserver.observe(host);
  const onLost = event => { event.preventDefault(); pause(); options.onError?.('3D 화면 연결이 끊겼습니다. 새로고침해 주세요.'); };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  resize(); pose(settings.progress);
  return {
    play, pause, open: opts => play(1, opts), close: opts => play(-1, opts),
    setProgress: progress => { pause(); pose(progress); }, configure,
    getState: () => ({ ...settings, playing, duration: clip.duration }),
    dispose() {
      pause(); disposed = true;
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onHidden);
      reduced.removeEventListener('change', onReduced);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      controls.dispose(); mixer.stopAllAction(); mixer.uncacheRoot(model);
      lowKey?.dispose();
      const materials = new Set();
      model.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) for (const material of [].concat(object.material)) materials.add(material);
      });
      materials.forEach(material => material.dispose());
      environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    }
  };
}
