'use client'

import { WaveView } from "@/components/WaveView";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

export default function Home() {
  const [wasmModule, setWasmModule] = useState<any>(null);

  useEffect(() => {
    // 1. グルーコード(engine.js)を動的にインポート
    const initWasm = async () => {
      // @ts-ignore: publicにあるファイルなのでパス指定
      const createEngine = (await import("../../public/wasm/engine.js")).default;
      
      const module = await createEngine({
        // 2. WASMバイナリの場所を明示
        locateFile: (path: string) => `/wasm/${path}`
      });
      setWasmModule(module);
    };

    initWasm();
  }, []);

  // WASMロードが終わるまでCanvasを描画しない、
  // またはCanvas内でwasmModuleの存在をチェックする
  return (
    <main style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {wasmModule && <WaveView wasmModule={wasmModule} count={1000} />}
      </Canvas>
    </main>
  );
}