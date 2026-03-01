'use client'

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Pool3DProps } from "./Pool3D";
import { StartingEnd } from "../Settings/Settings";
import Swimmer3D from "./Swimmer3D";

const LANE_WIDTH_METERS = 2.5;

function LaneRopes({ poolLength, lanes }: { poolLength: number, lanes: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const floatSpacing = 0.2; // 20cm between floats
    const floatsPerRope = Math.floor(poolLength / floatSpacing);
    const totalFloats = floatsPerRope * (lanes - 1);

    const { geometry, material } = useMemo(() => {
        const geo = new THREE.SphereGeometry(0.05, 8, 8);
        const mat = new THREE.MeshStandardMaterial({ roughness: 0.5 });
        return { geometry: geo, material: mat };
    }, []);

    useEffect(() => {
        if (!meshRef.current) return;

        const dummy = new THREE.Object3D();
        let idx = 0;
        for (let rope = 1; rope < lanes; rope++) {
            const z = rope * LANE_WIDTH_METERS;
            for (let f = 0; f < floatsPerRope; f++) {
                const x = f * floatSpacing;
                dummy.position.set(x, 0.05, z);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(idx, dummy.matrix);

                // Alternate colors (Red/White)
                const color = (f % 4 < 2) ? new THREE.Color("#ff0000") : new THREE.Color("#ffffff");
                meshRef.current.setColorAt(idx, color);

                idx++;
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [totalFloats, floatsPerRope, lanes, floatSpacing]);

    if (lanes <= 1) return null;

    return (
        <instancedMesh ref={meshRef} args={[geometry, material, totalFloats]} castShadow receiveShadow />
    );
}

export default function PoolScene(props: Pool3DProps) {
    const { camera, gl } = useThree();
    const lanes = props.swimmers.length;
    const poolLengthMeters = props.poolLength === "SC" ? 22.86 : 50; // 25yd is approx 22.86m
    const poolWidthMeters = lanes * LANE_WIDTH_METERS;
    const poolDepth = 3.0;

    // Expose for testing
    useEffect(() => {
        if (typeof window !== "undefined" && gl.domElement) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__TEST_CAMERA__ = camera;
            gl.domElement.setAttribute('data-test-ready', 'true');
        }
    }, [camera, gl.domElement]);

    // Camera Perspective Setup
    // Position: 3.0m from the start end wall, 1.67m high, centered horizontally
    useEffect(() => {
        const isRight = props.startingEnd === StartingEnd.RIGHT;
        // If start is Left, observer stands at Z = -3.0m, looking +Z.
        // Wait, if start is left, from the observer's POV, the pool goes from Left to Right.
        // Standard X,Y,Z: +X is right, +Y is up, +Z is out of screen (towards viewer).
        // Let's make X the pool length (swimming left-to-right or right-to-left).
        // Let's make Z the depth across lanes (from nearest to furthest).

        // The instructions say: "Camera looks toward the start end wall."
        // "Position: The observer is standing on the pool deck, exactly 3.0 meters from the start end wall."
        // "Left Orientation: Camera looks toward the left (End is on the left)."

        // If end is on the Left, and we look Left, we are at X = 3.0, looking at X = 0.
        // Wait, if X=0 is the start wall, and the pool extends to X = +poolLength (Right).
        // We stand at X = -3.0 (left of the start wall)? No, we stand on the side deck.
        // The Side Deck means we are parallel to the pool length.
        // If the pool goes left-to-right (Start is Left), the start wall is on our left.
        // We look toward the start end wall -> We look Left.
        // So we stand at X_observer = poolLength/2, Z_observer = poolWidth + 3.0m?
        // Wait, "standing on the pool deck, exactly 3.0 meters from the start end wall."
        // This implies X = 3.0 meters from the wall, on the side deck.
        // Let's define the pool: X=0 to X=poolLength. Z=0 to Z=poolWidth.

        const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;
        const observerZ = poolWidthMeters + 2.0; // Stand 2m back from the edge of lane N
        const lookAtX = isRight ? poolLengthMeters : 0;
        const lookAtZ = poolWidthMeters / 2; // Look at the middle of the start wall

        camera.position.set(observerX, 1.67, observerZ);
        camera.lookAt(lookAtX, 0, lookAtZ);

        // Convert Horizontal FOV to Vertical FOV (Three.js uses vertical FOV)
        if (camera instanceof THREE.PerspectiveCamera) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cam = camera as any;
            // formula: vFOV = 2 * Math.atan( Math.tan( hFOV/2 ) * (height/width) )
            const aspect = window.innerWidth / window.innerHeight;
            const hFOV = Math.PI / 2; // 90 degrees in radians
            const vFOV = 2 * Math.atan(Math.tan(hFOV / 2) / aspect);
            // eslint-disable-next-line react-hooks/immutability
            cam.fov = vFOV * (180 / Math.PI);
            cam.updateProjectionMatrix();
        }
    }, [camera, props.startingEnd, poolWidthMeters, poolLengthMeters]);

    // Simple Pool Geometry
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

            {/* Deck */}
            <mesh position={[poolLengthMeters / 2, -0.01, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters + 20, poolWidthMeters + 20]} />
                <meshStandardMaterial color="#cccccc" roughness={0.8} />
            </mesh>

            {/* Water Surface */}
            <mesh position={[poolLengthMeters / 2, 0, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshPhysicalMaterial
                    color="#44aaff"
                    transmission={0.9}
                    opacity={1}
                    transparent
                    roughness={0.1}
                    ior={1.33}
                />
            </mesh>

            {/* Pool Floor */}
            <mesh position={[poolLengthMeters / 2, -poolDepth, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial color="#88ccff" />
            </mesh>

            {/* Lane Ropes */}
            <LaneRopes poolLength={poolLengthMeters} lanes={lanes} />

            {/* Swimmers */}
            {props.swimmers.map((swimmer, i) => (
                <Swimmer3D
                    key={i}
                    swimmer={swimmer}
                    laneIndex={i}
                    laneWidth={LANE_WIDTH_METERS}
                    poolLength={poolLengthMeters}
                    isRight={props.startingEnd === StartingEnd.RIGHT}
                />
            ))}
        </>
    );
}
