import * as THREE from 'three';

const COMPONENTS = Object.freeze({
  batteries: ['Cube.010', 'Cube.011'],
  cooling: {
    source: 'QBA2026001_render.002',
    housing: { center: [0.057739, 0.454512, -2.153679], size: [0.533027, 0.126183, 0.438969] },
    upright: { center: [0.825866, 0.784202, -1.966978], size: [0.141600, 0.535000, 0.225000] },
    fan: { center: [0.057739, 0.355102, -2.152126], size: [0.356291, 0.068094, 0.356916] }
  },
  connectionRise: 0.12, connectionBend: 0.04
});

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal, vView;
  varying float vCap;
  void main() {
    vUv = uv;
    vCap = abs(normal.y);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fanFragmentShader = `
  uniform vec3 tint;
  uniform float density, highlight;
  varying vec2 vUv;
  varying vec3 vNormal, vView;
  varying float vCap;
  void main() {
    float radius = length(vUv - 0.5);
    float capDistance = (0.5 - radius) / max(fwidth(radius), 0.0001);
    float sideDistance = min(vUv.y, 1.0 - vUv.y) / max(fwidth(vUv.y), 0.0001);
    float edge = 1.0 - smoothstep(0.45, 1.5, mix(sideDistance, capDistance, vCap));
    float facing = max(0.0, dot(normalize(vNormal), normalize(vView)));
    float face = 0.2 + 0.13 * facing;
    gl_FragColor = vec4(tint * highlight * (face + 0.65 * edge), density * (0.2 + 0.7 * edge));
    #include <colorspace_fragment>
  }
`;
const fragmentShader = `
  uniform vec3 tint;
  uniform float density, highlight;
  varying vec2 vUv;
  varying vec3 vNormal, vView;
  void main() {
    vec2 edgeDistance = min(vUv, 1.0 - vUv) / max(fwidth(vUv), vec2(0.0001));
    float edge = 1.0 - smoothstep(0.45, 1.5, min(edgeDistance.x, edgeDistance.y));
    float facing = max(0.0, dot(normalize(vNormal), normalize(vView)));
    float face = 0.2 + 0.13 * facing;
    gl_FragColor = vec4(tint * highlight * (face + 0.65 * edge), density * (0.2 + 0.7 * edge));
    #include <colorspace_fragment>
  }
`;

export function createSystemXray(model, nodes, radarBounds) {
  const group = new THREE.Group();
  group.name = 'System_Simple_Xray';
  const geometries = [], materials = [];
  const inverse = new THREE.Matrix4().copy(model.matrixWorld).invert();
  const localBounds = source => new THREE.Box3().setFromObject(source).applyMatrix4(inverse);
  function source(name) {
    const node = nodes.get(name);
    if (!node) throw new Error(`투시 기준 부품을 찾을 수 없습니다: ${name}`);
    return node;
  }
  function material(fragment = fragmentShader) {
    const value = new THREE.ShaderMaterial({
      vertexShader, fragmentShader: fragment, transparent: true, toneMapped: false,
      depthTest: false, depthWrite: false,
      uniforms: { tint: { value: new THREE.Color() }, density: { value: 0 }, highlight: { value: 1 } }
    });
    materials.push(value);
    return value;
  }
  const batteryMaterial = material(), coolingMaterial = material();
  function enclosure(bounds, mat, name) {
    const size = bounds.getSize(new THREE.Vector3());
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.copy(bounds.getCenter(new THREE.Vector3()));
    mesh.name = name; mesh.renderOrder = 12;
    group.add(mesh);
    return mesh;
  }
  const batteryBounds = COMPONENTS.batteries.map(name => localBounds(source(name)));
  const batteries = batteryBounds.map((bounds, i) => enclosure(bounds, batteryMaterial, `Battery_${i + 1}_Envelope`));
  source(COMPONENTS.cooling.source);
  const cooling = new THREE.Group();
  cooling.name = 'Fan_Cooling_Assembly_Envelope';
  group.add(cooling);
  for (const part of ['housing', 'upright']) {
    const bounds = COMPONENTS.cooling[part];
    const box = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(...bounds.center), new THREE.Vector3(...bounds.size)
    );
    cooling.add(enclosure(box, coolingMaterial, `Cooling_${part}_Envelope`));
  }
  const fanMaterial = material(fanFragmentShader);
  const fanBounds = COMPONENTS.cooling.fan;
  const fanGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 48);
  geometries.push(fanGeometry);
  const fan = new THREE.Mesh(fanGeometry, fanMaterial);
  fan.position.set(...fanBounds.center);
  fan.scale.set(...fanBounds.size);
  fan.name = 'Cooling_Fan_Envelope'; fan.renderOrder = 13;
  cooling.add(fan);

  const lineMaterial = new THREE.LineBasicMaterial({
    transparent: true, toneMapped: false, depthTest: false, depthWrite: false
  });
  materials.push(lineMaterial);
  const connections = new THREE.Group();
  connections.name = 'Battery_To_Radar_Connection_Diagram';
  group.add(connections);
  function connection(points) {
    const path = new THREE.CurvePath();
    let previous = points[0];
    for (let i = 1; i < points.length - 1; i++) {
      const corner = points[i], next = points[i + 1];
      const bend = Math.min(COMPONENTS.connectionBend, corner.distanceTo(previous) / 2, corner.distanceTo(next) / 2);
      const enter = corner.clone().add(previous.clone().sub(corner).normalize().multiplyScalar(bend));
      const leave = corner.clone().add(next.clone().sub(corner).normalize().multiplyScalar(bend));
      path.add(new THREE.LineCurve3(previous, enter));
      path.add(new THREE.QuadraticBezierCurve3(enter, corner, leave));
      previous = leave;
    }
    path.add(new THREE.LineCurve3(previous, points.at(-1)));
    const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(12));
    geometries.push(geometry);
    const line = new THREE.Line(geometry, lineMaterial);
    line.renderOrder = 11;
    connections.add(line);
  }
  const radar = radarBounds.clone().applyMatrix4(inverse);
  const radarCenter = radar.getCenter(new THREE.Vector3());
  const junction = new THREE.Vector3(radarCenter.x,
    Math.max(...batteryBounds.map(bounds => bounds.max.y)) + COMPONENTS.connectionRise,
    radarCenter.z);

  for (const bounds of batteryBounds) {
    const start = bounds.getCenter(new THREE.Vector3()); start.y = bounds.max.y;
    connection([start, new THREE.Vector3(start.x, junction.y, start.z),
      new THREE.Vector3(start.x, junction.y, junction.z), junction]);
  }
  connection([junction, new THREE.Vector3(radarCenter.x, radar.min.y + 0.02, radarCenter.z)]);

  return {
    group,
    configure(settings) {
      for (const [mat, prefix] of [[batteryMaterial, 'battery'], [coolingMaterial, 'cooling'], [fanMaterial, 'cooling']]) {
        mat.uniforms.tint.value.set(settings[`${prefix}Color`]);
        mat.uniforms.density.value = settings[`${prefix}Opacity`];
        mat.uniforms.highlight.value = settings[`${prefix}Highlight`];
      }
      batteries.forEach(mesh => { mesh.visible = settings.batteryOpacity > 0; });
      cooling.visible = settings.coolingOpacity > 0;
      connections.visible = settings.powerLineOpacity > 0;
      lineMaterial.color.set(settings.batteryColor);
      lineMaterial.opacity = settings.powerLineOpacity;
    },
    dispose() {
      group.removeFromParent();
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(mat => mat.dispose());
    }
  };
}
