'use client'

import { Canvas } from "@react-three/fiber";
import { NumberingDirection, StartingEnd } from "../Settings/Settings";
import { ISwimmer } from "@/modules/SwimmerModel";
import { PoolLength } from "../Pool/Pool";
import PoolScene from "./PoolScene";

export type Pool3DProps = {
    poolLength: PoolLength;
    numbering: NumberingDirection;
    startingEnd?: StartingEnd;
    swimmers: ISwimmer[];
    className?: string;
};

import { PCFShadowMap } from "three";

export default function Pool3D(props: Pool3DProps) {
    return (
        <div className={props.className} data-testid="3d-pool-container">
            <Canvas
                shadows={{ type: PCFShadowMap }}
                camera={{ fov: 90, near: 0.1, far: 1000 }}
            >
                <PoolScene {...props} />
            </Canvas>
        </div>
    );
}
