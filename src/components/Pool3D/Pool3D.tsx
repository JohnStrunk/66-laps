'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PCFShadowMap } from "three";
import { PoolLength } from "../Pool/Pool";
import { NumberingDirection, StartingEnd } from "../Settings/Settings";
import PoolScene from "./PoolScene";

export type Pool3DProps = {
    poolLength: PoolLength;
    numbering: NumberingDirection;
    startingEnd?: StartingEnd;
    swimmers: ISwimmer[];
    className?: string;
};

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
