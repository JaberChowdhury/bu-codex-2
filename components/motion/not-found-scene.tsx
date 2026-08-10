"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Text, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

// Instant loading material (no Environment/HDR downloads needed)
function ShinyMaterial() {
  return (
    <meshStandardMaterial
      color="#ffffff"
      roughness={0.1}
      metalness={0.9}
      emissive="#111111"
    />
  )
}

function MobiusTriangle() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <Float floatIntensity={1.5} speed={2}>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.5, 32, 3]} />
        <ShinyMaterial />
      </mesh>
    </Float>
  )
}

function FloatingFour({
  position,
  rotation,
  delay,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  delay: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.3
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.05
    }
  })

  return (
    <Text
      ref={meshRef}
      position={position}
      rotation={rotation}
      fontSize={7}
      letterSpacing={-0.05}
      lineHeight={1}
    >
      4
      <ShinyMaterial />
    </Text>
  )
}

export function NotFoundScene() {
  return (
    <div className="absolute inset-0 z-0">
      {/* dpr prop limits resolution scaling on high-res displays for massive performance gains */}
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 1.5]}>
        {/* Simple lighting setup replaces the heavy 15MB+ HDR Environment download */}
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={4} color="#ffffff" />
        <directionalLight
          position={[-5, -10, -5]}
          intensity={2}
          color="#f3c6d6"
        />
        <pointLight position={[0, 0, 5]} intensity={2} color="#ffffff" />

        <FloatingFour
          position={[-4.5, 0, 0]}
          rotation={[0, 0.15, 0]}
          delay={0}
        />
        <MobiusTriangle />
        <FloatingFour
          position={[4.5, 0, 0]}
          rotation={[0, -0.15, 0]}
          delay={1}
        />

        <ContactShadows
          position={[0, -4, 0]}
          opacity={0.3}
          scale={20}
          blur={2}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  )
}
