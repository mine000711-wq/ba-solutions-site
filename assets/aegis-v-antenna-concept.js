import * as THREE from 'three';

export const ANTENNA_CONCEPT = Object.freeze({ radius: 0.5, plateHeight: 0.025, bodyHeight: 0.3 });
export const ANTENNA_OPTIONS = [
  { id: 'dome', label: 'A · 낮은 돔', description: '매끈한 곡면 · 추천' },
  { id: 'taper', label: 'B · 원뿔대', description: '위로 좁아지는 경사면' },
  { id: 'octagon', label: 'C · 팔각 기둥', description: '단순한 면 분할' }
];

export function createAntennaBodyGeometry(shape = 'dome') {
  let geometry;
  if (shape === 'dome') {
    geometry = new THREE.SphereGeometry(0.35, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    geometry.scale(1, ANTENNA_CONCEPT.bodyHeight / 0.35, 1);
  } else if (shape === 'taper') {
    geometry = new THREE.CylinderGeometry(0.22, 0.35, ANTENNA_CONCEPT.bodyHeight, 48);
    geometry.translate(0, ANTENNA_CONCEPT.bodyHeight / 2, 0);
  } else if (shape === 'octagon') {
    geometry = new THREE.CylinderGeometry(0.31, 0.31, ANTENNA_CONCEPT.bodyHeight, 8);
    geometry.rotateY(Math.PI / 8);
    geometry.translate(0, ANTENNA_CONCEPT.bodyHeight / 2, 0);
  } else {
    geometry = new THREE.BoxGeometry(0.5, ANTENNA_CONCEPT.bodyHeight, 0.45);
    geometry.translate(0, ANTENNA_CONCEPT.bodyHeight / 2, 0);
  }
  return geometry;
}
