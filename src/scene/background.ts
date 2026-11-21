import * as THREE from 'three'

interface BgOptions {
  theme: 'light' | 'dark'
  seed: number
  reducedMotion: boolean
}

const vertex = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragment = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform float uDark;
  uniform float uSeed;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21) + uSeed * 0.001);
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float t = uTime * 0.06;
    vec2 pointer = (uPointer - 0.5) * 0.18;
    float scroll = uScroll;

    // flowing field (fluid)
    vec2 q = p + pointer * 0.4;
    float n1 = fbm(q * 1.35 + vec2(t * 0.7, -t * 0.4) + scroll * 0.6);
    float n2 = fbm(q * 2.1 + vec2(-t * 0.5, t * 0.35) + n1 * 0.9);
    float flow = fbm(q * 1.1 + vec2(n2 * 0.8, n1 * 0.6) + vec2(0.0, -scroll * 0.8));

    // geometry: soft grid + bands
    vec2 gp = p * 3.2 + vec2(scroll * 0.2, -scroll * 0.15);
    vec2 grid = abs(fract(gp) - 0.5);
    float lines = smoothstep(0.48, 0.44, min(grid.x, grid.y));
    float bands = smoothstep(0.02, 0.0, abs(sin((p.x * 1.4 + p.y * 0.9 + flow * 0.9 + scroll) * 2.4)));
    float geo = mix(lines * 0.25, bands * 0.18, 0.5);

    float vign = smoothstep(1.15, 0.2, length(p * vec2(0.9, 1.05)));
    float lightMask = smoothstep(0.15, 0.95, flow) * 0.6 + 0.4;

    vec3 darkBase = mix(vec3(0.055, 0.08, 0.095), vec3(0.10, 0.17, 0.19), flow);
    vec3 lightBase = mix(vec3(0.95, 0.94, 0.92), vec3(0.88, 0.92, 0.90), flow);
    vec3 base = mix(lightBase, darkBase, uDark);

    vec3 accentA = mix(vec3(0.12, 0.56, 0.51), vec3(0.47, 0.83, 0.77), 0.35 + 0.35 * sin(flow * 3.2));
    vec3 accentB = mix(vec3(0.72, 0.47, 0.17), vec3(0.85, 0.69, 0.48), 0.4 + 0.3 * n2);
    vec3 cool = vec3(0.31, 0.47, 0.68);
    vec3 accent = mix(accentA, accentB, smoothstep(0.35, 0.8, n2));
    accent = mix(accent, cool, 0.18 * (1.0 - n1));

    vec3 col = base;
    col += accent * (0.18 + 0.22 * lightMask) * (0.55 + 0.45 * uDark);
    col += geo * mix(vec3(0.08, 0.1, 0.12), vec3(0.55, 0.7, 0.68), 0.25 + 0.35 * uDark);
    col += vec3(0.08, 0.1, 0.09) * smoothstep(0.65, 1.0, n2) * (0.25 + 0.4 * (1.0 - uDark));

    // caustic-like highlight
    float caustic = smoothstep(0.72, 0.98, fbm(p * 4.0 + flow + t));
    col += accentA * caustic * (0.08 + 0.12 * uDark);

    col *= vign;
    col = mix(col, base, (1.0 - vign) * 0.2);
    col = clamp(col, 0.0, 1.0);

    // subtle grain dither
    float g = hash(uv * uResolution + uTime) - 0.5;
    col += g * 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`

export function initBackground(canvas: HTMLCanvasElement, opts: BgOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uScroll: { value: 0 },
    uDark: { value: opts.theme === 'dark' ? 1 : 0 },
    uSeed: { value: opts.seed % 10000 },
  }

  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  let scrollTarget = 0
  let pointerTarget = new THREE.Vector2(0.5, 0.5)
  let darkTarget = uniforms.uDark.value

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    uniforms.uResolution.value.set(w, h)
  }
  resize()
  window.addEventListener('resize', resize)

  let start = performance.now()
  let raf = 0
  function tick(now: number) {
    const t = (now - start) / 1000
    uniforms.uTime.value = opts.reducedMotion ? 0.0 : t
    uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * 0.08
    uniforms.uPointer.value.lerp(pointerTarget, 0.06)
    uniforms.uDark.value += (darkTarget - uniforms.uDark.value) * 0.08
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return {
    setScroll(progress: number) {
      scrollTarget = Math.max(0, Math.min(1, progress))
    },
    setPointer(x: number, y: number) {
      pointerTarget.set(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, 1 - y)))
    },
    setTheme(theme: 'light' | 'dark') {
      darkTarget = theme === 'dark' ? 1 : 0
    },
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
