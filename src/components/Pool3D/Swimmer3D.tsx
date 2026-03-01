'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ISwimmer } from "@/modules/SwimmerModel";

type Swimmer3DProps = {
    swimmer: ISwimmer;
    laneIndex: number;
    laneWidth: number;
    poolLength: number;
    isRight: boolean;
};

// Generates a consistent random color based on lane index
function getLaneColor(index: number) {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#8800ff", "#0088ff", "#ff0088"];
    return colors[index % colors.length];
}

export default function Swimmer3D({ swimmer, laneIndex, laneWidth, poolLength, isRight }: Swimmer3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const color = useMemo(() => getLaneColor(laneIndex), [laneIndex]);

    useFrame(() => {
        if (!groupRef.current) return;

        // Expose for testing
        if (laneIndex === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__TEST_SWIMMER_0__ = groupRef.current;
        }

        // Location is 0.0 to 1.0 representing the distance completed along the CURRENT lap.
        const { location: loc, direction: dir } = swimmer.where();

        // In SwimmerModel, Direction.TOTURN is 1, Direction.TOSTART is 0
        const headingToTurn = dir === 1;

        let xPos = 0;
        if (!isRight) {
            // Start is at X=0, Turn is at X=poolLength
            xPos = loc * poolLength;
        } else {
            // Start is at X=poolLength, Turn is at X=0
            xPos = poolLength - (loc * poolLength);
        }

        // Z pos across lanes
        const zPos = (laneIndex + 0.5) * laneWidth;

        groupRef.current.position.set(xPos, 0, zPos);

        // Rotation (Flip animation when dir changes)
        // In Three.js (right-handed), rotating +90 deg (PI/2) around Y points local +Z to world +X.
        // If moving right (+X), we want local +Z (the head) to point at +X.
        // If moving left (-X), we want local +Z (the head) to point at -X.
        const movingRight = (!isRight && headingToTurn) || (isRight && !headingToTurn);
        const targetRotationY = movingRight ? Math.PI / 2 : -Math.PI / 2;

        // Simple instant rotation for now, we will add flip interpolation later
        groupRef.current.rotation.y = targetRotationY;
    });

    return (
        <group ref={groupRef}>
            {/* Ice cream cone shape: sphere head + cone body */}
            <mesh position={[0, 0, 0]} castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.1, 1.2, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
}
