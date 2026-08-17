export const sandPreloaderVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const sandPreloaderFragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex 2D noise helper
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec4 p = permute( permute( i.y + vec4(0.0, i1.y, 1.0, 0.0 ))
    + i.x + vec4(0.0, i1.x, 1.0, 0.0 ));
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw), 0.0), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = vUv;
    
    // Wind vector noise offset
    float noiseVal = snoise(st * 8.0 + vec2(uTime * 0.5, uTime * 0.2));
    float fineNoise = snoise(st * 30.0 + vec2(uTime * 1.5, uTime * 0.8));

    // Dissolve threshold with wind direction
    float windShift = st.x * 0.4 + noiseVal * 0.15;
    float threshold = uProgress * 1.4 - windShift;

    float alpha = smoothstep(threshold - 0.15, threshold + 0.1, fineNoise * 0.3 + st.y * 0.5);
    
    // Sand color Palette (Terracotta to Sand Gold)
    vec3 darkSand = vec3(0.05, 0.04, 0.03); // #0D0B09
    vec3 terracotta = vec3(0.62, 0.28, 0.16); // #9E472A
    vec3 goldSand = vec3(0.90, 0.77, 0.58); // #E6C594

    vec3 sandColor = mix(terracotta, goldSand, noiseVal * 0.5 + 0.5);
    vec3 finalColor = mix(darkSand, sandColor, smoothstep(0.0, 0.6, alpha));

    // Edge glowing sand particles along dissolve border
    float border = smoothstep(0.0, 0.08, abs(alpha - 0.5));
    finalColor = mix(goldSand * 1.5, finalColor, border);

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
  }
`;
