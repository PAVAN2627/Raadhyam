import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// A dynamic audio-visualizer-like ring of bars
const AudioVisualizerRing = () => {
  const meshRef = useRef();
  const count = 64; // Number of bars
  const radius = 8; // Radius of the ring
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        
        // Position in a circle
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Math to create jumping bars effect
        const baseHeight = 0.5;
        // Combine a few sine waves for complex visualizer look
        const wave1 = Math.sin(time * 2 + angle * 4) * 0.5 + 0.5;
        const wave2 = Math.sin(time * 3 + angle * 8) * 0.3 + 0.3;
        const scaleY = baseHeight + (wave1 + wave2) * 3;
        
        dummy.position.set(x, scaleY / 2 - 2, z);
        
        // Rotate the bars to face outwards slightly or just stand up
        dummy.rotation.y = -angle;
        dummy.scale.set(0.3, scaleY, 0.3);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.rotation.y += 0.005; // slowly rotate the whole ring
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ef7e1a" emissive="#e46f0b" emissiveIntensity={0.6} wireframe />
    </instancedMesh>
  );
};

// Abstract floating musical spheres
const FloatingEnergy = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={2} floatIntensity={2} position={[-4, 2, -5]}>
        <Sphere args={[1.5, 32, 32]}>
          <MeshDistortMaterial
            color="#ef7e1a"
            emissive="#a34d05"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.5}
            roughness={0.2}
            distort={0.4}
            speed={3}
          />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5} position={[5, -1, -3]}>
        <Sphere args={[1, 32, 32]}>
          <MeshDistortMaterial
            color="#bb4e03"
            emissive="#732b00"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.2}
            metalness={0.8}
            roughness={0.1}
            distort={0.6}
            speed={4}
          />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={3} position={[-6, -4, -8]}>
        <Sphere args={[2, 32, 32]}>
          <MeshDistortMaterial
            color="#ffffff"
            emissive="#ffb462"
            emissiveIntensity={0.5}
            wireframe
            distort={0.3}
            speed={2}
          />
        </Sphere>
      </Float>
    </>
  );
};

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        {/* Soft lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <spotLight position={[-10, 10, -5]} angle={0.4} penumbra={1} intensity={2} color="#f4a14f" />

        {/* 3D Elements */}
        <FloatingEnergy />
        <AudioVisualizerRing />
        
        {/* Environment particles */}
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={150} scale={15} size={3} speed={0.4} color="#f4a14f" opacity={0.6} />

        {/* Subtle fog for atmospheric depth */}
        <fog attach="fog" args={['#090909', 5, 25]} />
      </Canvas>
    </div>
  );
}
