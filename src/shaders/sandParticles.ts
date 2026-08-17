export const sandParticleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute vec3 aRandomness;

  varying vec3 vPosition;
  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec3 modelPosition = position;

    // 3D Vortex Swirl & Wind Turbulence Physics
    float time = uTime * 0.5 + aRandomness.x * 10.0;
    
    // Spiral rotation around Y axis
    float angle = time * 0.4 + aRandomness.y * 6.28;
    float radius = length(modelPosition.xz) + sin(time * 0.8) * 0.5;
    
    modelPosition.x = cos(angle) * radius + sin(time + aRandomness.z * 6.28) * 0.4;
    modelPosition.y += sin(time * 0.8 + aRandomness.y * 6.28) * 0.6 + cos(uTime * 0.3) * 0.2;
    modelPosition.z = sin(angle) * radius + cos(time * 0.6 + aRandomness.x * 6.28) * 0.4;

    vec4 viewPosition = modelViewMatrix * vec4(modelPosition, 1.0);
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    
    // Size attenuation based on distance to camera
    gl_PointSize = aScale * uPixelRatio * (28.0 / -viewPosition.z);

    vPosition = modelPosition;
    vAlpha = smoothstep(30.0, 3.0, -viewPosition.z);
    vColorMix = aRandomness.z;
  }
`;

export const sandParticleFragmentShader = /* glsl */ `
  uniform vec3 uColorGold;
  uniform vec3 uColorSaffron;
  varying vec3 vPosition;
  varying float vAlpha;
  varying float vColorMix;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float strength = pow(1.0 - (dist * 2.0), 2.2);

    // Blend between Deep Gold and Saffron Fire
    vec3 finalColor = mix(uColorGold, uColorSaffron, vColorMix);
    finalColor = mix(finalColor, vec3(1.0, 0.95, 0.8), strength * 0.5);

    gl_FragColor = vec4(finalColor, strength * 0.85 * vAlpha);
  }
`;
