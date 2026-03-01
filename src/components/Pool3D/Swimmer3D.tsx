'use client'

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { ISwimmer } from "@/modules/SwimmerModel";
import { TestWindow } from "@/modules/testTypes";

type Swimmer3DProps = {
    swimmer: ISwimmer;
    laneIndex: number;
    laneWidth: number;
    poolLength: number;
    isRight: boolean;
    waterY: number;
    onPositionUpdate?: (index: number, x: number, z: number) => void;
};

const SWIMMER_COLORS = [
    "#ff4d4d", // Red
    "#4d79ff", // Blue
    "#4dff4d", // Green
    "#ffff4d", // Yellow
    "#ff4dff", // Magenta
    "#4dffff", // Cyan
    "#ff994d", // Orange
    "#994dff", // Purple
];

const getRandomSwimmerColor = () => {
    return SWIMMER_COLORS[Math.floor(Math.random() * SWIMMER_COLORS.length)];
};

export default function Swimmer3D({ swimmer, laneIndex, laneWidth, poolLength, isRight, waterY, onPositionUpdate }: Swimmer3DProps) {
    const groupRef = useRef<Group>(null);
    // Stable random color for this swimmer instance
    const color = useMemo(() => getRandomSwimmerColor(), []);

    useFrame(() => {
        if (!groupRef.current) return;

        // Expose for testing
        if (laneIndex === 0) {
            const testWin = window as unknown as TestWindow;
            testWin.__TEST_SWIMMER_0__ = groupRef.current;
            testWin.__TEST_SWIMMER_0_MODEL__ = swimmer;
            testWin.__TEST_POOL_LENGTH__ = poolLength;
        }

        // Location is 0.0 to 1.0 representing the distance completed along the CURRENT lap.
        const { location: loc, direction: dir } = swimmer.where();

        // In SwimmerModel, Direction.TOTURN is 1, Direction.TOSTART is 0
        const headingToTurn = dir === 1;

        // Swimmer dimensions: Sphere (r=0.3) + Cylinder (l=1.2) = 1.5m total
        const swimmerLength = 1.5;
        const halfLength = swimmerLength / 2;
        const travelRange = poolLength - swimmerLength;

        let xPos = 0;
        if (!isRight) {
            // Start is at X=0, Turn is at X=poolLength
            // Using anchor-like logic to keep the swimmer between 0 and poolLength.
            xPos = halfLength + loc * travelRange;
        } else {
            // Start is at X=poolLength, Turn is at X=0
            xPos = (poolLength - halfLength) - loc * travelRange;
        }

        // Z pos across lanes
        const zPos = (laneIndex + 0.5) * laneWidth;

        groupRef.current.position.set(xPos, waterY, zPos);

        if (onPositionUpdate) {
            onPositionUpdate(laneIndex, xPos, zPos);
        }

        // Rotation: Point in direction of travel
        // Normal (isRight=false): ToTurn is +X, ToStart is -X
        // Flipped (isRight=true): ToTurn is -X, ToStart is +X
        let movingRight = false;
        if (!isRight) {
            movingRight = headingToTurn;
        } else {
            movingRight = !headingToTurn;
        }

        groupRef.current.rotation.y = movingRight ? Math.PI / 2 : -Math.PI / 2;
    });

    return (
        <group ref={groupRef}>
            {/* Ice cream cone shape: sphere head + cone body */}
            {/* Centered so total length is 1.5m, from -0.75 to +0.75 in local Z */}
            <mesh position={[0, 0, 0.45]} castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.1, 1.2, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
}
