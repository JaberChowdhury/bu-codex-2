"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

function generatePoints(count: number) {
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 10 * Math.sqrt(Math.random())
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos(2 * Math.random() - 1)

    points[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    points[i * 3 + 2] = r * Math.cos(phi)
  }
  return points
}

export function ThreeBackground() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = React.useRef<any>(null)
  const [sphere] = React.useState(() => generatePoints(1500))

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15
      ref.current.rotation.y -= delta / 20
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={true}>
        <PointMaterial
          transparent
          color="#9333ea"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  )
}

export function AmbientCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ThreeBackground />
      </Canvas>
    </div>
  )
}
