export const godRayVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const godRayFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uRayColor;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float noise(vec2 p) {
    return sin(p.x * 10.0 + uTime * 1.5) * cos(p.y * 8.0 + uTime * 1.2) * 0.5 + 0.5;
  }

  void main() {
    vec2 st = vUv;

    // Volumetric sunbeam shaft calculations
    float ray = sin(st.x * 25.0 + st.y * 10.0 + uTime * 0.8) * 0.5 + 0.5;
    float fineRay = noise(st * 4.0);

    float intensity = pow(ray * fineRay, 2.5) * smoothstep(0.0, 0.4, st.y) * smoothstep(1.0, 0.5, st.y);

    vec3 finalColor = uRayColor * intensity * 1.8;
    float alpha = intensity * 0.45;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
