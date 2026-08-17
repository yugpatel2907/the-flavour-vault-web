export const mirageVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const mirageFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uDistortionStrength;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv;

    // Mirage heat-haze wave displacement formula
    float waveX = sin(st.y * 20.0 + uTime * 2.5) * 0.015 * uDistortionStrength;
    float waveY = cos(st.x * 20.0 + uTime * 2.0) * 0.015 * uDistortionStrength;

    // Mouse influence heat distortion
    vec2 mouseOffset = (st - uMouse) * 0.05 * uDistortionStrength;

    vec2 distortedUv = st + vec2(waveX, waveY) + mouseOffset;

    vec4 color = texture2D(uTexture, distortedUv);

    // Warm desert sunlight color grade shift
    color.rgb += vec3(0.04, 0.02, 0.0) * uDistortionStrength;

    gl_FragColor = color;
  }
`;
