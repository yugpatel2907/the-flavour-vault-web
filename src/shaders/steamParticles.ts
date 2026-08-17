export const steamVertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aScale;
  attribute vec3 aVelocity;
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Rising aromatic steam physics
    float age = mod(uTime * 0.8 + aVelocity.x * 10.0, 4.0);
    pos.y += age * 1.2;
    pos.x += sin(uTime * 1.5 + aVelocity.y * 6.28) * 0.25 * age;
    pos.z += cos(uTime * 1.2 + aVelocity.z * 6.28) * 0.25 * age;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Fade out as steam rises
    vAlpha = smoothstep(0.0, 0.8, age) * smoothstep(4.0, 2.0, age);
  }
`;

export const steamFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float strength = pow(1.0 - (dist * 2.0), 2.0);
    vec3 steamColor = mix(uColor, vec3(1.0, 0.95, 0.8), strength);

    gl_FragColor = vec4(steamColor, strength * 0.4 * vAlpha);
  }
`;
