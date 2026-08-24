import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { mouse } from '../lib/mouse'
import { attention } from '../lib/attention'
import { scroll } from '../lib/scroll'

const MODEL = `${import.meta.env.BASE_URL}models/spark.glb`
const DRACO = `${import.meta.env.BASE_URL}draco/`

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ *
 *  Scan cycle
 *
 *  Every SCAN_EVERY seconds he runs a sweep: the head turns across an
 *  arc, pauses at the far end as though something caught his eye, and
 *  returns. The eye brightens through it. Between scans he holds
 *  whatever the gaze logic asks for.
 *
 *  The pause matters more than the sweep — a head that turns and comes
 *  straight back reads mechanical. A head that turns, holds, and then
 *  returns reads like it looked at something.
 * ------------------------------------------------------------------ */
const SCAN_EVERY = 7.5
const SCAN_DUR = 3.2
const SCAN_ARC = 0.62

/** 0 -> 1 -> 0 with a hold at the top, over the life of one scan. */
function scanEnvelope(u: number) {
  if (u < 0.28) {
    // out
    const k = u / 0.28
    return k * k * (3 - 2 * k)
  }
  if (u < 0.62) return 1 // hold — the part that sells it
  const k = (u - 0.62) / 0.38
  const e = 1 - k
  return e * e * (3 - 2 * e)
}

function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function Model() {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])
  const { gl } = useThree()
  const { scene } = useGLTF(MODEL, DRACO)

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

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const d = Math.min(delta, 0.05)

    /* ---- 1. where the scan wants him to look ---------------------- */
    const phase = (t % SCAN_EVERY) / SCAN_EVERY
    const scanning = phase * SCAN_EVERY < SCAN_DUR
    const u = scanning ? (phase * SCAN_EVERY) / SCAN_DUR : 0
    const env = scanning ? scanEnvelope(u) : 0
    // Alternate which way each sweep goes, so it never loops visibly.
    const dir = Math.floor(t / SCAN_EVERY) % 2 === 0 ? -1 : 1
    const scanYaw = env * SCAN_ARC * dir
    const scanPitch = env * 0.1

    /* ---- 2. the standing bias --------------------------------------
       He sits in the right margin, so once the page starts moving he
       turns inward to face the column of text rather than the reader. */
    const inward = -0.5 * smoothstep(0.015, 0.2, scroll.progress)

    /* ---- 3. the cursor, when there is one --------------------------
       Weighted down while a scan is running — he is busy. */
    const fresh = mouse.active && performance.now() - mouse.lastMove < 3200
    const cursorWeight = fresh ? (scanning ? 0.32 : 1) : 0
    const cursorYaw = THREE.MathUtils.clamp(mouse.x * 0.8, -0.6, 0.6)
    const cursorPitch = THREE.MathUtils.clamp(mouse.y * 0.55, -0.36, 0.36)

    /* ---- 4. idle drift, so he is never perfectly still -------------- */
    const idle = 1 - cursorWeight
    const driftYaw = Math.sin(t * 0.21) * 0.2 * idle
    const driftPitch = Math.sin(t * 0.14) * 0.07 * idle

    /* ---- 5. scroll velocity: a slight brace when the page moves ----- */
    const v = THREE.MathUtils.clamp(scroll.velocity, -1.6, 1.6)

    const targetYaw = cursorYaw * cursorWeight + inward + scanYaw + driftYaw
    const targetPitch =
      cursorPitch * cursorWeight + driftPitch + scanPitch + v * 0.06

    // Lerp rate is frame-rate independent, and deliberately slow — a
    // sentinel that snaps to the cursor reads as a cursor-follower toy.
    const k = 1 - Math.pow(0.001, d * (scanning ? 1.35 : 1))
    g.rotation.y += (targetYaw - g.rotation.y) * k
    g.rotation.x += (targetPitch - g.rotation.x) * k

    // A slow roll, plus a little counter-roll into each scan.
    const targetRoll = Math.sin(t * 0.17) * 0.07 + scanYaw * -0.16
    g.rotation.z += (targetRoll - g.rotation.z) * k

    /* ---- 6. body motion -------------------------------------------- */
    if (!REDUCED) {
      g.position.y = Math.sin(t * 1.35) * 0.055 - v * 0.045
      g.position.x = Math.sin(t * 0.9) * 0.022
    }

    /* ---- 7. the eye ------------------------------------------------- */
    const breathe = 1 + Math.sin(t * 1.9) * 0.15
    const scanFlare = 1 + env * 0.75
    const flare = attention.on ? 2.1 : 1
    const targetE = 1.55 * breathe * scanFlare * flare
    for (const m of mats.current) {
      m.emissiveIntensity += (targetE - m.emissiveIntensity) * Math.min(1, d * 7)
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

export default function Sentinel() {
  return (
    <Canvas
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
      <Model />
    </Canvas>
  )
}

useGLTF.preload(MODEL, DRACO)
