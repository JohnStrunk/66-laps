'use client'

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Pool3DProps } from "./Pool3D";
import { StartingEnd } from "../Settings/Settings";
import Swimmer3D from "./Swimmer3D";
import { TestWindow } from "@/modules/testTypes";

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
        <instancedMesh
            ref={meshRef}
            args={[geometry, material, totalFloats]}
            castShadow
            receiveShadow
            frustumCulled={false} // Prevent culling when the origin is out of view
        />
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
            const testWin = window as unknown as TestWindow;
            testWin.__TEST_CAMERA__ = camera;
            gl.domElement.setAttribute('data-test-ready', 'true');
        }
    }, [camera, gl.domElement]);

    // Camera Perspective Setup
    // Position: 3.0m from the start end wall, 1.67m high, centered horizontally
    useEffect(() => {
        const isRight = props.startingEnd === StartingEnd.RIGHT;
        const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;
        const observerZ = poolWidthMeters + 2.0; // Stand 2m back from the edge of lane N
        const lookAtX = isRight ? poolLengthMeters : 0;
        const lookAtZ = poolWidthMeters / 2; // Look at the middle of the start wall

        camera.position.set(observerX, 1.67, observerZ);
        camera.lookAt(lookAtX, 0, lookAtZ);

        // Convert Horizontal FOV to Vertical FOV (Three.js uses vertical FOV)
        if (camera instanceof THREE.PerspectiveCamera) {
            const cam = camera as THREE.PerspectiveCamera;
            // formula: vFOV = 2 * Math.atan( Math.tan( hFOV/2 ) * (height/width) )
            const aspect = window.innerWidth / window.innerHeight;
            const hFOV = Math.PI / 2; // 90 degrees in radians
            const vFOV = 2 * Math.atan(Math.tan(hFOV / 2) / aspect);
            // eslint-disable-next-line react-hooks/immutability -- Three.js cameras require manual property updates followed by updateProjectionMatrix()
            cam.fov = vFOV * (180 / Math.PI);
            cam.updateProjectionMatrix();
        }
    }, [camera, props.startingEnd, poolWidthMeters, poolLengthMeters]);

    // Simple Pool Geometry
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[poolLengthMeters / 2, 20, poolWidthMeters / 2]} intensity={1} castShadow />

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
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Pool Floor */}
            <mesh position={[poolLengthMeters / 2, -poolDepth, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial color="#88ccff" side={THREE.DoubleSide} />
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
