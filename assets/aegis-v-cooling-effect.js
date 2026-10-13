import * as THREE from 'three';

export const COOLING_EFFECT_DEFAULTS = Object.freeze({
  coolingEffect: 0, coolingCycleSeconds: 6, coolingRise: 0.45,
  coolingFlowOpacity: 0.7, coolingPhase: -1
});
export const COOLING_EFFECT_FIELDS = [
  ['coolingEffect', '열 식힘 효과 세기', 0, 1, 0.01],
  ['coolingCycleSeconds', '냉각 반복 시간 (초)', 2, 15, 0.1],
  ['coolingRise', '열기 상승 높이', 0.1, 1, 0.01],
  ['coolingFlowOpacity', '냉각 순환 흐름 밝기', 0, 1, 0.01],
  ['coolingPhase', '냉각 시점 · 음수 자동 / 0~1 고정', -1, 1, 0.01]
];

const vertex = `
  varying vec2 vUv;
  varying float vHeight;
  uniform float phase, rise, height, kind;
  void main() {
    vUv = uv;
    vHeight = position.y / height + 0.5;
    vec3 p = position;
    if (kind > 0.5 && kind < 1.5) {
      p.x += sin((uv.y * 2.0 - phase * 3.0) * 6.283185) * height * 0.07 * uv.y;
      p.y *= rise;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fragment = `
  varying vec2 vUv;
  varying float vHeight;
  uniform vec3 cold;
  uniform float phase, strength, flowOpacity, kind;
  void main() {
    vec3 hot = vec3(1.0, 0.28, 0.055);
    float envelope = smoothstep(0.0, 0.06, phase) * (1.0 - smoothstep(0.94, 1.0, phase));
    vec3 color;
    float alpha;
    if (kind < 0.5) {
      float warm = smoothstep(phase * 1.6 - 0.15, phase * 1.6 + 0.08, vHeight);
      float sweep = exp(-pow((vHeight - phase * 1.6) / 0.10, 2.0));
      color = mix(cold, hot, warm) + cold * sweep;
      alpha = strength * envelope * (0.24 + 0.3 * sweep);
    } else if (kind < 1.5) {
      float center = exp(-pow((vUv.x - 0.5) * 5.0, 2.0));
      float pulse = 0.35 + 0.65 * pow(0.5 + 0.5 * sin((vUv.y - phase * 3.0) * 12.56637), 2.0);
      color = hot;
      alpha = strength * envelope * (1.0 - smoothstep(0.12, 0.8, phase))
        * center * sin(vUv.y * 3.141593) * pulse * 0.65;
    } else {
      float dash = pow(0.5 + 0.5 * cos((vUv.x * 4.0 - phase * 3.0) * 6.283185), 7.0);
      color = cold * 1.5;
      alpha = strength * flowOpacity * envelope * dash;
    }
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

export function createCoolingEffect(center, size) {
  const group = new THREE.Group();
  group.name = 'Cooling_Heat_Removal_Concept';
  group.position.copy(center);
  const geometries = [], materials = [];
  let settings = {...COOLING_EFFECT_DEFAULTS}, elapsed = 0;
  const phase = {value: 0}, strength = {value: 0}, rise = {value: settings.coolingRise};
  const cold = {value: new THREE.Color('#72cedb')}, flowOpacity = {value: settings.coolingFlowOpacity};
  function add(geometry, kind) {
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex, fragmentShader: fragment, transparent: true,
      depthTest: false, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
      blending: kind === 0 ? THREE.NormalBlending : THREE.AdditiveBlending,
      uniforms: {phase, strength, rise, cold, flowOpacity, height: {value: size.y}, kind: {value: kind}}
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 13 + kind;
    group.add(mesh); geometries.push(geometry); materials.push(material);
    return mesh;
  }
  add(new THREE.BoxGeometry(size.x * 1.015, size.y * 1.015, size.z * 1.015), 0);

  for (let i = 0; i < 3; i++) {
    for (const angle of [0, Math.PI / 2]) {
      const geometry = new THREE.PlaneGeometry(size.x * 0.12, 1, 1, 24);
      geometry.translate(0, 0.5, 0);
      const wisp = add(geometry, 1);
      wisp.position.set((i - 1) * size.x * 0.28, size.y / 2, 0);
      wisp.rotation.y = angle;
    }
  }
  for (const level of [-0.3, 0.25]) {
    const x = size.x * 0.55, z = size.z * 0.58, y = size.y * level;
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-x, y, -z), new THREE.Vector3(0, y, -z),
      new THREE.Vector3(x, y, -z), new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x, y, z), new THREE.Vector3(0, y, z),
      new THREE.Vector3(-x, y, z), new THREE.Vector3(-x, y, 0)
    ], true, 'centripetal');
    add(new THREE.TubeGeometry(path, 96, size.y * 0.009, 4, true), 2);
  }
  return {
    group,
    configure(values) {
      const wasActive = strength.value > 0;
      settings = {...COOLING_EFFECT_DEFAULTS, ...values};
      strength.value = settings.coolingEffect * (settings.coolingOpacity ?? 1);
      if (!wasActive && strength.value > 0) elapsed = 0;
      rise.value = settings.coolingRise; flowOpacity.value = settings.coolingFlowOpacity;
      cold.value.set(settings.coolingColor ?? '#72cedb');
      group.visible = strength.value > 0;
    },
    update(delta, reduced = false) {
      if (group.visible && settings.coolingPhase < 0 && !reduced) elapsed += delta;
      phase.value = reduced ? 0.85 : settings.coolingPhase >= 0 ? settings.coolingPhase
        : (elapsed / Math.max(0.1, settings.coolingCycleSeconds)) % 1;
    },
    isAnimating: () => group.visible && settings.coolingPhase < 0,
    restart() { elapsed = 0; },
    dispose() {
      group.removeFromParent();
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    }
  };
}
