import * as THREE from 'three';
import { createSystemXray } from './aegis-v-system-xray.js?v=20261013-tuned1';
import { ANTENNA_CONCEPT, createAntennaBodyGeometry } from './aegis-v-antenna-concept.js?v=20261013-tuned1';
import { COOLING_EFFECT_DEFAULTS, COOLING_EFFECT_FIELDS } from './aegis-v-cooling-effect.js?v=20261013-tuned1';
import { SYSTEM_MOTION_DEFAULTS, SYSTEM_MOTION_FIELDS, createInstallationEffect } from './aegis-v-system-motion.js?v=20261013-tuned1';

export const AEGIS_V_LOW_KEY_DEFAULTS = Object.freeze({
  ...COOLING_EFFECT_DEFAULTS,
  ...SYSTEM_MOTION_DEFAULTS,
  vehicleRim: 5, vehicleFill: 0.0001, shadowLift: 0, rimWidth: 6,
  beamSpread: 0.5, beamPosition: -0.35,
  coverVisibility: 0.65, radarHighlight: 1.2, radarOpacity: 0.7,
  radarColor: '#c3d9e2',
  batteryHighlight: 1, batteryOpacity: 0.16, batteryColor: '#f0c84f', powerLineOpacity: 0,
  coolingHighlight: 1, coolingOpacity: 0.12, coolingColor: '#72cedb'
});
export const AEGIS_V_LOW_KEY_FIELDS = [
  ['exposure', '전체 밝기', 0.2, 3, 0.05],
  ['vehicleRim', '차량 림라이트', 0, 10, 0.05],
  ['vehicleFill', '차량 면 밝기', 0, 0.004, 0.0001],
  ['shadowLift', '어두운 윤곽 밝기', 0, 0.025, 0.001],
  ['rimWidth', '림 집중도 · 높을수록 얇게', 1, 10, 0.25],
  ['beamSpread', '빛이 닿는 범위', 0.2, 3, 0.05],
  ['beamPosition', '빛 위치 · 뒤 ↔ 앞', -2.5, 2.5, 0.05],
  ['rimAzimuth', '림 방향 · 시점 기준', -180, 180, 1],
  ['rimElevation', '림 높이', 5, 85, 1],
  ['coverVisibility', '뚜껑 윤곽', 0, 1.5, 0.05],
  ['radarHighlight', '레이더 하이라이트', 0, 3, 0.05],
  ['radarOpacity', '레이더 투시 농도', 0, 0.85, 0.05],
  ['radarColor', '레이더 빛 색상'],
  ['batteryHighlight', '배터리 하이라이트', 0, 3, 0.05],
  ['batteryOpacity', '배터리 투시 농도', 0, 1, 0.01],
  ['batteryColor', '배터리 · 전원선 색상'],
  ['powerLineOpacity', '배터리 → 레이더 연결선', 0, 1, 0.01],
  ['coolingHighlight', '냉각 하이라이트', 0, 3, 0.05],
  ['coolingOpacity', '냉각 투시 농도', 0, 1, 0.01],
  ['coolingColor', '냉각 빛 색상'],
  ...COOLING_EFFECT_FIELDS,
  ...SYSTEM_MOTION_FIELDS
];

const vertexShader = `
  varying vec3 vNormalView;
  varying vec3 vView;
  varying vec3 vWorld;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const bodyFragment = `
  uniform vec3 rimDirection;
  uniform float strength, fill, shadowLift, concentration, cover, beamSpread, beamPosition;
  varying vec3 vNormalView, vView, vWorld;
  void main() {
    vec3 n = normalize(vNormalView);
    float edge = pow(1.0 - max(0.0, dot(n, normalize(vView))), concentration);
    float light = pow(max(0.0, dot(n, rimDirection)), 3.0);
    vec3 halfDirection = normalize(normalize(vView) + rimDirection);
    float strip = pow(max(0.0, dot(n, halfDirection)), concentration * 18.0);
    float beam = exp(-pow((vWorld.z - beamPosition) / beamSpread, 2.0));
    // Suppress the nose and lower trim, the strongest vehicle identity cues.
    float front = mix(1.0, 0.12, smoothstep(1.25, 2.25, vWorld.z));
    float lower = mix(0.2, 1.0, smoothstep(0.2, 1.25, vWorld.y));
    float value = cover * (fill * (0.15 + light) + strength * (edge * (0.22 + 0.78 * light) + 0.8 * strip) * beam * front * lower);
    // Lift only dark body/cover surfaces. Existing bright rims receive no lift.
    // A broad, view-facing contour keeps the black paint from becoming flat grey.
    float shadowMask = 1.0 - smoothstep(0.004, 0.045, value);
    float silhouette = pow(1.0 - max(0.0, dot(n, normalize(vView))), 2.0);
    float shadowLower = mix(0.45, 1.0, smoothstep(0.2, 1.25, vWorld.y));
    value += cover * shadowLift * shadowMask * (0.12 + 0.88 * silhouette) * front * shadowLower;
    gl_FragColor = vec4(vec3(0.73, 0.83, 0.91) * value, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
const radarFragment = `
  uniform vec3 tint, rimDirection;
  uniform float highlight, density, installationVisibility;
  varying vec3 vNormalView, vView, vWorld;
  void main() {
    vec3 n = normalize(vNormalView);
    float edge = pow(1.0 - max(0.0, dot(n, normalize(vView))), 5.0);
    float light = pow(max(0.0, dot(n, rimDirection)), 2.0);
    float strip = pow(max(0.0, dot(n, normalize(normalize(vView) + rimDirection))), 65.0);
    // A soft, untextured volume. No wireframe, fasteners, fins or internals.
    // Flat primitive faces need a broad light term to keep the block readable.
    float face = 0.08 + 0.16 * max(0.0, dot(n, rimDirection));
    float value = highlight * (face + 1.4 * edge * (0.12 + 0.88 * light) + 1.2 * strip);
    gl_FragColor = vec4(tint * value, installationVisibility * density * (0.45 + 0.55 * max(edge, strip)));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createLowKeyTreatment(model, { antennaShape = 'dome' } = {}) {
  const original = [];
  const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const direction = new THREE.Vector3();
  function bodyMaterial(cover) {
    return new THREE.ShaderMaterial({
      vertexShader, fragmentShader: bodyFragment,
      uniforms: { rimDirection: { value: direction }, strength: { value: 0 }, fill: { value: 0 }, shadowLift: { value: 0 }, concentration: { value: 6 }, cover: { value: cover }, beamSpread: { value: 0.95 }, beamPosition: { value: -0.35 } }
    });
  }
  const body = bodyMaterial(1), shell = bodyMaterial(0.65);
  const rootNodes = new Map();
  model.traverse(object => { if (object.userData.name) rootNodes.set(object.userData.name, object); });
  const radarSource = rootNodes.get('QBA2026001_render.005');
  if (!radarSource) throw new Error('레이더 영역의 기준 형상을 찾을 수 없습니다.');
  const radarCenter = new THREE.Box3().setFromObject(radarSource).getCenter(new THREE.Vector3());
  const deck = rootNodes.get('QBA2026001_render.007');
  if (!deck) throw new Error('안테나 설치면을 찾을 수 없습니다.');
  const deckTop = new THREE.Box3().setFromObject(deck).max.y;
  const inverse = new THREE.Matrix4().copy(model.matrixWorld).invert();
  const mount = new THREE.Vector3(radarCenter.x, deckTop, radarCenter.z).applyMatrix4(inverse);
  const envelope = new THREE.Group();
  envelope.name = 'Antenna_Concept';
  envelope.position.copy(mount);

  const { radius, plateHeight, bodyHeight } = ANTENNA_CONCEPT;
  const plateGeometry = new THREE.CylinderGeometry(radius, radius, plateHeight, 48);
  let bodyGeometry = createAntennaBodyGeometry(antennaShape);
  const radar = new THREE.ShaderMaterial({
    vertexShader, fragmentShader: radarFragment, transparent: true,
    depthTest: false, depthWrite: false,
    uniforms: { tint: { value: new THREE.Color() }, rimDirection: { value: direction }, highlight: { value: 0.55 }, density: { value: 0.45 }, installationVisibility: { value: 1 } }
  });
  const plate = new THREE.Mesh(plateGeometry, radar);
  plate.name = 'Antenna_Concept_Disc';
  plate.position.y = plateHeight / 2;
  plate.renderOrder = 10;
  const antennaBody = new THREE.Mesh(bodyGeometry, radar);
  antennaBody.name = 'Antenna_Concept_Body';
  antennaBody.position.y = plateHeight;
  antennaBody.renderOrder = 11;
  envelope.add(plate, antennaBody);
  const conceptBounds = new THREE.Box3().setFromCenterAndSize(
    mount.clone().add(new THREE.Vector3(0, (plateHeight + bodyHeight) / 2, 0)),
    new THREE.Vector3(radius * 2, plateHeight + bodyHeight, radius * 2)
  ).applyMatrix4(model.matrixWorld);
  const systems = createSystemXray(model, rootNodes, conceptBounds);
  const installation = createInstallationEffect([
    {object: envelope, order: 0, opacity: radar.uniforms.installationVisibility}, ...systems.installationTargets
  ]);

  model.traverse(object => {
    if (!object.isMesh) return;
    let node = object;
    while (node !== model && !node.userData.name) node = node.parent;
    const name = node.userData.name || object.name;
    original.push({ object, material: object.material, visible: object.visible });
    if (name.startsWith('QBA') && !['QBA2026001_render.006', 'QBA2026001_render.007'].includes(name)) {
      object.visible = false;
    } else if (/^(Cube|Plane|salon|int_parts|interior|axis|bolt|support|cam|kia_logo|LicPlate)/.test(name)) {
      object.visible = false;
    } else if (name === 'QBA2026001_render.006' || name === 'QBA2026001_render.007') {
      object.material = shell;
    } else if (/^(door|hood$|fender_b|r_side_wing|roof$|trunk|window_[fs]$|tire|f_bumper07|r_bumper07|top_r_spoiler)/.test(name)) {
      object.material = body;
    } else {

      object.material = black;
    }
  });
  model.add(envelope, systems.group);
  return {
    updateEffects(delta, reduced) { systems.updateEffects(delta, reduced); installation.update(delta, reduced); },
    hasAnimatedEffects: () => systems.hasAnimatedEffects() || installation.isAnimating(),
    restartCooling: () => systems.restartCooling(),
    restartEffect(kind) {
      if (kind === 'installation') installation.restart();
      else if (kind === 'power') systems.restartPower();
      else if (kind === 'cooling') systems.restartCooling();
    },
    setAntennaShape(shape) {
      const next = createAntennaBodyGeometry(shape);
      antennaBody.geometry = next;
      bodyGeometry.dispose();
      bodyGeometry = next;
    },
    configure(settings) {
      const a = THREE.MathUtils.degToRad(settings.rimAzimuth), e = THREE.MathUtils.degToRad(settings.rimElevation);
      direction.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e));
      for (const material of [body, shell]) {
        material.uniforms.strength.value = settings.vehicleRim;
        material.uniforms.fill.value = settings.vehicleFill;
        material.uniforms.shadowLift.value = settings.shadowLift ?? 0;
        material.uniforms.concentration.value = settings.rimWidth;
        material.uniforms.beamSpread.value = settings.beamSpread;
        material.uniforms.beamPosition.value = settings.beamPosition;
      }
      shell.uniforms.cover.value = settings.coverVisibility;
      radar.uniforms.tint.value.set(settings.radarColor);
      radar.uniforms.highlight.value = settings.radarHighlight;
      radar.uniforms.density.value = settings.radarOpacity;
      systems.configure(settings);
      installation.configure(settings);
    },
    dispose() {
      original.forEach(({object, material, visible}) => { object.material = material; object.visible = visible; });
      model.remove(envelope);
      installation.dispose();
      systems.dispose();
      plateGeometry.dispose(); bodyGeometry.dispose();
      [black, body, shell, radar].forEach(material => material.dispose());
    }
  };
}
