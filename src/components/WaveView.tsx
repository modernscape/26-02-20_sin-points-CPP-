'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'


interface WaveViewProps {
  wasmModule: any;
  count: number;
}

export function WaveView({ wasmModule, count }: WaveViewProps) {

  const pointsRef = useRef<THREE.Points>(null!)
  
  // 1. WASM 側のインスタンスを保持
  const sim = useMemo(() => new wasmModule.SineWaveSim(count), [wasmModule, count]);

  // 2. 初期の空配列を作成（これに WASM から値を set する）
  const initialPositions = useMemo(() => new Float32Array(count * 3), [count]);

  useEffect(() => {
    return () => {
      if (sim && sim.delete) sim.delete();
    };
  }, [sim]);

  useFrame((_state, delta) => {
    // 1. 基本的な存在チェック
    if (!pointsRef.current || !wasmModule) return;
  
    // 2. HEAPF32 が準備できているか厳重にチェック
    const heap = wasmModule.HEAPF32;
    if (!heap) return; 
  
    sim.update(delta);
  
    const ptr = sim.getPositionPointer();

    if (!ptr) return; // ポインタが 0 または無効ならスキップ

   
    try {
      // Emscripten の ptr は通常「バイトアドレス」なので 4 で割ってインデックスにする
      // heap が Float32Array なら subarray が使えます
      const start = ptr / 4;
      const end = start + count * 3;
      const positionsFromWasm = heap.subarray(start, end);
  
      const geometry = pointsRef.current.geometry;
      const attr = geometry.attributes.position as THREE.BufferAttribute;
      
      attr.array.set(positionsFromWasm);
      attr.needsUpdate = true;
    } catch (e) {
      console.error("WASM Memory access error:", e);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* attach="attributes-position" で、geometry.attributes.position に紐付け
          args で [配列, 要素サイズ] をコンストラクタに渡す
        */}
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="cyan" />
      <OrbitControls />
    </points>
  )
}