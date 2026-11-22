import * as THREE from 'three'
import type { SceneId, ViewState } from '../ui/render'

export interface HeroSceneController {
  attach: (canvas: HTMLCanvasElement | null) => void
  setScene: (scene: SceneId) => void
  setTheme: (theme: 'dark' | 'light') => void
  dispose: () => void
}

const SCENE_POS: Record<SceneId, THREE.Vector3> = {
  home: new THREE.Vector3(0, 0.15, 0),
  'poster-lab': new THREE.Vector3(6.2, 0.2, -1.2),
  'type-machine': new THREE.Vector3(12.4, -0.1, 0.4),
  glassmorphism: new THREE.Vector3(18.6, 0.25, -0.8),
  about: new THREE.Vector3(24.8, 0.0, 0.2),
  contact: new THREE.Vector3(31.0, 0.1, -0.4),
}

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
function cssColor(name: string, fallback: number): THREE.Color {
  const v = cssVar(name)
  try { return new THREE.Color(v) } catch { return new THREE.Color(fallback) }
}

function makeLabelTexture(text: string, accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512; c.height = 256
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 512, 256)
  ctx.fillStyle = 'rgba(255,255,255,0.02)'
  ctx.fillRect(0, 0, 512, 256)
  ctx.strokeStyle = accent
  ctx.lineWidth = 8
  ctx.strokeRect(18, 18, 476, 220)
  ctx.fillStyle = '#f4f1ea'
  ctx.font = 'bold 72px "Bebas Neue", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.toUpperCase().slice(0, 14), 256, 118)
  ctx.fillStyle = accent
  ctx.font = '700 22px Manrope, sans-serif'
  ctx.fillText('LIVE PROJECT', 256, 176)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

export function initHeroScene(canvasEl: HTMLCanvasElement | null, initial: ViewState): HeroSceneController {
  let canvas = canvasEl
  let disposed = false
  let currentScene: SceneId = initial.scene
  let theme: 'dark' | 'light' = initial.theme

  const renderer = new THREE.WebGLRenderer({ canvas: canvas || undefined, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120)
  camera.position.set(0, 0.2, 8.5)

  const ambient = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambient)
  const key = new THREE.DirectionalLight(0xfff1df, 2.0)
  key.position.set(4, 5, 6)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x8ec5ff, 0.9)
  fill.position.set(-5, -2, 4)
  scene.add(fill)
  const rim = new THREE.PointLight(0xff5a3a, 2.4, 30)
  rim.position.set(-3, 2, -4)
  scene.add(rim)

  const fog = new THREE.Fog(0x09090b, 10, 34)
  scene.fog = fog

  const world = new THREE.Group()
  scene.add(world)

  // ground/grid
  const grid = new THREE.GridHelper(120, 120, 0xffffff, 0xffffff)
  grid.position.y = -2.2
  grid.position.x = 15
  const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material]
  gridMats.forEach((m) => { const mm = m as THREE.LineBasicMaterial; mm.transparent = true; mm.opacity = 0.08 })
  world.add(grid)

  // particles
  const pCount = 900
  const pPos = new Float32Array(pCount * 3)
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.2) * 45
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 12
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 18
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const pMat = new THREE.PointsMaterial({ color: 0xf4f1ea, size: 0.018, transparent: true, opacity: 0.5, sizeAttenuation: true })
  const particles = new THREE.Points(pGeo, pMat)
  world.add(particles)

  // HOME hero object
  const heroGroup = new THREE.Group()
  heroGroup.position.copy(SCENE_POS.home)
  world.add(heroGroup)
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xece6da, metalness: 0.05, roughness: 0.08, transmission: 0.72, thickness: 1.1, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.12, transparent: true, opacity: 1 })
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.05, 0.34, 220, 32), glassMat)
  heroGroup.add(knot)
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xff5a3a, emissive: 0xff5a3a, emissiveIntensity: 0.45, metalness: 0.4, roughness: 0.25 })
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), coreMat)
  heroGroup.add(core)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf4f1ea, wireframe: true, transparent: true, opacity: 0.12 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.01, 16, 120), ringMat)
  ring.rotation.x = Math.PI * 0.48
  heroGroup.add(ring)
  const ring2 = ring.clone(); ring2.rotation.y = Math.PI * 0.5; ring2.scale.setScalar(0.82); heroGroup.add(ring2)

  // POSTER LAB object
  const posterGroup = new THREE.Group()
  posterGroup.position.copy(SCENE_POS['poster-lab'])
  world.add(posterGroup)
  const posterFrameMat = new THREE.MeshStandardMaterial({ color: 0x1f1f24, metalness: 0.35, roughness: 0.45 })
  const posterFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.2, 0.12), posterFrameMat)
  posterGroup.add(posterFrame)
  const posterTex = makeLabelTexture('POSTER LAB', '#ff5a3a')
  const posterPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 2.85), new THREE.MeshBasicMaterial({ map: posterTex, transparent: true }))
  posterPlane.position.z = 0.07
  posterGroup.add(posterPlane)
  const posterGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.5), new THREE.MeshBasicMaterial({ color: 0xff5a3a, transparent: true, opacity: 0.08 }))
  posterGlow.position.z = -0.08
  posterGroup.add(posterGlow)

  // TYPE MACHINE object
  const typeGroup = new THREE.Group()
  typeGroup.position.copy(SCENE_POS['type-machine'])
  world.add(typeGroup)
  const typeChars: THREE.Mesh[] = []
  const typeMat = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, metalness: 0.15, roughness: 0.35 })
  const letters = ['T', 'Y', 'P', 'E']
  letters.forEach((ch, i) => {
    const texC = document.createElement('canvas')
    texC.width = 256; texC.height = 256
    const tctx = texC.getContext('2d')!
    tctx.clearRect(0, 0, 256, 256)
    tctx.fillStyle = '#f4f1ea'
    tctx.font = 'bold 190px "Bebas Neue", sans-serif'
    tctx.textAlign = 'center'; tctx.textBaseline = 'middle'
    tctx.fillText(ch, 128, 140)
    const tex = new THREE.CanvasTexture(texC)
    tex.colorSpace = THREE.SRGBColorSpace
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.15, 0.28), [typeMat, typeMat, typeMat, typeMat, new THREE.MeshStandardMaterial({ map: tex, metalness: 0.1, roughness: 0.4 }), typeMat])
    m.position.set((i - 1.5) * 1.05, 0, 0)
    m.rotation.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.2)
    m.userData.baseY = 0
    m.userData.phase = i * 0.7
    typeGroup.add(m)
    typeChars.push(m)
  })

  // GLASS object
  const glassGroup = new THREE.Group()
  glassGroup.position.copy(SCENE_POS.glassmorphism)
  world.add(glassGroup)
  const g1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 0), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.05, transmission: 0.9, thickness: 1.2, ior: 1.5, transparent: true }))
  g1.position.set(-0.2, 0.1, 0)
  glassGroup.add(g1)
  const g2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.22, 32, 80), new THREE.MeshPhysicalMaterial({ color: 0xfff5e8, metalness: 0.1, roughness: 0.1, transmission: 0.55, thickness: 0.8, ior: 1.4, transparent: true }))
  g2.rotation.x = Math.PI * 0.42
  glassGroup.add(g2)
  const g3 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff5a3a, emissive: 0xff5a3a, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.2 }))
  g3.position.set(1.1, -0.55, 0.8)
  glassGroup.add(g3)

  // ABOUT/CONTACT markers (subtle)
  const aboutGroup = new THREE.Group()
  aboutGroup.position.copy(SCENE_POS.about)
  world.add(aboutGroup)
  const aboutRing = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.22, 160, 24, 2, 5), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, metalness: 0.6, roughness: 0.25 }))
  aboutGroup.add(aboutRing)

  const contactGroup = new THREE.Group()
  contactGroup.position.copy(SCENE_POS.contact)
  world.add(contactGroup)
  const contactOrb = new THREE.Mesh(new THREE.SphereGeometry(0.95, 48, 48), new THREE.MeshPhysicalMaterial({ color: 0xece6da, metalness: 0.1, roughness: 0.12, transmission: 0.35, thickness: 1, transparent: true, opacity: 0.95 }))
  contactGroup.add(contactOrb)
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.015, 12, 100), ringMat.clone())
  orbit.rotation.x = Math.PI * 0.5
  contactGroup.add(orbit)

  const groups: Record<SceneId, THREE.Group> = {
    home: heroGroup,
    'poster-lab': posterGroup,
    'type-machine': typeGroup,
    glassmorphism: glassGroup,
    about: aboutGroup,
    contact: contactGroup,
  }

  let pointer = new THREE.Vector2(0, 0)
  let pointerTarget = new THREE.Vector2(0, 0)
  const camTarget = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const desiredCam = new THREE.Vector3()
  const desiredLook = new THREE.Vector3()
  let t = 0
  let raf = 0

  function resize() {
    if (!canvas) return
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function applyTheme(nextTheme: 'dark' | 'light') {
    theme = nextTheme
    const bg = cssColor('--scene-bg-a', 0x09090b)
    const fogC = cssColor('--scene-fog', 0x09090b)
    scene.fog = new THREE.Fog(fogC.getHex(), 10, 36)
    scene.background = null
    renderer.setClearColor(bg, 0)
    ambient.intensity = theme === 'dark' ? 0.5 : 0.85
    key.color.copy(cssColor('--scene-key', 0xfff1df))
    key.intensity = theme === 'dark' ? 2.0 : 2.4
    fill.color.copy(cssColor('--scene-fill', 0x8ec5ff))
    fill.intensity = theme === 'dark' ? 0.9 : 1.15
    rim.color.copy(cssColor('--scene-rim', 0xff5a3a))
    rim.intensity = theme === 'dark' ? 2.4 : 1.4
    pMat.color.copy(cssColor('--scene-particle', 0xf4f1ea))
    pMat.opacity = theme === 'dark' ? 0.5 : 0.25
    glassMat.color.copy(cssColor('--scene-glass', 0xece6da))
    glassMat.transmission = theme === 'dark' ? 0.72 : 0.4
    glassMat.roughness = theme === 'dark' ? 0.08 : 0.12
    glassMat.opacity = 1
    coreMat.color.copy(cssColor('--accent', 0xff5a3a))
    coreMat.emissive.copy(cssColor('--accent', 0xff5a3a))
    coreMat.emissiveIntensity = theme === 'dark' ? 0.45 : 0.2
    posterFrameMat.color.set(theme === 'dark' ? 0x1f1f24 : 0xe8e1d5)
    posterFrameMat.roughness = theme === 'dark' ? 0.45 : 0.6
    typeMat.color.copy(cssColor('--text', 0xf4f1ea))
    g1.material = new THREE.MeshPhysicalMaterial({ color: cssColor('--scene-glass', 0xffffff).getHex(), metalness: 0, roughness: theme === 'dark' ? 0.05 : 0.08, transmission: theme === 'dark' ? 0.88 : 0.35, thickness: 1.1, ior: 1.5, transparent: true, opacity: theme === 'dark' ? 1 : 0.95 })
    g2.material = new THREE.MeshPhysicalMaterial({ color: theme === 'dark' ? 0xfff5e8 : 0xffffff, metalness: 0.1, roughness: 0.12, transmission: theme === 'dark' ? 0.5 : 0.22, thickness: 0.8, ior: 1.4, transparent: true })
    ;(g3.material as THREE.MeshStandardMaterial).color.copy(cssColor('--accent', 0xff5a3a))
    ;(g3.material as THREE.MeshStandardMaterial).emissive.copy(cssColor('--accent', 0xff5a3a))
    ;(aboutRing.material as THREE.MeshStandardMaterial).color.set(theme === 'dark' ? 0xd8d0c0 : 0x7b7266)
    ;(contactOrb.material as THREE.MeshPhysicalMaterial).color.copy(cssColor('--scene-glass', 0xece6da))
    ;(contactOrb.material as THREE.MeshPhysicalMaterial).transmission = theme === 'dark' ? 0.35 : 0.12
    gridMats.forEach((m) => { (m as THREE.LineBasicMaterial).color.set(theme === 'dark' ? 0xffffff : 0x1d1914); (m as THREE.LineBasicMaterial).opacity = theme === 'dark' ? 0.08 : 0.06 })
    document.body.style.background = cssVar('--bg')
  }

  function updateCameraTarget() {
    const p = SCENE_POS[currentScene]
    desiredLook.set(p.x, p.y, p.z)
    const offsetZ = currentScene === 'home' ? 8.5 : 7.6
    const offsetX = currentScene === 'home' ? 0 : 1.2
    const offsetY = currentScene === 'home' ? 0.2 : 0.15
    desiredCam.set(p.x + offsetX, p.y + offsetY, p.z + offsetZ)
  }

  function onPointer(e: PointerEvent) {
    pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 2
    pointerTarget.y = (e.clientY / window.innerHeight - 0.5) * 2
  }

  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('resize', resize)
  resize()
  applyTheme(theme)
  camTarget.copy(SCENE_POS[currentScene]).add(new THREE.Vector3(1.2, 0.15, 7.6))
  lookTarget.copy(SCENE_POS[currentScene])
  updateCameraTarget()

  const clock = new THREE.Clock()
  function tick() {
    if (disposed) return
    const dt = Math.min(clock.getDelta(), 0.05)
    t += dt
    pointer.lerp(pointerTarget, 0.045)

    updateCameraTarget()
    camTarget.lerp(desiredCam, 0.045)
    lookTarget.lerp(desiredLook, 0.05)
    camera.position.copy(camTarget)
    camera.position.x += pointer.x * 0.35
    camera.position.y += -pointer.y * 0.2
    camera.lookAt(lookTarget.x + pointer.x * 0.12, lookTarget.y - pointer.y * 0.08, lookTarget.z)

    // idle motions
    knot.rotation.x += dt * 0.22
    knot.rotation.y += dt * 0.34
    core.rotation.y -= dt * 0.5
    ring.rotation.z += dt * 0.08
    ring2.rotation.z -= dt * 0.06
    heroGroup.position.y = SCENE_POS.home.y + Math.sin(t * 0.8) * 0.08

    posterGroup.rotation.y = Math.sin(t * 0.35) * 0.08 + pointer.x * 0.06
    posterGroup.rotation.x = -pointer.y * 0.04
    posterGlow.material.opacity = 0.06 + (Math.sin(t * 1.2) * 0.02 + 0.02)

    typeChars.forEach((m, i) => {
      m.rotation.x += dt * (0.2 + i * 0.03)
      m.rotation.y += dt * (0.35 - i * 0.04)
      m.position.y = Math.sin(t * 1.2 + m.userData.phase) * 0.18
    })

    g1.rotation.x += dt * 0.25
    g1.rotation.y += dt * 0.3
    g2.rotation.z += dt * 0.22
    g3.position.y = -0.55 + Math.sin(t * 1.4) * 0.12

    aboutRing.rotation.x += dt * 0.24
    aboutRing.rotation.y += dt * 0.32
    contactOrb.rotation.y += dt * 0.2
    orbit.rotation.z -= dt * 0.25

    particles.rotation.y = t * 0.01
    particles.position.x = Math.sin(t * 0.03) * 0.3

    // focus scaling
    for (const [id, g] of Object.entries(groups) as [SceneId, THREE.Group][]) {
      const active = id === currentScene
      const s = active ? 1 : 0.82
      g.scale.lerp(new THREE.Vector3(s, s, s), 0.06)
    }

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  tick()

  return {
    attach(nextCanvas) {
      if (disposed) return
      if (nextCanvas && nextCanvas !== canvas) {
        canvas = nextCanvas
        // recreate renderer bound to new canvas by simple approach: replace canvas content via renderer.domElement swap
        const parent = nextCanvas.parentElement
        if (parent) {
          renderer.domElement.style.width = '100%'
          renderer.domElement.style.height = '100%'
          if (renderer.domElement !== nextCanvas) {
            nextCanvas.replaceWith(renderer.domElement)
            canvas = renderer.domElement as HTMLCanvasElement
            canvas.id = 'bg-canvas'
            canvas.setAttribute('aria-hidden', 'true')
          }
        }
        resize()
      } else if (nextCanvas) {
        canvas = nextCanvas
        resize()
      }
    },
    setScene(next) { currentScene = next; updateCameraTarget() },
    setTheme(next) { applyTheme(next) },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', resize)
      pGeo.dispose(); pMat.dispose()
      renderer.dispose()
    },
  }
}
