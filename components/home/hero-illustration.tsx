"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float } from "@react-three/drei"
import * as THREE from "three"

const NUM_NODES = 60
const RADIUS = 3.2

function AlgorithmNetwork() {
  const nodesRef = React.useRef<THREE.InstancedMesh>(null!)
  const linesRef = React.useRef<THREE.LineSegments>(null!)
  const packetsRef = React.useRef<THREE.InstancedMesh>(null!)
  const groupRef = React.useRef<THREE.Group>(null!)

  // Procedural graph generation
  const { positions, phases, edges } = React.useMemo(() => {
    const pos = []
    const ph = []
    for (let i = 0; i < NUM_NODES; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos((Math.random() * 2) - 1)
      const r = RADIUS * (0.6 + Math.random() * 0.4)
      
      pos.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
      
      ph.push({
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
        speed: 0.1 + Math.random() * 0.2
      })
    }

    const edg = []
    for (let i = 0; i < NUM_NODES; i++) {
      const distances = pos.map((p, j) => ({ j, d: p.distanceTo(pos[i]) }))
      distances.sort((a, b) => a.d - b.d)
      // Connect to 3 nearest nodes to form a cohesive network graph
      for (let k = 1; k <= 3; k++) {
        if (i < distances[k].j) {
          edg.push([i, distances[k].j])
        }
      }
    }
    return { positions: pos, phases: ph, edges: edg }
  }, [])

  const currentPositions = React.useMemo(() => positions.map(p => p.clone()), [positions])
  const linePositions = React.useMemo(() => new Float32Array(edges.length * 2 * 3), [edges])

  // Data packets traversing the network (mimicking graph algorithms)
  const NUM_PACKETS = 25
  const packets = React.useRef(Array.from({ length: NUM_PACKETS }, () => ({
    edgeIndex: Math.floor(Math.random() * edges.length),
    progress: Math.random(),
    speed: 0.2 + Math.random() * 0.6,
    direction: Math.random() > 0.5 ? 1 : -1
  })))

  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  const packetDummy = React.useMemo(() => new THREE.Object3D(), [])
  const colorDummy = React.useMemo(() => new THREE.Color(), [])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    if (groupRef.current) {
       groupRef.current.rotation.y += delta * 0.05
       groupRef.current.rotation.x += delta * 0.02
    }

    // 1. Update nodes (procedural drifting)
    for (let i = 0; i < NUM_NODES; i++) {
      const orig = positions[i]
      const ph = phases[i]
      
      currentPositions[i].set(
        orig.x + Math.sin(t * ph.speed + ph.x) * 0.5,
        orig.y + Math.cos(t * ph.speed + ph.y) * 0.5,
        orig.z + Math.sin(t * ph.speed + ph.z) * 0.5
      )

      dummy.position.copy(currentPositions[i])
      const scale = 1 + Math.sin(t * 3 + i) * 0.15
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      nodesRef.current.setMatrixAt(i, dummy.matrix)
      
      const isCore = i % 5 === 0
      const baseColor = isCore ? "#00f0ff" : "#334455"
      const glow = Math.sin(t * 2 + i) * 0.5 + 0.5
      colorDummy.set(baseColor).lerp(new THREE.Color(isCore ? "#ffffff" : "#ff00a0"), glow * 0.3)
      nodesRef.current.setColorAt(i, colorDummy)
    }
    nodesRef.current.instanceMatrix.needsUpdate = true
    if (nodesRef.current.instanceColor) nodesRef.current.instanceColor.needsUpdate = true

    // 2. Update lines (dynamic edges)
    if (linesRef.current) {
      edges.forEach((edge, idx) => {
        const p1 = currentPositions[edge[0]]
        const p2 = currentPositions[edge[1]]
        linePositions[idx * 6] = p1.x
        linePositions[idx * 6 + 1] = p1.y
        linePositions[idx * 6 + 2] = p1.z
        linePositions[idx * 6 + 3] = p2.x
        linePositions[idx * 6 + 4] = p2.y
        linePositions[idx * 6 + 5] = p2.z
      })
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // 3. Update packets (algorithmic traversal)
    if (packetsRef.current) {
      packets.current.forEach((pkt, i) => {
        pkt.progress += pkt.speed * delta * pkt.direction
        
        // Node reached -> Routing logic
        if (pkt.progress > 1 || pkt.progress < 0) {
          const currentEdge = edges[pkt.edgeIndex]
          const arrivalNode = pkt.direction === 1 ? currentEdge[1] : currentEdge[0]
          
          const possibleEdges = edges.map((e, idx) => ({ e, idx })).filter(e => e.e[0] === arrivalNode || e.e[1] === arrivalNode)
          
          if (possibleEdges.length > 1) {
             // Choose a random path that is not the one we just came from
             const nextEdges = possibleEdges.filter(e => e.idx !== pkt.edgeIndex)
             const next = nextEdges[Math.floor(Math.random() * nextEdges.length)] || possibleEdges[0]
             pkt.edgeIndex = next.idx
             pkt.direction = next.e[0] === arrivalNode ? 1 : -1
             pkt.progress = pkt.direction === 1 ? 0 : 1
          } else if (possibleEdges.length === 1) {
             // Dead end, bounce back
             const next = possibleEdges[0]
             pkt.edgeIndex = next.idx
             pkt.direction = next.e[0] === arrivalNode ? 1 : -1
             pkt.progress = pkt.direction === 1 ? 0 : 1
          }
        }

        const edge = edges[pkt.edgeIndex]
        const p1 = currentPositions[edge[0]]
        const p2 = currentPositions[edge[1]]
        
        packetDummy.position.lerpVectors(p1, p2, pkt.progress)
        const scale = 1 + Math.sin(t * 10 + i) * 0.3
        packetDummy.scale.setScalar(scale)
        packetDummy.updateMatrix()
        packetsRef.current.setMatrixAt(i, packetDummy.matrix)

        colorDummy.set(i % 2 === 0 ? "#00f0ff" : "#ff00a0")
        packetsRef.current.setColorAt(i, colorDummy)
      })
      packetsRef.current.instanceMatrix.needsUpdate = true
      if (packetsRef.current.instanceColor) packetsRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={nodesRef} args={[null as any, null as any, NUM_NODES]}>
        <icosahedronGeometry args={[0.07, 1]} />
        <meshStandardMaterial roughness={0.2} metalness={0.8} />
      </instancedMesh>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edges.length * 2}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#556677" transparent opacity={0.25} />
      </lineSegments>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <instancedMesh ref={packetsRef} args={[null as any, null as any, NUM_PACKETS]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  )
}

export function HeroIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full aspect-square max-w-[480px] select-none lg:sticky lg:top-10 z-10"
    >
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        className="w-full h-full drop-shadow-2xl"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#00f0ff" />
        <directionalLight position={[-10, -10, -5]} intensity={2.5} color="#ff00a0" />
        
        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
          <AlgorithmNetwork />
        </Float>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  )
}