import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, Environment, Sparkles, SpotLight, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Piano Keyboard that plays/undulates
const PianoKeyboard3D = () => {
  const groupRef = useRef();
  const keyCount = 18; // Number of white keys
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((key, i) => {
        const wave = Math.sin(time * 4 + i * 0.5);
        key.position.y = Math.max(0, wave * 0.25);
        if (wave < -0.6) {
            key.rotation.x = 0.15;
        } else {
            key.rotation.x = 0;
        }
      });
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[2.5, -0.5, -2]}>
        <group ref={groupRef} rotation={[0.4, 0.6, -0.2]}>
        {Array.from({ length: keyCount }).map((_, i) => {
            const isBlackKey = [1, 2, 4, 5, 6].includes(i % 7);
            return (
            <group key={i} position={[i * 0.45, 0, 0]}>
                {/* White key */}
                <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.4, 0.2, 2.2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
                </mesh>
                {/* Black key overlay */}
                {isBlackKey && i < keyCount - 1 && (
                <mesh position={[0.225, 0.2, -0.6]} castShadow>
                    <boxGeometry args={[0.25, 0.3, 1.3]} />
                    <meshStandardMaterial color="#1f2937" roughness={0.3} />
                </mesh>
                )}
            </group>
            );
        })}
        </group>
    </Float>
  );
};

// Abstract floating rhythmic sphere
const RhythmicSphere = () => {
    return (
        <Float speed={3} rotationIntensity={1.5} floatIntensity={2} position={[5.5, 1.5, -3]}>
            <Sphere args={[1.5, 64, 64]} castShadow>
                <MeshDistortMaterial
                    color="#ef7e1a"
                    emissive="#ff9b42"
                    emissiveIntensity={0.3}
                    envMapIntensity={2}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    metalness={0.1}
                    roughness={0.2}
                    distort={0.5}
                    speed={4}
                />
            </Sphere>
        </Float>
    );
}

// 3D Audio Visualizer Bars
const AudioBars3D = () => {
    const barsRef = useRef();
    const barsCount = 10;

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if(barsRef.current) {
            barsRef.current.children.forEach((bar, i) => {
                const scaleY = Math.max(0.2, Math.sin(time * 6 + i * 0.6) * 1.8 + 1.8);
                bar.scale.y = scaleY;
                bar.position.y = scaleY / 2;
                bar.material.emissiveIntensity = scaleY * 0.4;
            });
        }
    });

    return (
        <group position={[4, -1, -5]} rotation={[0, -0.2, 0]}>
           <group ref={barsRef}>
            {Array.from({length: barsCount}).map((_, i) => (
                <mesh key={i} position={[i * 0.7, 1, 0]} castShadow>
                    <boxGeometry args={[0.5, 1, 0.5]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#60a5fa" emissiveIntensity={0.8} roughness={0.2} metalness={0.8} />
                </mesh>
            ))}
           </group>
        </group>
    )
}

export default function HeroAnimated3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <Canvas shadows camera={{ position: [0, 1.5, 8], fov: 45 }}>
        {/* Very bright ambient light for light mode */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" castShadow />
        <spotLight position={[-10, 10, 5]} angle={0.5} penumbra={1} intensity={3} color="#f4a14f" />
        <spotLight position={[10, -5, 5]} angle={0.8} penumbra={1} intensity={2} color="#3b82f6" />
        
        {/* Floating Instruments */}
        <PianoKeyboard3D />
        <RhythmicSphere />
        <AudioBars3D />
        
        {/* Environment & FX */}
        <Sparkles count={200} scale={15} size={6} speed={0.8} color="#ef7e1a" opacity={0.6} />
        
        <Environment preset="studio" />
        {/* Extremely subtle fog to blend background if needed */}
        <fog attach="fog" args={['#ffffff', 10, 30]} />
      </Canvas>
    </div>
  );
}
