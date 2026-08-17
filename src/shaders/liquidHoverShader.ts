export const liquidHoverVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const liquidHoverFragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // 2D Noise generator for liquid ripple displacement
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

    // Ripple vector calculations
    float ripple = snoise(st * 15.0 + vec2(uTime * 2.0, uTime * 1.5)) * uProgress;
    vec2 distortedSt = st + vec2(ripple * 0.08, ripple * 0.05);

    // Color gradient representing royal spices
    vec3 emeraldDark = vec3(0.03, 0.11, 0.08); // #081C15
    vec3 gold = vec3(0.83, 0.68, 0.21); // #D4AF37
    vec3 saffron = vec3(0.87, 0.35, 0.28); // #E05A47

    vec3 finalColor = mix(emeraldDark, gold, distortedSt.y + ripple);
    finalColor = mix(finalColor, saffron, ripple * 0.8);

    gl_FragColor = vec4(finalColor, uProgress * 0.85);
  }
`;
