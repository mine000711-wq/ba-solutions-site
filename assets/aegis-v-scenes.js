import { AEGIS_V_LOW_KEY_DEFAULTS } from './aegis-v-low-key.js?v=20261013-tuned1';
import { Color } from 'three';

const FIXED_LIGHTING = Object.freeze({
  ...AEGIS_V_LOW_KEY_DEFAULTS,
  vehicleRim: 6.25, vehicleFill: 0.0007, shadowLift: 0.008, rimWidth: 5.25,
  beamSpread: 0.5, beamPosition: -1.15, coverVisibility: 1,
  radarHighlight: 1.3, radarOpacity: 0.7, radarColor: '#c3d9e2',
  exposure: 1.35, environment: 0, keyIntensity: 0, fillIntensity: 0,
  rimIntensity: 0, topIntensity: 0, rimAzimuth: 90, rimElevation: 25
});
export const AEGIS_V_STORY = {
  motion: { cameraSeconds: 1.6, roofSeconds: 2.5, roofDelay: 0.15, scrollScreens: 1 },
  shots: [
    { id: 'installation', label: '설치', caption: '안테나 · 파워 · 냉각 장치 장착', azimuth: -28, elevation: 10, distance: 0.82, targetX: 0, targetY: 0.1, targetZ: 0.12, progress: 0, lighting: { ...FIXED_LIGHTING, rimAzimuth: -60, rimElevation: 22, vehicleRim: 6.5, vehicleFill: 0.003, shadowLift: 0.012, rimWidth: 8, beamSpread: 1.75, beamPosition: 0.55, exposure: 0.75, batteryOpacity: 0.65, coolingOpacity: 0.65, installationEffect: 1 } },
    { id: 'power', label: '파워', caption: '양측 배터리 → 안테나 전력 흐름', azimuth: 52, elevation: 18, distance: 0.7, targetX: 0, targetY: -0.04, targetZ: 0, progress: 0, lighting: { ...FIXED_LIGHTING, rimAzimuth: 90, rimElevation: 52, rimWidth: 8, beamSpread: 1.9, exposure: 0.8, batteryOpacity: 0.8, coolingOpacity: 0.08, powerLineOpacity: 0.55, powerFlow: 1 } },
    { id: 'cooling', label: '냉각', caption: '열 제거 · 냉각 순환 개념', azimuth: 132, elevation: 44, distance: 0.68, targetX: -0.09, targetY: -0.06, targetZ: -0.4, progress: 0, lighting: { ...FIXED_LIGHTING, rimAzimuth: 116, rimElevation: 32, rimWidth: 6, beamSpread: 1.05, beamPosition: -1.25, batteryOpacity: 0.12, coolingOpacity: 0.85, coolingEffect: 1 } }
  ]
};

const sceneKeys = ['azimuth', 'elevation', 'distance', 'targetX', 'targetY', 'targetZ', 'progress', ...Object.keys(FIXED_LIGHTING)];
const lightColor = new Color(), targetLightColor = new Color();
const clamp01 = value => Math.max(0, Math.min(1, value));
const normalizedAngle = value => ((value + 180) % 360 + 360) % 360 - 180;

export function sceneOf(source) {
  const values = source.lighting ? { ...source, ...source.lighting } : source;
  return Object.fromEntries(sceneKeys.map(key => [key, values[key]]));
}

export function createTransition(from, to, motion) {
  const roofDuration = Math.abs(to.progress - from.progress) * motion.roofSeconds;
  return {
    from: sceneOf(from), to: sceneOf(to), roofDuration,
    duration: Math.max(motion.cameraSeconds, roofDuration ? motion.roofDelay + roofDuration : 0)
  };
}

export function sampleTransition(transition, elapsed, motion) {
  const t = clamp01(elapsed / motion.cameraSeconds);
  const cameraT = t * t * (3 - 2 * t);
  const roofT = transition.roofDuration ? clamp01((elapsed - motion.roofDelay) / transition.roofDuration) : 1;
  const pose = {};
  for (const key of sceneKeys) {
    const start = transition.from[key], end = transition.to[key];

    if (['installationEffect', 'powerFlow', 'coolingEffect'].includes(key) || key.endsWith('Phase')) pose[key] = end;
    else if (key === 'progress') pose[key] = start + (end - start) * roofT;
    else if (key === 'azimuth' || key === 'rimAzimuth') pose[key] = normalizedAngle(start + normalizedAngle(end - start) * cameraT);
    else if (key.endsWith('Color')) pose[key] = `#${lightColor.set(start).lerp(targetLightColor.set(end), cameraT).getHexString()}`;
    else pose[key] = start + (end - start) * cameraT;
  }
  return pose;
}

export function shotAtScroll(scrollY, sectionStart, step, count) {
  return Math.max(0, Math.min(count - 1, Math.round((scrollY - sectionStart) / Math.max(1, step))));
}
