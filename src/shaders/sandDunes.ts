export const duneVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vElevation;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float calculateDuneElevation(vec2 pos, float time) {
    float elevation = 0.0;
    
    // Continuous flowing wind wave displacement
    vec2 windPos = pos + vec2(time * 0.4, time * 0.2);

    elevation += sin(windPos.x * 0.15 + windPos.y * 0.08) * 1.8;
    elevation += cos(windPos.x * 0.08 - windPos.y * 0.12) * 1.4;
    elevation += noise(windPos * 0.4) * 0.8;
    elevation += noise(windPos * 1.2) * 0.3;

    return elevation;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float el = calculateDuneElevation(pos.xz, uTime);
    pos.y += el;
    vElevation = el;

    vec2 e = vec2(0.1, 0.0);
    float elX = calculateDuneElevation(pos.xz + e, uTime);
    float elZ = calculateDuneElevation(pos.xz + e.yx, uTime);
    vec3 normalCalc = normalize(vec3(el - elX, e.x, el - elZ));
    vNormal = normalMatrix * normalCalc;

    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const duneFragmentShader = /* glsl */ `
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uEmeraldColor;
  uniform vec3 uGoldColor;
  uniform vec3 uAmbientColor;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vElevation;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uSunDirection);

    float NdotL = max(dot(normal, lightDir), 0.0);
    float rim = pow(1.0 - max(dot(normal, vec3(0.0, 1.0, 0.0)), 0.0), 3.0);
    
    float elevationFactor = smoothstep(-2.0, 2.5, vElevation);
    vec3 baseColor = mix(uEmeraldColor, uGoldColor, elevationFactor);

    vec3 diffuse = baseColor * (uSunColor * NdotL * 1.4 + uAmbientColor);
    diffuse += uSunColor * rim * 0.4 * NdotL;

    float dist = length(vWorldPosition.xz);
    float fogFactor = smoothstep(15.0, 60.0, dist);
    vec3 fogColor = vec3(0.03, 0.11, 0.08); // Midnight Emerald #081C15

    vec3 finalColor = mix(diffuse, fogColor, fogFactor);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
