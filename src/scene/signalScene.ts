import * as THREE from 'three'

let cleanup: (() => void) | null = null

export function initSignalScene(canvasEl: HTMLCanvasElement | null): void {
  if (cleanup) { cleanup(); cleanup = null }
  if (!canvasEl) return
  const canvas = canvasEl

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.z = 4.5

  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const d1 = new THREE.DirectionalLight(0xff5c3a, 1.8); d1.position.set(3, 3, 4); scene.add(d1)
  const d2 = new THREE.DirectionalLight(0x88ccff, 1.0); d2.position.set(-3, -2, 3); scene.add(d2)

  const baseGeo = new THREE.IcosahedronGeometry(1.35, 5)
  const mat = new THREE.MeshStandardMaterial({ color: 0xe8e2d6, metalness: 0.3, roughness: 0.35, flatShading: false })
  const mesh = new THREE.Mesh(baseGeo, mat)
  scene.add(mesh)

  const wire = new THREE.Mesh(
    baseGeo.clone(),
    new THREE.MeshBasicMaterial({ color: 0xff5c3a, wireframe: true, transparent: true, opacity: 0.0 })
  )
  scene.add(wire)

  const pointsMat = new THREE.PointsMaterial({ color: 0xff5c3a, size: 0.018, transparent: true, opacity: 0 })
  const pts = new THREE.Points(baseGeo.clone(), pointsMat)
  scene.add(pts)

  const orig = (baseGeo.attributes.position as THREE.BufferAttribute).array as Float32Array
  const tmp = new Float32Array(orig.length)

  const mouse = { x: 0, y: 0 }
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
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

  function applyDisplacement(time: number) {
    const pos = mesh.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const mx = mouse.x * 0.8
    const my = -mouse.y * 0.8
    for (let i = 0; i < arr.length; i += 3) {
      const ox = orig[i], oy = orig[i + 1], oz = orig[i + 2]
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
      const nx = ox / len, ny = oy / len, nz = oz / len
      const wave = Math.sin(nx * 3 + time * 1.2) * Math.cos(ny * 3 - time * 0.9) * 0.12
      const wave2 = Math.sin(nz * 5 + time * 1.6 + mx) * 0.06
      const dist = Math.sqrt((nx - mx) ** 2 + (ny - my) ** 2)
      const bump = Math.exp(-dist * 3.5) * 0.28
      const disp = 1 + wave + wave2 + bump
      tmp[i] = ox * disp
      tmp[i + 1] = oy * disp
      tmp[i + 2] = oz * disp
    }
    pos.array.set(tmp)
    pos.needsUpdate = true
    mesh.geometry.computeVertexNormals()
  }

  function animate() {
    raf = requestAnimationFrame(animate)
    const dt = Math.min(clock.getDelta(), 0.05)
    t += dt

    const mode = canvas.dataset.mode || 'mesh'
    mat.wireframe = mode === 'wire'
    mat.opacity = 1
    mat.transparent = false
    wire.material.opacity = mode === 'wire' ? 0.0 : 0.0
    pointsMat.opacity = mode === 'points' ? 0.95 : 0.0
    mat.visible = mode !== 'points'

    if (!prefersReduced) {
      mesh.rotation.y += dt * 0.22
      mesh.rotation.x = Math.sin(t * 0.3) * 0.15
      wire.rotation.copy(mesh.rotation)
      pts.rotation.copy(mesh.rotation)
      applyDisplacement(t)
    }

    const light = document.documentElement.dataset.theme === 'light'
    mat.color.setHex(light ? 0x2a2722 : 0xe8e2d6)
    mat.metalness = light ? 0.1 : 0.3
    mat.roughness = light ? 0.5 : 0.35

    renderer.render(scene, camera)
  }
  animate()

  cleanup = () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    renderer.dispose()
    baseGeo.dispose(); mat.dispose()
  }
}
