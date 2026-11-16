import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { mouse } from '../lib/mouse'
import { attention } from '../lib/attention'
import { scroll } from '../lib/scroll'
import { sentinel } from '../lib/sentinel'

const MODEL = `${import.meta.env.BASE_URL}models/spark.glb`
const DRACO = `${import.meta.env.BASE_URL}draco/`

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ *
 *  The scan
 *
 *  One scan is a complete look-around, not a nudge: he turns toward the
 *  page and locks, sweeps all the way across to the other side and locks
 *  again, then comes back to rest.
 *
 *  It is fired, not free-running. <SentinelLayer /> requests one when he
 *  lands — after the entry flight, and on arrival at contact — so every
 *  cameo is guaranteed exactly one, whatever the reader's timing. After
 *  that it repeats on a slow interval, only while he is on screen (the
 *  render loop is stopped while he is parked, so the timer is too) and
 *  only while the pointer is quiet — a moving cursor always has his eye.
 *
 *  What makes it legible on an object this small:
 *    - the sweep is centred on wherever he is currently resting, so both
 *      sides are the same size of turn
 *    - the body swings and rolls with the head, so the silhouette changes
 *    - the cursor is ignored entirely while he is busy
 *    - the eye flares at each lock, so the pause reads as a lock
 * ------------------------------------------------------------------ */
const SCAN_DUR = 3.8
const SCAN_ARC = 0.85
const SCAN_IDLE_EVERY = 11

/* Fractions of the scan:  out | lock | sweep across | lock | return */
const S_OUT = 0.16
const S_LOCK1 = 0.34
const S_SWEEP = 0.66
const S_LOCK2 = 0.82

function ease(k: number) {
  const c = THREE.MathUtils.clamp(k, 0, 1)
  return c * c * (3 - 2 * c)
}

/** Signed position through one scan: 0 -> 1 (hold) -> -1 (hold) -> 0. */
function scanShape(u: number) {
  if (u < S_OUT) return ease(u / S_OUT)
  if (u < S_LOCK1) return 1
  if (u < S_SWEEP) return 1 - 2 * ease((u - S_LOCK1) / (S_SWEEP - S_LOCK1))
  if (u < S_LOCK2) return -1
  return -1 + ease((u - S_LOCK2) / (1 - S_LOCK2))
}

/** 0 -> 1 -> 0: how fully the scan owns him. */
function scanBusy(u: number) {
  return ease(u / S_OUT) * (1 - ease((u - S_LOCK2) / (1 - S_LOCK2)))
}

/** A sharp pulse at the start of each lock, decaying over ~a quarter second. */
function scanLock(u: number) {
  let v = 0
  for (const at of [S_OUT, S_SWEEP]) {
    const since = (u - at) * SCAN_DUR
    if (since >= 0) v += Math.exp(-since / 0.28)
  }
  return v
}

function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function Model({ onReady }: { onReady?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])
  const { gl } = useThree()
  const { scene } = useGLTF(MODEL, DRACO)

  /* Loop-local state. `time` is our own clock, advanced by clamped deltas, so
     stopping the render loop while he is parked pauses it rather than letting
     it jump on resume. */
  const rig = useRef({
    time: 0,
    scanStart: -1,
    lastScanEnd: 0,
    seenRequests: sentinel.scanRequests,
    cursorWeight: 0,
    drawn: 0,
    announced: false,
  })

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy()
    const found: THREE.MeshStandardMaterial[] = []

    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const mat = m.material as THREE.MeshStandardMaterial
      if (!mat) return

      mat.metalness = 0.88
      mat.roughness = 0.33
      mat.envMapIntensity = 1.35

      // Anisotropic filtering — the shell is full of long shallow panel
      // lines, and without this they alias into shimmer at glancing angles,
      // which is most of what makes a small 3D element look cheap.
      for (const key of [
        'map',
        'normalMap',
        'roughnessMap',
        'metalnessMap',
        'emissiveMap',
      ] as const) {
        const tex = mat[key] as THREE.Texture | null
        if (tex) {
          tex.anisotropy = maxAniso
          tex.needsUpdate = true
        }
      }

      if (mat.normalMap) mat.normalScale = new THREE.Vector2(0.85, 0.85)

      // The bundled lighting map isolates the eye and the panel strips, so
      // it stays as an emissive mask — we just drive its intensity.
      mat.emissive = new THREE.Color('#8FD8FF')
      mat.emissiveIntensity = 1.6
      mat.needsUpdate = true
      found.push(mat)
    })

    mats.current = found

    const box = new THREE.Box3().setFromObject(scene)
    scene.position.sub(box.getCenter(new THREE.Vector3()))
  }, [scene, gl])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const r = rig.current
    const d = Math.min(delta, 0.05)
    r.time += d
    const t = r.time
    sentinel.frames += 1

    /* Tell the layer once the model is on screen for real: materials set,
       and a couple of frames actually drawn. The entry flight waits on it. */
    if (!r.announced && mats.current.length > 0 && ++r.drawn > 2) {
      r.announced = true
      onReady?.()
    }

    /* The cursor comes first: while the pointer is moving he follows it,
       and the idle scan waits. Only the two landing scans may interrupt. */
    const fresh = mouse.active && performance.now() - mouse.lastMove < 3200

    /* ---- 1. the scan ------------------------------------------------ */
    if (sentinel.scanRequests !== r.seenRequests) {
      r.seenRequests = sentinel.scanRequests
      if (!REDUCED && r.scanStart < 0) r.scanStart = t
    }
    const travelling = Math.abs(sentinel.travel) > 0.08
    if (
      !REDUCED &&
      r.scanStart < 0 &&
      !travelling &&
      !fresh &&
      t - r.lastScanEnd > SCAN_IDLE_EVERY
    ) {
      r.scanStart = t
    }
    let u = -1
    if (r.scanStart >= 0) {
      u = (t - r.scanStart) / SCAN_DUR
      if (u >= 1) {
        u = -1
        r.scanStart = -1
        r.lastScanEnd = t
      }
    }
    const scanning = u >= 0
    const shape = scanning ? scanShape(u) : 0
    const busy = scanning ? scanBusy(u) : 0
    const lock = scanning ? scanLock(u) : 0

    /* ---- 2. the standing bias --------------------------------------
       He sits in the right margin, so once the page starts moving he
       turns inward to face the column of text rather than the reader. */
    const inward = -0.5 * smoothstep(0.015, 0.2, scroll.progress)

    /* ---- 3. the cursor, when there is one --------------------------
       Dropped to nothing while a scan runs — he is busy — and handed back
       over ~400ms afterwards so the gaze does not snap to the pointer. */
    const wantCursor = fresh && !scanning ? 1 : 0
    // Let go quickly for a scan, but slowly when the pointer simply goes
    // quiet — otherwise he visibly loses interest the moment it stops.
    const release = scanning ? 0.12 : 1.4
    r.cursorWeight =
      wantCursor > r.cursorWeight
        ? Math.min(1, r.cursorWeight + d / 0.4)
        : Math.max(0, r.cursorWeight - d / release)
    const cursorWeight = r.cursorWeight
    const cursorYaw = THREE.MathUtils.clamp(mouse.x * 0.8, -0.6, 0.6)
    const cursorPitch = THREE.MathUtils.clamp(mouse.y * 0.55, -0.36, 0.36)

    /* ---- 4. idle drift, so he is never perfectly still -------------- */
    const idle = (1 - cursorWeight) * (1 - busy)
    const driftYaw = Math.sin(t * 0.21) * 0.2 * idle
    const driftPitch = Math.sin(t * 0.14) * 0.07 * idle

    /* ---- 5. scroll velocity: a slight brace when the page moves ----- */
    const v = THREE.MathUtils.clamp(scroll.velocity, -1.6, 1.6)

    /* ---- 6. travel: bank into the flight ----------------------------
       Arriving he faces the way he is going and leans into it; leaving he
       turns away toward the edge. This is what makes the slide read as him
       moving rather than as the page moving him. */
    const travel = REDUCED ? 0 : THREE.MathUtils.clamp(sentinel.travel, -3, 3)
    const bankYaw = THREE.MathUtils.clamp(travel * 0.26, -0.75, 0.75)
    const bankRoll = THREE.MathUtils.clamp(travel * -0.09, -0.28, 0.28)
    const bankPitch = Math.min(0.16, Math.abs(travel) * 0.05)

    /* Rest pose first, then the scan sweeps symmetrically about it. The
       inward bias is eased off while he scans so the sweep is centred nearer
       the reader and neither side turns the eye out of sight. */
    const restYaw = cursorYaw * cursorWeight + inward + driftYaw
    const centre = restYaw * (1 - 0.55 * busy)
    const scanYaw = -shape * SCAN_ARC // first look is toward the page
    const targetYaw = centre + scanYaw + bankYaw
    const targetPitch =
      cursorPitch * cursorWeight +
      driftPitch +
      Math.abs(shape) * 0.09 +
      bankPitch +
      v * 0.06

    // Lerp rate is frame-rate independent, and deliberately slow — a
    // sentinel that snaps to the cursor reads as a cursor-follower toy.
    const k = 1 - Math.pow(0.001, d * (scanning ? 1.35 : 1))
    g.rotation.y += (targetYaw - g.rotation.y) * k
    g.rotation.x += (targetPitch - g.rotation.x) * k

    // A slow roll, a counter-roll through the scan, and the bank.
    const targetRoll = Math.sin(t * 0.17) * 0.07 * (1 - busy) + scanYaw * -0.24 + bankRoll
    g.rotation.z += (targetRoll - g.rotation.z) * k

    /* ---- 7. body motion --------------------------------------------
       The body swings toward whatever he is looking at, so the scan moves
       the whole silhouette rather than rotating a near-sphere in place. */
    if (!REDUCED) {
      const swing = Math.sin(scanYaw) * 0.2
      const targetX = Math.sin(t * 0.9) * 0.022 + swing
      const targetY = Math.sin(t * 1.35) * 0.055 - v * 0.045 - Math.abs(shape) * 0.03
      g.position.x += (targetX - g.position.x) * k
      g.position.y += (targetY - g.position.y) * k
    }

    /* ---- 8. the eye ------------------------------------------------- */
    const breathe = 1 + Math.sin(t * 1.9) * 0.15 * (1 - busy)
    const scanFlare = 1 + busy * 0.7 + lock * 1.5
    const flare = attention.on ? 2.1 : 1
    const targetE = 1.55 * breathe * scanFlare * flare
    for (const m of mats.current) {
      m.emissiveIntensity += (targetE - m.emissiveIntensity) * Math.min(1, d * 9)
    }
  })

  return (
    <group ref={group} scale={1.05}>
      <primitive object={scene} />
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Reflections
 *
 *  Chrome is only chrome if there is something for it to reflect.
 *  Three's procedural room costs nothing to fetch, so we bake that into
 *  an environment map rather than pulling an HDRI off a CDN — the site
 *  stays self-contained with no third-party request on first paint.
 * ------------------------------------------------------------------ */
function StudioEnv() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.035)
    scene.environment = env.texture
    return () => {
      env.texture.dispose()
      pmrem.dispose()
      scene.environment = null
    }
  }, [gl, scene])

  return null
}

type Props = {
  /** False while he is parked off-screen: the render loop stops entirely. */
  active?: boolean
  /** Called once, when the model has resolved and real frames are drawn. */
  onReady?: () => void
}

export default function Sentinel({ active = true, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      /* Size the drawing buffer from the element's layout box, not its
         on-screen rect. The default measures the *transformed* rect, so a
         parent CSS scale (the entry flight, the scroll shrink) would shrink
         the buffer as well — scaling him twice and leaving him stuck small
         after the flight. */
      resize={{ offsetSize: true, scroll: false }}
      dpr={[1, 2.5]}
      camera={{ position: [0, 0, 4.6], fov: 34 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ pointerEvents: 'none', background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.78
      }}
    >
      <StudioEnv />
      <ambientLight intensity={0.1} />
      {/* key */}
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#E4E8EC" />
      {/* rim from behind-left, faintly sage so it ties to the palette */}
      <directionalLight position={[-5, 1.5, -4]} intensity={1.7} color="#7FA292" />
      {/* a low cool kicker so the underside never goes fully black */}
      <directionalLight position={[0, -3, 2]} intensity={0.5} color="#8FD8FF" />
      <Model onReady={onReady} />
    </Canvas>
  )
}

useGLTF.preload(MODEL, DRACO)
