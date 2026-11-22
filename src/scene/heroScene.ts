import * as THREE from 'three'

export function initHeroScene(canvasEl: HTMLCanvasElement | null): () => void {
  if (!canvasEl) return () => {}
  const canvas = canvasEl

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 0, 7)

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambient)
  const key = new THREE.DirectionalLight(0xfff1e0, 2.2)
  key.position.set(4, 5, 6)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x8ecfff, 0.9)
  fill.position.set(-5, -2, 4)
  scene.add(fill)
  const rim = new THREE.PointLight(0xff5c3a, 2.5, 20)
  rim.position.set(-3, 2, -4)
  scene.add(rim)

  // Main object - complex knot
  const geo = new THREE.TorusKnotGeometry(1.15, 0.38, 320, 64, 2, 5)
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a1d,
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    reflectivity: 1,
    envMapIntensity: 1.2,
  })
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  // Wireframe shell
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xff5c3a, wireframe: true, transparent: true, opacity: 0.06 })
  const wire = new THREE.Mesh(new THREE.TorusKnotGeometry(1.18, 0.4, 100, 16, 2, 5), wireMat)
  scene.add(wire)

  // Floating particles
  const pCount = 600
  const pGeo = new THREE.BufferGeometry()
  const pos = new Float32Array(pCount * 3)
  for (let i = 0; i < pCount; i++) {
    const r = 2.5 + Math.random() * 3.5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const pMat = new THREE.PointsMaterial({ color: 0xf2efe8, size: 0.015, transparent: true, opacity: 0.55, sizeAttenuation: true })
  const points = new THREE.Points(pGeo, pMat)
  scene.add(points)

  // Secondary ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.008, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xff5c3a, transparent: true, opacity: 0.35 })
  )
  ring.rotation.x = Math.PI * 0.42
  ring.rotation.y = Math.PI * 0.15
  scene.add(ring)

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.005, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xf2efe8, transparent: true, opacity: 0.12 })
  )
  ring2.rotation.x = Math.PI * 0.55
  ring2.rotation.y = -Math.PI * 0.2
  scene.add(ring2)

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  const onMove = (e: PointerEvent) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let raf = 0
  let t = 0
  const clock = new THREE.Clock()

  function animate() {
    raf = requestAnimationFrame(animate)
    const dt = Math.min(clock.getDelta(), 0.05)
    t += dt
    mouse.x += (mouse.tx - mouse.x) * 0.04
    mouse.y += (mouse.ty - mouse.y) * 0.04

    if (!prefersReduced) {
      mesh.rotation.x = t * 0.18 + mouse.y * 0.25
      mesh.rotation.y = t * 0.24 + mouse.x * 0.35
      wire.rotation.copy(mesh.rotation)
      wire.rotation.z += 0.1
      points.rotation.y = t * 0.03
      points.rotation.x = Math.sin(t * 0.1) * 0.05
      ring.rotation.z = t * 0.08
      ring2.rotation.z = -t * 0.05
      rim.position.x = -3 + mouse.x * 2
      rim.position.y = 2 - mouse.y * 1.5
    }

    // adapt to theme
    const light = document.documentElement.dataset.theme === 'light'
    mat.color.setHex(light ? 0xd8d2c8 : 0x1a1a1d)
    mat.metalness = light ? 0.25 : 0.85
    mat.roughness = light ? 0.22 : 0.18
    wireMat.opacity = light ? 0.08 : 0.06
    pMat.color.setHex(light ? 0x141311 : 0xf2efe8)
    pMat.opacity = light ? 0.25 : 0.55
    ring2.material = new THREE.MeshBasicMaterial({ color: light ? 0x141311 : 0xf2efe8, transparent: true, opacity: light ? 0.08 : 0.12 })
    scene.background = null

    renderer.render(scene, camera)
  }
  animate()

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    renderer.dispose()
    geo.dispose(); mat.dispose(); pGeo.dispose(); pMat.dispose()
  }
}
