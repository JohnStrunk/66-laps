'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Pool3DProps } from "./Pool3D";
import PoolScene from "./PoolScene";
import { PCFShadowMap } from "three";

export default function Pool3D(props: Pool3DProps) {
    return (
        <div className={props.className} data-testid="pool-3d-container">
            <Canvas
                shadows={{ type: PCFShadowMap }}
                camera={{ fov: 90, near: 0.1, far: 1000 }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={["#111111"]} />
                <ambientLight intensity={0.5} />
                <Suspense fallback={null}>
                    <PoolScene {...props} />
                </Suspense>
            </Canvas>
        </div>
    );
}
