/*
 * Room 3, walk mode (DESIGN.md 6.5): a first-person gallery in plain three.js, ported from the
 * approved preview.html scene. A 14 x 26 m room with a 5.4 m ceiling, beams, skylights, track
 * rails, an oak plank floor, plaster walls with skirting, a doorway, two benches and a velvet
 * rope. One painting per project, each with a placard and its own spotlight that casts real shadows.
 *
 * The room keeps one palette in both themes; only the light changes. Day: the sun comes through
 * glazed roof lights in a shaded room, throwing bright patches (with the glazing bars' shadows)
 * and faint shafts. Night: a dark sky through the glass, and the room lit from inside by recessed
 * downlights, a cove line along the ceiling and the picture lights.
 *
 * Rendering: reflections captured from the room itself, Khronos Neutral tone mapping (true colours,
 * soft highlights) and, on desktop, a soft bloom on bright sources (the vignette is CSS).
 * Kept light: nothing in the room moves, so shadows are drawn once per theme rather than every
 * frame; only the lights the theme uses are switched on. Soft VSM shadows; varnished planks; turned steel posts;
 * tufted benches; spotlights hung from ceiling tracks with faint visible beams (after 21st.dev
 * "Volumetric Studio", alexperezcedeno); glass over each painting; soft contact shadow where the
 * walls meet the floor; a lit corridor through the doorway.
 *
 * Renders on demand only: a frame is drawn while the camera moves, glides or eases, and nothing
 * runs while the room is off screen or hidden. React owns the HUD; this module reports which
 * painting is in front of the camera and asks React to open an exhibit.
 */
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import type { Project } from '../data/types'

export interface MuseumOptions {
  container: HTMLElement
  canvas: HTMLCanvasElement
  projects: Project[]
  reduced: boolean
  /** Fine pointer (mouse): bigger shadow maps */
  fine: boolean
  /** Painting in front of the camera changed (-1 for none) */
  onFocus: (index: number) => void
  /** Visitor clicked the painting they are standing at, or pressed Enter */
  onOpen: (index: number) => void
  /** First drag, walk or click: the hint can go */
  onInteract: () => void
}

export interface Museum {
  setActive: (active: boolean) => void
  setTheme: (dark: boolean) => void
  goPainting: (index: number) => void
  step: (dir: 1 | -1) => void
  dispose: () => void
}

const W = 14
const D = 26
const H = 5.4
const EYE = 1.62
/** three r155+ uses physical light units; the preview was tuned in legacy units. */
const LUX = Math.PI

export function createMuseum(o: MuseumOptions): Museum {
  const { container, canvas, projects, reduced } = o
  const N = projects.length
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, o.fine ? 1.5 : 1.25))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  // static room: shadow maps are rendered once (on theme change), not on every frame
  renderer.shadowMap.autoUpdate = false
  const SHADOW = o.fine ? 512 : 256
  const SUN_SHADOW = o.fine ? 1024 : 512
  const maxAniso = renderer.capabilities.getMaxAnisotropy()

  const scene = new THREE.Scene()
  // Studio reflections for every standard material (varnish, steel, gilt, glass).
  const pmrem = new THREE.PMREMGenerator(renderer)
  const roomEnv = new RoomEnvironment()
  const envTex = pmrem.fromScene(roomEnv, 0.04).texture
  roomEnv.dispose()
  pmrem.dispose()
  scene.environment = envTex
  const cam = new THREE.PerspectiveCamera(58, 1, 0.05, 80)
  cam.rotation.order = 'YXZ'
  // layer 1: light shafts and beams. The camera sees them; the reflection capture does not.
  cam.layers.enable(1)

  /* ---------- post-processing ---------- */
  // Desktop only: bloom on bright sources. Phones and tablets render straight to the screen.
  const composer = o.fine ? new EffectComposer(renderer) : null
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.55, 0.92)
  if (composer) {
    composer.addPass(new RenderPass(scene, cam))
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
  }

  /* ---------- procedural textures ---------- */
  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(x: T) => {
    disposables.push(x)
    return x
  }
  function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, srgb = true) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    draw(c.getContext('2d')!, w, h)
    const t = track(new THREE.CanvasTexture(c))
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = maxAniso
    return t
  }
  const rnd = (a: number, b: number) => a + Math.random() * (b - a)
  function planks(g: CanvasRenderingContext2D, w: number, h: number, base: [number, number, number]) {
    const cols = 8
    const pw = w / cols
    for (let c = 0; c < cols; c++) {
      let y = -rnd(0, 400)
      while (y < h) {
        const len = rnd(300, 700)
        g.fillStyle = `hsl(${base[0] + rnd(-3, 3)},${base[1]}%,${base[2] + rnd(-3, 3)}%)`
        g.fillRect(c * pw, y, pw, len)
        for (let k = 0; k < 12; k++) {
          g.strokeStyle = `rgba(60,40,25,${rnd(0.03, 0.08)})`
          g.lineWidth = rnd(0.6, 1.8)
          const x0 = c * pw + rnd(4, pw - 4)
          g.beginPath()
          g.moveTo(x0, y)
          for (let yy = y; yy < y + len; yy += 24) g.lineTo(x0 + Math.sin(yy / rnd(30, 60)) * rnd(1, 4), yy)
          g.stroke()
        }
        g.fillStyle = 'rgba(30,20,12,.35)'
        g.fillRect(c * pw, y, pw, 2)
        y += len
      }
      g.fillStyle = 'rgba(30,20,12,.35)'
      g.fillRect(c * pw, 0, 2, h)
    }
  }
  const woodFloor = canvasTex(768, 768, (g, w, h) => planks(g, w, h, [32, 22, 58]))
  woodFloor.wrapS = woodFloor.wrapT = THREE.RepeatWrapping
  woodFloor.repeat.set(W / 1.3, D / 1.3)
  const woodDark = canvasTex(512, 512, (g, w, h) => planks(g, w, h, [22, 30, 18]))
  woodDark.wrapS = woodDark.wrapT = THREE.RepeatWrapping
  const plaster = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#f4f4f2'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 60; i++) {
      const x = rnd(0, w)
      const y = rnd(0, h)
      const r = rnd(30, 120)
      const gr = g.createRadialGradient(x, y, 0, x, y, r)
      gr.addColorStop(0, `rgba(0,0,0,${rnd(0.004, 0.012)})`)
      gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gr
      g.fillRect(0, 0, w, h)
    }
    const d = g.getImageData(0, 0, w, h)
    for (let i = 0; i < d.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 10
      d.data[i] += n
      d.data[i + 1] += n
      d.data[i + 2] += n
    }
    g.putImageData(d, 0, 0)
  })
  plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping
  plaster.repeat.set(4, 2)

  /* ---------- materials ---------- */
  const std = (p: THREE.MeshStandardMaterialParameters) => track(new THREE.MeshStandardMaterial(p))
  // One palette for both themes: warm white plaster, honey oak, off-white ceiling.
  const mWall = std({ color: 0xece7de, map: plaster, bumpMap: plaster, bumpScale: 0.004, roughness: 0.94 })
  const phys = (p: THREE.MeshPhysicalMaterialParameters) => track(new THREE.MeshPhysicalMaterial(p))
  // varnished oak: grain and plank seams in the bump, a clear coat that catches the spotlights
  const mFloor = phys({
    color: 0xf2e6d6,
    map: woodFloor,
    bumpMap: woodFloor,
    bumpScale: 0.6,
    roughness: 0.55,
    clearcoat: 0.65,
    clearcoatRoughness: 0.22,
  })
  const mCeil = std({ color: 0xf1efea, roughness: 1 })
  const mBase = std({ color: 0x2a2c2b, roughness: 0.5 })
  const mWalnut = phys({ map: woodDark, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.35 })
  const mLip = std({ color: 0xc9a86a, roughness: 0.28, metalness: 1 })
  const mMat = std({ color: 0xf3f2ec, roughness: 0.95 })
  const mSteel = std({ color: 0xc4c9c6, roughness: 0.18, metalness: 1 })
  const mBlack = std({ color: 0x17191a, roughness: 0.4, metalness: 0.6 })
  const mLeather = phys({ color: 0x2a2421, roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: 0x5a4a40 })
  const mVelvet = phys({ color: 0x163f33, roughness: 0.9, sheen: 1, sheenRoughness: 0.45, sheenColor: 0x4fa287 })
  const mLens = track(new THREE.MeshBasicMaterial({ color: 0xfff1d6 }))
  // glass over each painting: almost invisible, but it carries the studio reflection
  const mGlass = phys({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.06, envMapIntensity: 2 })
  // The sky outside the roof lights: a day sky (bright, warmer near the sun) and a night sky with stars.
  const daySky = canvasTex(512, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#7fb0e0')
    gr.addColorStop(0.6, '#b8d5ef')
    gr.addColorStop(1, '#f4f1e6')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 14; i++) {
      const x = rnd(0, w)
      const y = rnd(0, h)
      const c = g.createRadialGradient(x, y, 0, x, y, rnd(40, 110))
      c.addColorStop(0, 'rgba(255,255,255,.55)')
      c.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = c
      g.fillRect(0, 0, w, h)
    }
  })
  const nightSky = canvasTex(512, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#05070d')
    gr.addColorStop(1, '#141c2c')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(230,236,255,${rnd(0.25, 0.9)})`
      const r = rnd(0.5, 1.4)
      g.beginPath()
      g.arc(rnd(0, w), rnd(0, h), r, 0, Math.PI * 2)
      g.fill()
    }
  })
  // brighter than 1 by day, so the open sky blooms a little through the glass
  const mSky = track(new THREE.MeshBasicMaterial({ map: daySky, toneMapped: false, side: THREE.DoubleSide }))
  const mRoofGlass = phys({ color: 0xe8f0f2, roughness: 0.08, transparent: true, opacity: 0.18, envMapIntensity: 1.5, side: THREE.DoubleSide })
  const mMullion = std({ color: 0x8c928f, roughness: 0.4, metalness: 0.8 })
  // night fittings: recessed downlight lenses and the cove line along the top of the walls
  const mDownlight = track(new THREE.MeshBasicMaterial({ color: 0xfff3dc, toneMapped: false }))
  const mCove = track(new THREE.MeshBasicMaterial({ color: 0xffe9c4, toneMapped: false }))
  // the next room through the doorway: a warm lit corridor fading into the distance
  const doorTex = canvasTex(256, 360, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h)
    gr.addColorStop(0, '#2c2a26')
    gr.addColorStop(0.55, '#6b645a')
    gr.addColorStop(0.62, '#8a7a64')
    gr.addColorStop(1, '#3b3127')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
    const side = g.createLinearGradient(0, 0, w, 0)
    side.addColorStop(0, 'rgba(0,0,0,.55)')
    side.addColorStop(0.25, 'rgba(0,0,0,0)')
    side.addColorStop(0.75, 'rgba(0,0,0,0)')
    side.addColorStop(1, 'rgba(0,0,0,.55)')
    g.fillStyle = side
    g.fillRect(0, 0, w, h)
    const glow = g.createRadialGradient(w / 2, h * 0.58, 4, w / 2, h * 0.58, w * 0.5)
    glow.addColorStop(0, 'rgba(255,236,200,.75)')
    glow.addColorStop(1, 'rgba(255,236,200,0)')
    g.fillStyle = glow
    g.fillRect(0, 0, w, h)
  })
  const mDoor = track(new THREE.MeshBasicMaterial({ map: doorTex }))
  // contact shadow: a soft dark band where a wall meets the floor (and the ceiling)
  const aoTex = canvasTex(8, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h)
    gr.addColorStop(0, 'rgba(0,0,0,0.42)')
    gr.addColorStop(0.35, 'rgba(0,0,0,0.12)')
    gr.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
  })
  const mAO = track(new THREE.MeshBasicMaterial({ map: aoTex, transparent: true, depthWrite: false, toneMapped: false }))

  interface AddOpts {
    ry?: number
    rx?: number
    cast?: boolean
    recv?: boolean
  }
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], x: number, y: number, z: number, opt: AddOpts = {}) => {
    track(geo)
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    if (opt.ry) m.rotation.y = opt.ry
    if (opt.rx) m.rotation.x = opt.rx
    m.castShadow = !!opt.cast
    m.receiveShadow = opt.recv !== false
    scene.add(m)
    return m
  }

  /* ---------- room shell ---------- */
  const floor = add(new THREE.PlaneGeometry(W, D), mFloor, 0, 0, 0, { rx: -Math.PI / 2 })
  const walls: [number, number, number, number][] = [
    [W, 0, D / 2, Math.PI],
    [W, 0, -D / 2, 0],
    [D, -W / 2, 0, Math.PI / 2],
    [D, W / 2, 0, -Math.PI / 2],
  ]
  walls.forEach(([len, x, z, ry]) => {
    add(new THREE.PlaneGeometry(len, H), mWall, x, H / 2, z, { ry })
    add(new THREE.BoxGeometry(len, 0.16, 0.03), mBase, x, 0.08, z, { ry }).translateZ(0.015)
    add(new THREE.BoxGeometry(len, 0.08, 0.06), mCeil, x, H - 0.04, z, { ry }).translateZ(0.03)
    // contact shadows: up the wall from the skirting, out across the floor, down from the ceiling
    // (the texture is darkest at its top edge, so each band is turned to put that edge in the corner)
    add(new THREE.PlaneGeometry(len, 0.55), mAO, x, 0.16 + 0.275, z, { ry, recv: false }).translateZ(0.034).rotateZ(Math.PI)
    const fl = add(new THREE.PlaneGeometry(len, 0.7), mAO, x, 0.002, z, { ry, recv: false })
    fl.rotateX(-Math.PI / 2)
    fl.translateY(-0.35 - 0.03)
    add(new THREE.PlaneGeometry(len, 0.5), mAO, x, H - 0.08 - 0.25, z, { ry, recv: false }).translateZ(0.062)
  })
  /* ---------- roof: a ceiling slab with four glazed roof lights ---------- */
  // The slab casts the sun's shadow, so daylight only enters through the openings.
  const SKY_Z = [-8, -2, 4, 10]
  const SKY_W = 3.2
  const SKY_D = 2.6
  const SLAB = 0.25
  const WELL = 0.7
  const slab = (w: number, d: number, x: number, z: number) =>
    add(new THREE.BoxGeometry(w, SLAB, d), mCeil, x, H + SLAB / 2, z, { cast: true })
  // the roof overhangs the walls by 4 m so no low sun slips in over the top of a wall
  const EAVE = 4
  const sideW = W / 2 - SKY_W / 2 + EAVE
  slab(sideW, D + 2 * EAVE, -(SKY_W / 2 + sideW / 2), 0)
  slab(sideW, D + 2 * EAVE, SKY_W / 2 + sideW / 2, 0)
  const cuts = [-D / 2 - EAVE, ...SKY_Z.flatMap((z) => [z - SKY_D / 2, z + SKY_D / 2]), D / 2 + EAVE]
  for (let i = 0; i < cuts.length; i += 2) slab(SKY_W, cuts[i + 1] - cuts[i], 0, (cuts[i] + cuts[i + 1]) / 2)
  // beams under the slab (they cross two of the roof lights and stripe the sun patches)
  for (let z = -D / 2 + 2; z <= D / 2 - 2; z += 4) add(new THREE.BoxGeometry(W, 0.28, 0.22), mCeil, 0, H - 0.14, z, { cast: true })
  const shaftDir = new THREE.Vector3(-0.32, 1, 0.22).normalize() // towards the sun
  SKY_Z.forEach((z) => {
    // light well: four white reveals up to the glass
    const wy = H + WELL / 2
    add(new THREE.BoxGeometry(SKY_W, WELL, 0.04), mCeil, 0, wy, z - SKY_D / 2, { cast: true })
    add(new THREE.BoxGeometry(SKY_W, WELL, 0.04), mCeil, 0, wy, z + SKY_D / 2, { cast: true })
    add(new THREE.BoxGeometry(0.04, WELL, SKY_D), mCeil, -SKY_W / 2, wy, z, { cast: true })
    add(new THREE.BoxGeometry(0.04, WELL, SKY_D), mCeil, SKY_W / 2, wy, z, { cast: true })
    // glass and glazing bars (the bars throw the grid you see in the sun patch)
    const gy = H + WELL
    add(new THREE.PlaneGeometry(SKY_W, SKY_D), mRoofGlass, 0, gy, z, { rx: Math.PI / 2, recv: false })
    for (let i = 1; i < 4; i++) add(new THREE.BoxGeometry(0.05, 0.06, SKY_D), mMullion, -SKY_W / 2 + (SKY_W * i) / 4, gy - 0.03, z, { cast: true, recv: false })
    for (let j = 1; j < 3; j++) add(new THREE.BoxGeometry(SKY_W, 0.06, 0.05), mMullion, 0, gy - 0.03, z - SKY_D / 2 + (SKY_D * j) / 3, { cast: true, recv: false })
  })
  // the sky above the roof
  add(new THREE.PlaneGeometry(W * 3, D * 2), mSky, 0, H + 6, 0, { rx: Math.PI / 2, recv: false })

  // the sun, low enough that its patches fall across the floor and catch the foot of a wall
  const sun = new THREE.DirectionalLight(0xfff2dc, 6)
  sun.position.copy(shaftDir).multiplyScalar(30)
  sun.target.position.set(0, 0, 0)
  sun.castShadow = true
  sun.shadow.mapSize.set(SUN_SHADOW, SUN_SHADOW)
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 5, far: 60 })
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.02
  sun.shadow.radius = 4
  sun.shadow.blurSamples = 12
  scene.add(sun, sun.target)

  // visible shafts: an open box per roof light, slanted along the sun, faint dust in the air
  const shaftUniforms = { uStrength: { value: 0.05 } }
  const mShaft = track(
    new THREE.ShaderMaterial({
      uniforms: shaftUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uStrength;
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main() {
          float side = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
          float along = smoothstep(0.0, 0.45, vUv.y) * (0.45 + 0.55 * vUv.y);
          float face = pow(abs(dot(vN, vV)), 1.5);
          gl_FragColor = vec4(vec3(1.0, 0.95, 0.85) * uStrength * side * along * face, 1.0);
        }`,
    }),
  )
  const mHidden = track(new THREE.MeshBasicMaterial({ visible: false }))
  const shafts: THREE.Mesh[] = []
  const shaftLen = (H + WELL) / shaftDir.y
  SKY_Z.forEach((z) => {
    const geo = track(new THREE.BoxGeometry(SKY_W * 0.95, shaftLen, SKY_D * 0.95))
    // side faces only; the end caps would show as hard rectangles
    const m = new THREE.Mesh(geo, [mShaft, mShaft, mHidden, mHidden, mShaft, mShaft])
    const top = new THREE.Vector3(0, H + WELL, z)
    m.position.copy(top).addScaledVector(shaftDir, -shaftLen / 2)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), shaftDir)
    m.layers.set(1)
    m.renderOrder = 3
    scene.add(m)
    shafts.push(m)
  })

  // night lighting: recessed downlights and a warm cove line along the top of every wall
  const DOWN = [-10, -4, 2, 8].flatMap((z) => [-3.4, 3.4].map((x) => [x, z] as const))
  DOWN.forEach(([x, z]) => add(new THREE.CircleGeometry(0.09, 20), mDownlight, x, H - 0.002, z, { rx: Math.PI / 2, recv: false }))
  const house = [-7, 5].flatMap((z) =>
    [-3.4, 3.4].map((x) => {
      const l = new THREE.SpotLight(0xfff3e4, 1, 18, 1.05, 0.85, 1.2)
      l.position.set(x, H - 0.05, z)
      l.target.position.set(x, 0, z)
      scene.add(l, l.target)
      return l
    }),
  )
  walls.forEach(([len, x, z, ry]) => add(new THREE.BoxGeometry(len, 0.025, 0.02), mCove, x, H - 0.1, z, { ry, recv: false }).translateZ(0.07))
  // ceiling tracks the picture lights hang from (two along the long walls, one across the end)
  const RAIL_Y = H - 0.22
  const SIDE_X = W / 2 - 2.6
  const END_Z = -D / 2 + 3.2
  ;[-SIDE_X, SIDE_X].forEach((x) => add(new THREE.BoxGeometry(0.05, 0.04, D - 3), mBlack, x, RAIL_Y, 0.5, { recv: false }))
  add(new THREE.BoxGeometry(4.2, 0.04, 0.05), mBlack, 0, RAIL_Y, END_Z, { recv: false })
  // doorway on the entrance wall, with the next room beyond
  add(new THREE.PlaneGeometry(2.2, 3.1), mDoor, 0, 1.55, D / 2 - 0.01, { ry: Math.PI, recv: false })
  ;[-1.16, 1.16].forEach((x) => add(new THREE.BoxGeometry(0.1, 3.2, 0.12), mBase, x, 1.6, D / 2 - 0.06))
  add(new THREE.BoxGeometry(2.42, 0.1, 0.12), mBase, 0, 3.15, D / 2 - 0.06)
  // benches: a rounded, buttoned leather top on a black steel frame
  const bench = (x: number, z: number) => {
    add(new RoundedBoxGeometry(2.6, 0.14, 0.62, 4, 0.05), mLeather, x, 0.5, z, { cast: true })
    for (let i = -3; i <= 3; i++)
      [-0.13, 0.13].forEach((dz) => add(new THREE.SphereGeometry(0.012, 8, 6), mBlack, x + i * 0.36, 0.572, z + dz, { recv: false }))
    ;[-1.1, 1.1].forEach((dx) => {
      add(new THREE.BoxGeometry(0.04, 0.43, 0.04), mBlack, x + dx, 0.215, z - 0.25, { cast: true })
      add(new THREE.BoxGeometry(0.04, 0.43, 0.04), mBlack, x + dx, 0.215, z + 0.25, { cast: true })
      add(new THREE.BoxGeometry(0.04, 0.04, 0.54), mBlack, x + dx, 0.06, z, { cast: true })
      add(new THREE.BoxGeometry(0.04, 0.04, 0.54), mBlack, x + dx, 0.41, z, { cast: true })
    })
  }
  bench(0, 1)
  bench(0, -7)
  // stanchions (turned steel: weighted base, post, collar, ball) and the velvet rope
  const ropeZ = -D / 2 + 1.9
  const posts = [-2.2, 0, 2.2]
  const postProfile = [
    [0, 0],
    [0.17, 0],
    [0.18, 0.012],
    [0.16, 0.03],
    [0.06, 0.05],
    [0.035, 0.08],
    [0.032, 0.85],
    [0.045, 0.87],
    [0.045, 0.9],
    [0.03, 0.92],
  ].map(([r, y]) => new THREE.Vector2(r, y))
  posts.forEach((x) => {
    add(new THREE.LatheGeometry(postProfile, 32), mSteel, x, 0, ropeZ, { cast: true })
    add(new THREE.SphereGeometry(0.055, 24, 16), mSteel, x, 0.965, ropeZ, { cast: true })
  })
  for (let i = 0; i < posts.length - 1; i++) {
    const a = new THREE.Vector3(posts[i], 0.89, ropeZ)
    const b = new THREE.Vector3(posts[i + 1], 0.89, ropeZ)
    const m = a.clone().lerp(b, 0.5)
    m.y = 0.72
    add(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, m, b), 48, 0.03, 12), mVelvet, 0, 0, 0, { cast: true })
  }

  const hemi = new THREE.HemisphereLight(0xf4f1ea, 0x5a524a, 0.5 * LUX)
  scene.add(hemi)

  /* ---------- light beams ---------- */
  // A faint additive cone from each fixture: brightest near the lamp, soft at the edges.
  const beamUniforms = { uStrength: { value: 0.05 } }
  const mBeam = track(
    new THREE.ShaderMaterial({
      uniforms: beamUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying float vAlong; varying vec3 vN; varying vec3 vV;
        void main() {
          vAlong = uv.y;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uStrength;
        varying float vAlong; varying vec3 vN; varying vec3 vV;
        void main() {
          float edge = pow(abs(dot(vN, vV)), 2.2);
          float fall = pow(vAlong, 1.6) * smoothstep(1.0, 0.92, vAlong);
          gl_FragColor = vec4(vec3(1.0, 0.93, 0.8) * uStrength * edge * fall, 1.0);
        }`,
    }),
  )

  /* ---------- paintings ---------- */
  // The route: the left wall front to back, the featured project alone on the big back wall, then
  // the right wall back to front. Side paintings are spread evenly between z 6.2 and -6.
  const F = Math.max(0, projects.findIndex((p) => p.featured))
  const sideZ = (k: number, n: number) => (n === 1 ? 0.1 : 6.2 - (k * 12.2) / (n - 1))
  const SPOTS = projects.map((_, i) =>
    i < F
      ? { x: -W / 2, z: sideZ(i, F), ry: Math.PI / 2, big: false }
      : i === F
        ? { x: 0, z: -D / 2, ry: 0, big: true }
        : { x: W / 2, z: sideZ(N - 1 - i, N - F - 1), ry: -Math.PI / 2, big: false },
  )
  const loader = new THREE.TextureLoader()
  const hits: THREE.Object3D[] = []
  const stands: { pos: THREE.Vector3; look: THREE.Vector3 }[] = []
  const spotLights: THREE.SpotLight[] = []
  const beams: THREE.Mesh[] = []
  const placards: [THREE.CanvasTexture, Project, number][] = []

  const FONT_DISPLAY = '"Bricolage Grotesque Variable", "Hanken Grotesk", sans-serif'
  const FONT_MONO = '"IBM Plex Mono", monospace'
  const FONT_BODY = '"Hanken Grotesk", sans-serif'

  function wrapLines(g: CanvasRenderingContext2D, text: string, maxW: number) {
    const lines: string[] = []
    let cur = ''
    text.split(' ').forEach((w) => {
      const t = cur ? `${cur} ${w}` : w
      if (g.measureText(t).width > maxW && cur) {
        lines.push(cur)
        cur = w
      } else cur = t
    })
    if (cur) lines.push(cur)
    return lines
  }
  function drawPlacard(tex: THREE.CanvasTexture, p: Project, i: number) {
    const c = tex.image as HTMLCanvasElement
    const g = c.getContext('2d')!
    const w = c.width
    const h = c.height
    g.fillStyle = '#F7F8F5'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#151817'
    g.font = `700 54px ${FONT_DISPLAY}`
    g.fillText(p.title, 40, 86)
    g.fillStyle = '#565C59'
    g.font = `400 25px ${FONT_MONO}`
    let y = 136
    wrapLines(g, `${p.role}, ${p.type.toLowerCase()}`, w - 80).forEach((l) => {
      g.fillText(l, 40, y)
      y += 34
    })
    g.fillText(p.when, 40, y)
    y += 34
    g.fillStyle = '#151817'
    wrapLines(g, p.tools.join(' / '), w - 80).forEach((l) => {
      g.fillText(l, 40, y)
      y += 34
    })
    g.fillStyle = '#1E6B57'
    g.font = `600 26px ${FONT_BODY}`
    g.fillText(`No. ${i + 1}. Click the painting to open`, 40, h - 40)
    tex.needsUpdate = true
  }
  function frameGroup(fw: number, fh: number) {
    const g = new THREE.Group()
    const b = 0.16
    const d = 0.1
    const bars: [number, number, number, number][] = [
      [fw, b, 0, (fh - b) / 2],
      [fw, b, 0, -(fh - b) / 2],
      [b, fh - 2 * b, -(fw - b) / 2, 0],
      [b, fh - 2 * b, (fw - b) / 2, 0],
    ]
    bars.forEach(([w, h, x, y]) => {
      const m = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), mWalnut)
      m.position.set(x, y, d / 2)
      m.castShadow = true
      m.receiveShadow = true
      g.add(m)
    })
    // gilded inner lip
    const lw = 0.025
    const iw = fw - 2 * b
    const ih = fh - 2 * b
    const lips: [number, number, number, number][] = [
      [iw, lw, 0, (ih - lw) / 2],
      [iw, lw, 0, -(ih - lw) / 2],
      [lw, ih, -(iw - lw) / 2, 0],
      [lw, ih, (iw - lw) / 2, 0],
    ]
    lips.forEach(([w, h, x, y]) => {
      const m = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, 0.03)), mLip)
      m.position.set(x, y, 0.075)
      g.add(m)
    })
    const back = new THREE.Mesh(track(new THREE.PlaneGeometry(iw, ih)), mMat)
    back.position.z = 0.06
    back.receiveShadow = true
    g.add(back)
    return g
  }

  let dirty = true
  let loadedArt = 0
  projects.forEach((p, i) => {
    const s = SPOTS[i]
    const k = s.big ? 1.35 : 1
    const fw = 2.2 * k
    const fh = 2.75 * k
    const grp = frameGroup(fw, fh)
    const tex = track(
      loader.load(p.image, () => {
        // once every painting is in, capture the reflections again so they include the art
        if (++loadedArt === N) captureReflections()
        dirty = true
        kick()
      }),
    )
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = maxAniso
    const art = new THREE.Mesh(track(new THREE.PlaneGeometry(1.45 * k, 1.45 * k)), std({
        map: tex,
        roughness: 0.85,
        // a matte print: no room reflections on the art itself (the glass carries those), and a
        // little of its own colour so the spotlight never washes the brand colours out
        envMapIntensity: 0,
        emissive: 0xffffff,
        emissiveMap: tex,
        emissiveIntensity: 0.12,
      }))
    art.position.set(0, 0.12 * k, 0.062)
    art.receiveShadow = true
    grp.add(art)
    // glazing across the whole window of the frame
    const glass = new THREE.Mesh(track(new THREE.PlaneGeometry(fw - 0.32, fh - 0.32)), mGlass)
    glass.position.z = 0.092
    grp.add(glass)
    const ptex = canvasTex(640, 400, () => {})
    drawPlacard(ptex, p, i)
    placards.push([ptex, p, i])
    const face = std({ map: ptex, roughness: 0.8 })
    const plq = new THREE.Mesh(track(new THREE.BoxGeometry(0.6, 0.375, 0.012)), [mMat, mMat, mMat, mMat, face, mMat])
    plq.position.set(fw / 2 + 0.5, -0.55 * k, 0.006)
    plq.castShadow = true
    grp.add(plq)
    grp.position.set(s.x, 2.05 + (k - 1) * 0.55, s.z)
    grp.rotation.y = s.ry
    grp.translateZ(0.005)
    scene.add(grp)
    grp.traverse((m) => {
      if ((m as THREE.Mesh).isMesh) {
        m.userData.i = i
        hits.push(m)
      }
    })
    const n = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), s.ry)
    const sp = new THREE.SpotLight(0xffefd2, 2.4 * LUX, 12, s.big ? 0.38 : 0.34, 0.65, 1.3)
    const off = s.big ? 3.2 : 2.6
    // hangs 0.38 m below its ceiling track
    sp.position.set(s.x + n.x * off, RAIL_Y - 0.38, s.z + n.z * off)
    sp.target.position.copy(grp.position).add(new THREE.Vector3(0, -0.15, 0))
    sp.castShadow = true
    sp.shadow.mapSize.set(SHADOW, SHADOW)
    sp.shadow.bias = -0.0004
    sp.shadow.radius = 7
    sp.shadow.blurSamples = 12
    sp.shadow.camera.near = 0.5
    sp.shadow.camera.far = 12
    scene.add(sp, sp.target)
    spotLights.push(sp)
    // track fixture: adapter on the rail, a stem, and a can aimed at the painting with a glowing lens
    add(new THREE.BoxGeometry(0.08, 0.05, 0.08), mBlack, sp.position.x, RAIL_Y - 0.035, sp.position.z, { recv: false })
    add(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), mBlack, sp.position.x, RAIL_Y - 0.2, sp.position.z, { recv: false })
    const fx = new THREE.Group()
    const can = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.075, 0.28, 24)), mBlack)
    can.rotation.x = Math.PI / 2
    fx.add(can)
    const lens = new THREE.Mesh(track(new THREE.CircleGeometry(0.085, 24)), mLens)
    lens.position.z = 0.141
    fx.add(lens)
    fx.position.copy(sp.position)
    fx.lookAt(sp.target.position)
    scene.add(fx)
    // the visible beam, from the lens to just short of the wall
    const toArt = sp.target.position.clone().sub(sp.position)
    const len = toArt.length() * 0.92
    const beamGeo = track(new THREE.ConeGeometry(len * Math.tan(sp.angle) * 0.8, len, 40, 1, true))
    beamGeo.translate(0, -len / 2, 0)
    const beam = new THREE.Mesh(beamGeo, mBeam)
    beam.position.copy(sp.position)
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), toArt.normalize())
    beam.renderOrder = 2
    beam.layers.set(1)
    beams.push(beam)
    scene.add(beam)
    const dist = s.big ? 5.6 : 4.4
    stands.push({ pos: new THREE.Vector3(s.x + n.x * dist, EYE, s.z + n.z * dist), look: grp.position.clone() })
  })

  // wall vinyl near the entrance
  function drawTitle(tex: THREE.CanvasTexture, dark: boolean) {
    const c = tex.image as HTMLCanvasElement
    const g = c.getContext('2d')!
    g.clearRect(0, 0, c.width, c.height)
    g.fillStyle = dark ? '#E6E9E4' : '#151817'
    g.font = `800 128px ${FONT_DISPLAY}`
    g.fillText('Selected', 40, 170)
    g.fillText('work', 40, 296)
    g.font = `400 34px ${FONT_MONO}`
    g.fillStyle = dark ? '#9BA39E' : '#565C59'
    g.fillText('Ravellino Suwandi, 2024 - 2026', 44, 384)
    tex.needsUpdate = true
  }
  const titleTex = canvasTex(1024, 512, () => {})
  drawTitle(titleTex, false)
  const titleMat = std({ map: titleTex, transparent: true, roughness: 0.9 })
  add(new THREE.PlaneGeometry(3.6, 1.8), titleMat, W / 2 - 0.01, 2.5, 10.9, { ry: -Math.PI / 2 })

  /* ---------- theme and hover ---------- */
  let spotLevel = 1.75 * LUX
  let hoverIdx = -1
  // The painting under the pointer gets a little more light, like a curator turning it up.
  function setSpots() {
    spotLights.forEach((l, i) => (l.intensity = spotLevel * (i === hoverIdx ? 1.35 : 1)))
  }
  // Reflections are captured from the room itself (from eye height in the middle of the room),
  // so the floor varnish, glass and steel reflect these walls, roof lights and lamps.
  const envPmrem = new THREE.PMREMGenerator(renderer)
  let roomEnvTarget: THREE.WebGLRenderTarget | null = null
  function captureReflections() {
    const next = envPmrem.fromScene(scene, 0.02, 0.1, 60, { size: 64, position: new THREE.Vector3(0, EYE, 0) })
    scene.environment = next.texture
    roomEnvTarget?.dispose()
    roomEnvTarget = next
  }

  // The costly part of a theme change (re-capturing reflections, redrawing shadows) waits until
  // the page's circular theme reveal has finished, so the switch itself never stalls.
  let heavyTimer = 0
  let themed = false
  function refreshLightingCaches() {
    renderer.shadowMap.needsUpdate = true
    captureReflections()
    renderer.shadowMap.needsUpdate = true
    dirty = true
    kick()
  }

  /** Day and Night change only the light and the sky; the room keeps its colours. */
  function setTheme(dark: boolean) {
    mSky.map = dark ? nightSky : daySky
    mSky.color.setScalar(dark ? 1 : 1.6)
    mSky.needsUpdate = true
    // day: sun through the roof lights in a shaded room; night: the room is lit from inside
    sun.intensity = 7.5
    sun.visible = !dark
    shafts.forEach((m) => (m.visible = !dark))
    shaftUniforms.uStrength.value = 0.07
    hemi.color.set(dark ? 0xfff6ec : 0xe4ecf2)
    // the bounce off the floor and walls lights the ceiling: keep it a neutral warm grey, not brown
    hemi.groundColor.set(dark ? 0xb8ab9b : 0x9c948a)
    hemi.intensity = (dark ? 0.55 : 0.2) * LUX
    house.forEach((l) => {
      l.intensity = 2.7 * LUX
      l.visible = dark
    })
    mDownlight.color.setScalar(dark ? 2.2 : 0.55)
    mCove.color.set(0xffe9c4).multiplyScalar(dark ? 2.4 : 0.35)
    spotLevel = (dark ? 2.6 : 2.1) * LUX
    beamUniforms.uStrength.value = dark ? 0.07 : 0.035
    scene.environmentIntensity = dark ? 0.55 : 0.45
    setSpots()
    renderer.setClearColor(0x0b0d0c)
    window.clearTimeout(heavyTimer)
    if (!themed) {
      themed = true
      refreshLightingCaches()
    } else {
      // shadows only depend on which lights are on: redraw them now (cheap), reflections later
      renderer.shadowMap.needsUpdate = true
      dirty = true
      kick()
      heavyTimer = window.setTimeout(refreshLightingCaches, 650)
    }
  }

  /* ---------- camera and input ---------- */
  let yaw = 0
  let pitch = -0.03
  let tYaw = yaw
  let tPitch = pitch
  cam.position.set(0, EYE, 10.5)
  const keys: Record<string, boolean> = {}
  type Glide = { t0: number; ms: number; p0: THREE.Vector3; p1: THREE.Vector3; y0: number; y1: number; q0: number; q1: number }
  let glide: Glide | null = null
  let active = true
  let visible = false
  let focusIdx = -1
  let tour = -1
  const blocks: [number, number, number, number][] = [
    [0, 1, 1.6, 0.6],
    [0, -7, 1.6, 0.6],
    [0, ropeZ, 2.4, 0.35],
  ]
  const clampPos = (v: THREE.Vector3) => {
    v.x = Math.max(-W / 2 + 0.7, Math.min(W / 2 - 0.7, v.x))
    v.z = Math.max(-D / 2 + 0.9, Math.min(D / 2 - 0.9, v.z))
    blocks.forEach(([bx, bz, hx, hz]) => {
      const dx = v.x - bx
      const dz = v.z - bz
      if (Math.abs(dx) < hx && Math.abs(dz) < hz) {
        if (hx - Math.abs(dx) < hz - Math.abs(dz)) v.x = bx + Math.sign(dx || 1) * hx
        else v.z = bz + Math.sign(dz || 1) * hz
      }
    })
    return v
  }
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const yawTo = (from: THREE.Vector3, to: THREE.Vector3) => {
    const d = Math.atan2(to.x - from.x, to.z - from.z)
    return Math.atan2(Math.sin(d + Math.PI), Math.cos(d + Math.PI))
  }
  function glideTo(pos: THREE.Vector3, look: THREE.Vector3 | null, ms = 1300) {
    const endYaw = look ? yawTo(pos, look) : tYaw
    let dy = endYaw - tYaw
    dy = Math.atan2(Math.sin(dy), Math.cos(dy))
    const endPitch = look ? Math.atan2(look.y - EYE, Math.hypot(look.x - pos.x, look.z - pos.z)) * 0.9 : 0
    glide = { t0: performance.now(), ms: reduced ? 1 : ms, p0: cam.position.clone(), p1: clampPos(pos.clone()), y0: tYaw, y1: tYaw + dy, q0: tPitch, q1: endPitch }
    kick()
  }
  function goPainting(i: number) {
    tour = ((i % N) + N) % N
    glideTo(stands[tour].pos, stands[tour].look)
  }

  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let down: { x: number; y: number; yaw: number; pitch: number } | null = null
  let dragged = false
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY, yaw: tYaw, pitch: tPitch }
    dragged = false
    kick()
  }
  const onMove = (e: PointerEvent) => {
    if (!down) {
      if (e.pointerType !== 'mouse') return
      const r = canvas.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, cam)
      const h = ray.intersectObjects(hits)[0]
      const i = h && h.distance < 14 ? (h.object.userData.i as number) : -1
      if (i !== hoverIdx) {
        hoverIdx = i
        canvas.style.cursor = i >= 0 ? 'pointer' : ''
        setSpots()
        dirty = true
        kick()
      }
      return
    }
    const dx = e.clientX - down.x
    const dy = e.clientY - down.y
    if (!dragged && Math.hypot(dx, dy) > 5) {
      dragged = true
      container.classList.add('is-dragging')
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {
        /* pointer already gone */
      }
      o.onInteract()
    }
    if (!dragged) return
    glide = null
    tYaw = down.yaw + dx * 0.0042
    tPitch = Math.max(-0.55, Math.min(0.5, down.pitch + dy * 0.0032))
    kick()
  }
  const onUp = (e: PointerEvent) => {
    if (!down) return
    container.classList.remove('is-dragging')
    if (!dragged && e.type === 'pointerup') {
      const r = canvas.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, cam)
      const h = ray.intersectObjects([...hits, floor])[0]
      if (h) {
        const i = h.object.userData.i as number | undefined
        if (i !== undefined) {
          if (tour === i && cam.position.distanceTo(stands[i].pos) < 0.4) o.onOpen(i)
          else goPainting(i)
        } else if (h.object === floor) {
          tour = -1
          glideTo(new THREE.Vector3(h.point.x, EYE, h.point.z), null, 1000)
        }
        o.onInteract()
      }
    }
    down = null
  }
  const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']
  const onKeyDown = (e: KeyboardEvent) => {
    // Only when the room itself has focus, so the page keeps its own keys.
    if (e.target !== container) return
    const k = e.key.toLowerCase()
    if (MOVE_KEYS.includes(k)) {
      keys[k] = true
      e.preventDefault()
      glide = null
      tour = -1
      o.onInteract()
      kick()
    }
    if (k === 'enter' && focusIdx >= 0) o.onOpen(focusIdx)
  }
  const onKeyUp = (e: KeyboardEvent) => {
    keys[e.key.toLowerCase()] = false
  }
  const onBlur = () => {
    for (const k in keys) keys[k] = false
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  container.addEventListener('keydown', onKeyDown)
  container.addEventListener('keyup', onKeyUp)
  container.addEventListener('blur', onBlur)

  function resize() {
    const r = container.getBoundingClientRect()
    if (!r.width) return
    renderer.setSize(r.width, r.height, false)
    composer?.setSize(r.width, r.height)
    bloom.resolution.set(r.width / 3, r.height / 3)
    cam.aspect = r.width / r.height
    cam.updateProjectionMatrix()
    dirty = true
    kick()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  const io = new IntersectionObserver(
    ([en]) => {
      visible = en.isIntersecting
      if (visible) kick()
    },
    { threshold: 0.05 },
  )
  io.observe(container)

  /* ---------- frame loop (on demand) ---------- */
  const fwd = new THREE.Vector3()
  const right = new THREE.Vector3()
  const look = new THREE.Vector3()
  const to = new THREE.Vector3()
  let last = performance.now()
  let running = false
  let raf = 0
  function kick() {
    if (!running && visible && active) {
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    let moving = false
    const f = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0)
    const s = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0)
    if (glide) {
      const t = Math.min(1, (now - glide.t0) / glide.ms)
      const e = ease(t)
      cam.position.lerpVectors(glide.p0, glide.p1, e)
      tYaw = glide.y0 + (glide.y1 - glide.y0) * e
      tPitch = glide.q0 + (glide.q1 - glide.q0) * e
      yaw = tYaw
      pitch = tPitch
      // a slight step rhythm while walking
      cam.position.y = EYE + (reduced ? 0 : Math.sin(t * Math.PI * 6) * 0.018 * Math.sin(t * Math.PI))
      if (t >= 1) glide = null
      moving = true
    } else {
      if (f || s) {
        fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw))
        right.set(Math.cos(yaw), 0, -Math.sin(yaw))
        cam.position.addScaledVector(fwd, f * 3.2 * dt).addScaledVector(right, s * 2.8 * dt)
        clampPos(cam.position)
        moving = true
      }
      const ky = reduced ? 1 : 0.18
      yaw += (tYaw - yaw) * ky
      pitch += (tPitch - pitch) * ky
      if (Math.abs(tYaw - yaw) > 0.0005 || Math.abs(tPitch - pitch) > 0.0005) moving = true
      cam.position.y = EYE + ((f || s) && !reduced ? Math.sin(now / 140) * 0.022 : 0)
    }
    cam.rotation.set(pitch, yaw, 0)
    // Which painting is the visitor looking at?
    let best = -1
    let bestScore = 0.2
    cam.getWorldDirection(look)
    stands.forEach((st, i) => {
      to.copy(st.look).sub(cam.position)
      const d = to.length()
      to.normalize()
      const score = look.dot(to) - d * 0.045
      if (d < 9 && score > bestScore) {
        best = i
        bestScore = score
      }
    })
    if (best !== focusIdx) {
      focusIdx = best
      o.onFocus(best)
      if (best >= 0 && !glide) tour = best
    }
    if (moving || dirty) {
      if (composer) composer.render()
      else renderer.render(scene, cam)
      dirty = false
    }
    if (visible && active && (moving || glide || f || s)) raf = requestAnimationFrame(frame)
    else running = false
  }

  // Canvas text needs the web fonts; redraw once they are in.
  let disposed = false
  document.fonts?.ready.then(() => {
    if (disposed) return
    placards.forEach(([t, p, i]) => drawPlacard(t, p, i))
    drawTitle(titleTex, false)
    dirty = true
    kick()
  })
  resize()
  cam.rotation.set(pitch, yaw, 0)

  return {
    setActive(v) {
      active = v
      if (v) resize()
    },
    setTheme,
    goPainting,
    step(dir) {
      goPainting(tour < 0 ? (dir > 0 ? 0 : N - 1) : tour + dir)
    },
    dispose() {
      disposed = true
      window.clearTimeout(heavyTimer)
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      container.removeEventListener('keydown', onKeyDown)
      container.removeEventListener('keyup', onKeyUp)
      container.removeEventListener('blur', onBlur)
      disposables.forEach((d) => d.dispose())
      envTex.dispose()
      roomEnvTarget?.dispose()
      envPmrem.dispose()
      composer?.dispose()
      bloom.dispose()
      renderer.dispose()
    },
  }
}

