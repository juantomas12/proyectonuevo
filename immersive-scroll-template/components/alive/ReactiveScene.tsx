"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useMemo, useRef, useState } from "react";

export type SceneVariant = "avatar" | "head" | "particles" | "liquid";

function LiquidBackdrop({ speed, intensity, smoothing }: { speed: number; intensity: number; smoothing: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColorA: { value: new THREE.Color("#071014") },
      uColorB: { value: new THREE.Color("#0c5a66") },
      uIntensity: { value: intensity },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime * speed;
    material.current.uniforms.uIntensity.value = intensity;
    material.current.uniforms.uMouse.value.lerp(pointer, Math.max(0.025, 0.16 * (1.05 - smoothing)));
  });

  return (
    <mesh position={[0, 0, -3]} scale={[12, 8, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uMouse;
          void main() {
            vUv = uv;
            vec3 p = position;
            p.z += sin((p.x + uTime * .22) * 4.) * .035;
            p.z += cos((p.y - uTime * .18) * 5.) * .03;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uMouse;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uIntensity;
          void main() {
            float wave = sin(vUv.x * 9. + uTime * .7) * cos(vUv.y * 7. - uTime * .5);
            float glow = .16 / max(.05, distance(vUv, uMouse * .25 + .5));
            vec3 color = mix(uColorA, uColorB, smoothstep(-.8, .9, wave + vUv.y));
            color += vec3(.05, .48, .55) * glow * .2 * uIntensity;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function ParticleField({ speed, intensity }: { speed: number; intensity: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 9;
      values[i * 3 + 1] = (Math.random() - 0.5) * 6;
      values[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return values;
  }, []);

  useFrame(({ pointer, clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.025 * speed + pointer.x * 0.12 * intensity;
    points.current.rotation.x = pointer.y * 0.08 * intensity;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9beef5" size={0.012 + intensity * 0.012} sizeAttenuation transparent opacity={Math.min(0.9, 0.38 + intensity * 0.24)} />
    </points>
  );
}

function ReactiveAvatar({ externalLook, speed, sensitivity, smoothing, headOnly }: { externalLook?: { x: number; y: number } | null; speed: number; sensitivity: number; smoothing: number; headOnly?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const [excited, setExcited] = useState(false);

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current) return;
    const x = externalLook?.x ?? pointer.x;
    const y = externalLook?.y ?? pointer.y;
    const damp = 2.4 + (1 - smoothing) * 7;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.42 * sensitivity, damp, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.2 * sensitivity, damp, delta);
    const eyeX = THREE.MathUtils.clamp(x * 0.16 * sensitivity, -0.16, 0.16);
    const eyeY = THREE.MathUtils.clamp(-y * 0.12 * sensitivity, -0.13, 0.13);
    [leftEye.current, rightEye.current].forEach((eye) => {
      if (!eye) return;
      eye.rotation.y = THREE.MathUtils.damp(eye.rotation.y, eyeX, 8, delta);
      eye.rotation.x = THREE.MathUtils.damp(eye.rotation.x, eyeY, 8, delta);
      const blink = Math.sin(clock.elapsedTime * 0.72 * speed) > 0.998 ? 0.12 : 1;
      eye.scale.y = THREE.MathUtils.damp(eye.scale.y, blink, 20, delta);
    });
    const targetScale = excited ? 1.12 : 1;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, 5, delta));
  });

  return (
    <Float speed={1.4 * speed} rotationIntensity={0.08} floatIntensity={0.28}>
      <group
        ref={group}
        position={[0, -0.12, 0]}
        onClick={() => {
          setExcited(true);
          window.setTimeout(() => setExcited(false), 500);
        }}
      >
        <mesh castShadow>
          <sphereGeometry args={[1.15, 64, 64]} />
          <MeshDistortMaterial color="#cbd0c9" roughness={0.26} metalness={0.55} distort={0.08} speed={1.1} />
        </mesh>
        <mesh position={[0, -0.18, 1.03]} scale={[0.25, 0.38, 0.18]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#9ba19b" roughness={0.5} metalness={0.28} />
        </mesh>
        {[-0.42, 0.42].map((x, index) => (
          <group key={x} ref={index === 0 ? leftEye : rightEye} position={[x, 0.23, 0.96]}>
            <mesh scale={[0.27, 0.2, 0.11]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#e9fbfa" emissive="#88ffff" emissiveIntensity={0.65} />
            </mesh>
            <mesh position={[0, 0, 0.105]} scale={[0.11, 0.11, 0.04]}>
              <sphereGeometry args={[1, 24, 24]} />
              <meshStandardMaterial color="#071014" />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.58, 0.95]} rotation={[0.08, 0, 0]}>
          <torusGeometry args={[0.28, 0.025, 12, 64, Math.PI]} />
          <meshStandardMaterial color="#202727" />
        </mesh>
        {!headOnly && (
          <mesh position={[0, -1.35, -0.05]} scale={[1.5, 0.45, 0.75]}>
            <sphereGeometry args={[1, 48, 48]} />
            <meshStandardMaterial color="#15191a" roughness={0.34} metalness={0.7} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function ReactiveOrb({ speed, intensity }: { speed: number; intensity: number }) {
  const orb = useRef<THREE.Mesh>(null);
  useFrame(({ pointer, clock }) => {
    if (!orb.current) return;
    orb.current.rotation.x = clock.elapsedTime * 0.18 * speed + pointer.y * 0.35;
    orb.current.rotation.y = clock.elapsedTime * 0.24 * speed + pointer.x * 0.45;
  });
  return (
    <Float speed={speed * 1.2} floatIntensity={0.65} rotationIntensity={0.2}>
      <mesh ref={orb} scale={0.85 + intensity * 0.2}>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial color="#68e8ef" emissive="#0b7985" emissiveIntensity={0.8} metalness={0.75} roughness={0.18} distort={0.18 * intensity} speed={speed * 2} />
      </mesh>
    </Float>
  );
}

export function ReactiveScene({
  externalLook,
  className = "",
  variant = "avatar",
  speed = 1,
  sensitivity = 1,
  intensity = 1,
  smoothing = 0.65,
}: {
  externalLook?: { x: number; y: number } | null;
  className?: string;
  variant?: SceneVariant;
  speed?: number;
  sensitivity?: number;
  intensity?: number;
  smoothing?: number;
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <LiquidBackdrop speed={speed} intensity={intensity} smoothing={smoothing} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 4]} color="#b5fbff" intensity={3.8} castShadow />
          <pointLight position={[-3, -1, 2]} color="#ff6b35" intensity={22} distance={8} />
          {variant !== "liquid" && <ParticleField speed={speed} intensity={intensity} />}
          {(variant === "avatar" || variant === "head") && (
            <ReactiveAvatar externalLook={externalLook} speed={speed} sensitivity={sensitivity} smoothing={smoothing} headOnly={variant === "head"} />
          )}
          {(variant === "particles" || variant === "liquid") && <ReactiveOrb speed={speed} intensity={intensity} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
