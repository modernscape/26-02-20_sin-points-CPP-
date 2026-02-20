'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WaveView({ wasmModule, count = 100 }) {
  const pointsRef = useRef<THREE.Points>(null!)
  
  // 1. WASM インスタンス生成
  const sim = useMemo(() => new wasmModule.SineWaveSim(count), [wasmModule, count]);

  useFrame((state, delta) => {
    // 2. C++ 側で計算
    sim.update(delta);

    // 3. WASM Heap からデータを直接参照 (コピーなしのView作成)
    const ptr = sim.getPositionPointer();
    const positions = new Float32Array(
      wasmModule.HEAPF32.buffer, 
      ptr, 
      count * 3
    );

    // 4. Three.js の Geometry を更新
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    attr.array.set(positions); // メモリコピーが発生するが、最小構成として提示
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="cyan" />
    </points>
  )
}