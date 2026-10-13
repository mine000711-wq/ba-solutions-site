import * as THREE from 'three';

export const SYSTEM_MOTION_DEFAULTS = Object.freeze({
  powerFlow: 0, powerCycleSeconds: 2.5, powerPulseSpacing: 0.65,
  powerPulseLength: 0.22, powerLineRadius: 0.012, powerPhase: -1,
  installationEffect: 0, installationHeight: 1.5, installationSeconds: 1.5,
  installationDelay: 0.25, installationFadeSeconds: 0.4,
  installationStagger: 0, installationPhase: -1
});
export const SYSTEM_MOTION_FIELDS = [
  ['powerFlow', '전력 흐름 세기', 0, 1, 0.01],
  ['powerCycleSeconds', '전력 이동 시간 (초)', 0.5, 8, 0.1],
  ['powerPulseSpacing', '전력 펄스 간격', 0.2, 2, 0.01],
  ['powerPulseLength', '전력 꼬리 길이', 0.05, 0.6, 0.01],
  ['powerLineRadius', '전력 흐름 굵기', 0.003, 0.03, 0.001],
  ['powerPhase', '전력 시점 · 음수 자동 / 0~1 고정', -1, 1, 0.01],
  ['installationEffect', '설치 하강 모션 켜기', 0, 1, 1],
  ['installationHeight', '설치 시작 높이', 0.2, 2.5, 0.05],
  ['installationSeconds', '장치 하강 시간 (초)', 0.3, 4, 0.05],
  ['installationDelay', '설치 시작 지연 (초)', 0, 2, 0.05],
  ['installationFadeSeconds', '설치 등장 페이드인 (초)', 0, 2, 0.05],
  ['installationStagger', '장치 간 시작 간격 (초)', 0, 1, 0.05],
  ['installationPhase', '설치 시점 · 음수 자동 / 0~1 고정', -1, 1, 0.01]
];

export function createPowerFlowEffect(routes) {
  const group = new THREE.Group();
  group.name = 'Power_Flow_Concept';
  const geometries = [], materials = [];
  const totalLength = Math.max(...routes.map(({path, offset}) => path.getLength() + offset));
  const travel = {value: 0}, strength = {value: 0}, tint = {value: new THREE.Color()};
  const spacing = {value: SYSTEM_MOTION_DEFAULTS.powerPulseSpacing};
  const tail = {value: SYSTEM_MOTION_DEFAULTS.powerPulseLength};
  const radius = {value: SYSTEM_MOTION_DEFAULTS.powerLineRadius};
  let settings = {...SYSTEM_MOTION_DEFAULTS}, elapsed = 0;
  for (const {path, offset} of routes) {
    const geometry = new THREE.TubeGeometry(path, Math.max(64, Math.ceil(path.getLength() * 100)), SYSTEM_MOTION_DEFAULTS.powerLineRadius, 6, false);
    const material = new THREE.ShaderMaterial({
      transparent: true, depthTest: false, depthWrite: false,
      toneMapped: false, blending: THREE.AdditiveBlending,
      uniforms: {travel, strength, tint, spacing, tail, radius,
        pathLength: {value: path.getLength()}, offset: {value: offset}},
      vertexShader: `
        uniform float radius, pathLength, offset;
        varying float vDistance;
        void main() {
          vDistance = uv.x * pathLength + offset;
          vec3 p = position + normal * (radius - ${SYSTEM_MOTION_DEFAULTS.powerLineRadius.toFixed(3)});
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float travel, strength, spacing, tail;
        uniform vec3 tint;
        varying float vDistance;
        void main() {
          // The front advances from the battery, leaving a soft trailing glow.
          float behind = mod(travel - vDistance, spacing);
          float pulseLength = min(tail, spacing * 0.85);
          float pulse = (1.0 - smoothstep(0.0, pulseLength, behind));
          pulse *= smoothstep(0.0, min(0.025, pulseLength * 0.2), behind);
          gl_FragColor = vec4(tint * (1.7 + pulse), strength * pulse);
          #include <colorspace_fragment>
        }
      `
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 16;
    group.add(mesh); geometries.push(geometry); materials.push(material);
  }
  return {
    group,
    configure(values) {
      const wasActive = group.visible && strength.value > 0;
      settings = {...SYSTEM_MOTION_DEFAULTS, ...values};
      strength.value = settings.powerFlow * (settings.powerLineOpacity ?? 1);
      group.visible = strength.value > 0;
      if (!wasActive && group.visible) elapsed = 0;
      tint.value.set(settings.batteryColor ?? '#f0c84f');
      spacing.value = settings.powerPulseSpacing; tail.value = settings.powerPulseLength;
      radius.value = settings.powerLineRadius;
    },
    update(delta, reduced = false) {
      if (group.visible && settings.powerPhase < 0 && !reduced) elapsed += delta;
      const phase = reduced ? 0.65 : settings.powerPhase >= 0 ? settings.powerPhase
        : elapsed / Math.max(0.1, settings.powerCycleSeconds);

      travel.value = (phase * totalLength) % Math.max(0.01, settings.powerPulseSpacing);
    },
    isAnimating: () => group.visible && settings.powerPhase < 0,
    restart() { elapsed = 0; },
    dispose() {
      group.removeFromParent();
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    }
  };
}

export function createInstallationEffect(entries) {
  const targets = entries.map(({object, order, opacity}) => ({object, order, opacity, y: object.position.y}));
  const lastOrder = Math.max(...targets.map(target => target.order));
  let settings = {...SYSTEM_MOTION_DEFAULTS}, elapsed = 0;
  const duration = () => settings.installationDelay + lastOrder * settings.installationStagger
    + settings.installationFadeSeconds + settings.installationSeconds;
  function restore() {
    targets.forEach(({object, y, opacity}) => {
      object.position.y = y;
      if (opacity) opacity.value = 1;
    });
  }
  return {
    configure(values) {
      const wasActive = settings.installationEffect > 0;
      settings = {...SYSTEM_MOTION_DEFAULTS, ...values};
      if (!wasActive && settings.installationEffect > 0) elapsed = 0;
      if (!settings.installationEffect) restore();
    },
    update(delta, reduced = false) {
      if (!settings.installationEffect || reduced) { restore(); return; }
      if (settings.installationPhase < 0) elapsed = Math.min(duration(), elapsed + delta);
      const time = settings.installationPhase >= 0 ? settings.installationPhase * duration() : elapsed;
      for (const {object, order, opacity, y} of targets) {
        const sinceStart = time - settings.installationDelay - order * settings.installationStagger;
        if (opacity) {
          const fade = settings.installationFadeSeconds > 0
            ? THREE.MathUtils.clamp(sinceStart / settings.installationFadeSeconds, 0, 1)
            : Number(sinceStart >= 0);
          opacity.value = fade * fade * (3 - 2 * fade);
        }

        const t = THREE.MathUtils.clamp((sinceStart - settings.installationFadeSeconds)
          / Math.max(0.01, settings.installationSeconds), 0, 1);
        object.position.y = y + settings.installationHeight * (1 - t);
      }
    },
    isAnimating: () => settings.installationEffect > 0 && settings.installationPhase < 0 && elapsed < duration(),
    restart() { elapsed = 0; },
    dispose: restore
  };
}
