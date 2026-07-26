import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mouse } from '../lib/mouse'
import { attention } from '../lib/attention'

const CYAN = '#4FC9FF'
const PALE = '#A8E8FF'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/*  The monitor itself                                                 */
/* ------------------------------------------------------------------ */
function Monitor({ compact }: { compact: boolean }) {
  const chassis = useRef<THREE.Group>(null)
  const iris = useRef<THREE.Mesh>(null)
  const orbit = useRef<THREE.Mesh>(null)
  const eyeMat = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  const glow = useRef<THREE.Mesh>(null)

  // Fin plates: irregular angles so it reads as constructed, not symmetrical.
  const fins = useMemo(
    () => [
      { rot: [0, 0, 0.9], pos: [0.95, 0.55, -0.1] },
      { rot: [0.3, 0.4, -1.2], pos: [-1.0, 0.35, 0.15] },
      { rot: [0.1, -0.5, 0.2], pos: [0.1, -1.05, -0.2] },
      { rot: [-0.4, 0.8, 0.6], pos: [-0.55, 0.9, -0.55] },
    ],
    []
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = chassis.current
    if (!g) return

    // --- Gaze: rotate toward the cursor, clamped, always lerped never snapped.
    let targetY: number
    let targetX: number

    if (mouse.active && performance.now() - mouse.lastMove < 3000) {
      targetY = THREE.MathUtils.clamp(mouse.x * 0.9, -0.61, 0.61) // ±35°
      targetX = THREE.MathUtils.clamp(mouse.y * 0.7, -0.44, 0.44) // ±25°
    } else {
      // Idle / touch device: slow autonomous scan so it looks alive.
      targetY = Math.sin(t * 0.25) * 0.5
      targetX = Math.sin(t * 0.17) * 0.15
    }

    g.rotation.y += (targetY - g.rotation.y) * 0.06
    g.rotation.x += (targetX - g.rotation.x) * 0.06

    // --- Idle bob
    g.position.y = REDUCED ? 0 : Math.sin(t * 1.6) * 0.12

    // --- Rings
    if (iris.current) iris.current.rotation.z -= delta * 0.15
    if (orbit.current) {
      orbit.current.rotation.z += delta * 0.08
      orbit.current.rotation.x = 1.2 + Math.sin(t * 0.3) * 0.1
    }

    // --- Eye brightness: breathes, flares on `attention`
    const base = 1 + Math.sin(t * 2) * 0.08
    const flare = attention.on ? 1.9 : 1
    if (eyeMat.current) {
      const c = new THREE.Color(CYAN).multiplyScalar(base * flare)
      eyeMat.current.color = c
    }
    if (light.current) light.current.intensity = 14 * base * flare
    if (glow.current) {
      const s = (1 + Math.sin(t * 2) * 0.05) * (attention.on ? 1.25 : 1)
      glow.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={chassis}>
      {/* Chassis — faceted low-poly so it reads as machined, not a ball */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#2A2F38" metalness={0.7} roughness={0.32} />
      </mesh>

      {/* Recessed socket */}
      <mesh position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.12, 24]} />
        <meshStandardMaterial color="#0E1013" metalness={0.9} roughness={0.5} />
      </mesh>

      {/* The eye */}
      <mesh position={[0, 0, 0.92]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshBasicMaterial ref={eyeMat} color={CYAN} toneMapped={false} />
      </mesh>

      {/* Soft glow halo around the eye */}
      <mesh ref={glow} position={[0, 0, 0.9]}>
        <sphereGeometry args={[0.52, 24, 24]} />
        <meshBasicMaterial
          color={PALE}
          transparent
          opacity={0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Iris ring, counter-rotating */}
      <mesh ref={iris} position={[0, 0, 0.95]}>
        <torusGeometry args={[0.5, 0.018, 8, 48]} />
        <meshBasicMaterial color={PALE} toneMapped={false} />
      </mesh>

      {/* Fin plates */}
      {!compact &&
        fins.map((f, i) => (
          <mesh
            key={i}
            position={f.pos as [number, number, number]}
            rotation={f.rot as [number, number, number]}
          >
            <boxGeometry args={[0.55, 0.08, 0.3]} />
            <meshStandardMaterial
              color="#2A2F38"
              metalness={0.7}
              roughness={0.32}
            />
          </mesh>
        ))}

      {/* Orbit ring */}
      {!compact && (
        <mesh ref={orbit} rotation={[1.2, 0, 0]}>
          <torusGeometry args={[1.75, 0.006, 6, 96]} />
          <meshBasicMaterial color={PALE} transparent opacity={0.35} />
        </mesh>
      )}

      {/* THE LIGHT.
          Parented inside the chassis group, sitting just in front of the eye.
          Because the group rotates toward the cursor, this light sweeps the
          scene with it — that's the "shines a blue light as you move" effect. */}
      <pointLight
        ref={light}
        position={[0, 0, 1.6]}
        color={CYAN}
        intensity={14}
        distance={9}
        decay={2}
      />
      <spotLight
        position={[0, 0, 1.3]}
        target-position={[0, 0, 8]}
        color={CYAN}
        angle={0.5}
        penumbra={1}
        intensity={9}
        distance={14}
      />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Canvas wrapper                                                     */
/* ------------------------------------------------------------------ */
export default function SentinelMonitor() {
  const compact =
    typeof window !== 'undefined' ? window.innerWidth < 640 : false

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none', background: 'transparent' }}
    >
      {/* Deliberately dim ambient — we want the monitor's own light doing
          most of the work, so the sweep is actually visible. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#B7C7D4" />
      {/* rim light from behind-left so the silhouette separates from the page */}
      <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#4FC9FF" />
      <Monitor compact={compact} />
    </Canvas>
  )
}
