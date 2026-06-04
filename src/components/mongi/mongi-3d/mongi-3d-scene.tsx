"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import styles from "./mongi-3d.module.css";

const MODEL_URL = "/models/mongi.glb";

// 모델을 미리 불러와 첫 진입 로딩을 줄인다.
useGLTF.preload(MODEL_URL);

interface MongiModelProps {
  happy: boolean;
  onTap: () => void;
}

function MongiModel({ happy, onTap }: MongiModelProps) {
  const { scene } = useGLTF(MODEL_URL);

  // Tripo 모델은 중심·스케일이 제각각이라 한 번 정규화한다.
  const { object, scale } = useMemo(() => {
    const obj = scene.clone(true);
    obj.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) mesh.frustumCulled = false;
    });
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    // 바운딩 박스 중심을 원점으로 이동
    obj.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { object: obj, scale: 2 / maxDim };
  }, [scene]);

  const group = useRef<THREE.Group>(null);
  const happyRef = useRef(happy);
  happyRef.current = happy;

  // 탭 시 점프 임펄스(스프링으로 감쇠) + 살짝 회전
  const hopPos = useRef(0);
  const hopVel = useRef(0);
  const spin = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const isHappy = happyRef.current;

    // 호흡 바운스 (기쁠 때 더 빠르고 크게)
    const breathe = Math.sin(t * (isHappy ? 4.2 : 1.8)) * (isHappy ? 0.06 : 0.035);

    // 점프 스프링
    hopVel.current += -hopPos.current * 24 * delta - hopVel.current * 5 * delta;
    hopPos.current += hopVel.current * delta;
    g.position.y = breathe + hopPos.current;

    // 좌우로 살랑 + 탭 시 추가 회전 임펄스 감쇠
    spin.current = THREE.MathUtils.damp(spin.current, 0, 4, delta);
    g.rotation.z = Math.sin(t * 1.3) * 0.025;
    if (isHappy) g.rotation.y += 0.9 * delta;
  });

  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hopVel.current = 3.4;
    spin.current = 1;
    onTap();
  };

  return (
    <group ref={group} scale={scale} onPointerDown={handleDown}>
      <primitive object={object} />
    </group>
  );
}

export default function Mongi3DScene() {
  const [happy, setHappy] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const happyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    setHappy(true);
    if (happyTimer.current) clearTimeout(happyTimer.current);
    happyTimer.current = setTimeout(() => setHappy(false), 1500);

    const id = Date.now() + Math.random();
    setHearts((prev) => [...prev, id]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h !== id));
    }, 1200);
  };

  return (
    <div className={styles.wrap}>
      <Canvas
        camera={{ position: [0, 0.2, 4.4], fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.15} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <Suspense fallback={null}>
          <MongiModel happy={happy} onTap={handleTap} />
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.32}
            blur={2.6}
            scale={6}
            far={3}
            color="#8a6a52"
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.85}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {hearts.length > 0 && (
        <div className={styles.heartLayer} aria-hidden="true">
          {hearts.map((id) => (
            <span key={id} className={styles.heart}>
              💛
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
