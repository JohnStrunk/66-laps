'use client'

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, PerspectiveCamera, CylinderGeometry } from "three";
import { Text } from "@react-three/drei";
import { Pool3DProps } from "./Pool3D";
import { NumberingDirection, StartingEnd } from "../Settings/Settings";
import Swimmer3D from "./Swimmer3D";
import { TestWindow } from "@/modules/testTypes";
import { ATKINSON_BOLD } from "@/modules/fonts/AtkinsonBold";

const LANE_WIDTH_METERS = 2.5;
const DISK_DIAMETER = 0.12;
const DISK_THICKNESS = 0.03;
const DISK_SPACING = 0.05;
const DISK_PITCH = DISK_THICKNESS + DISK_SPACING;

const DECK_Y = 0;
const WATER_Y = -0.5;
const POOL_DEPTH = 3.0;
const FLOOR_Y = WATER_Y - POOL_DEPTH;

function LaneRopes({ poolLength, lanes, y }: { poolLength: number, lanes: number, y: number }) {
    const meshRef = useRef<InstancedMesh>(null);
    const floatsPerRope = Math.floor(poolLength / DISK_PITCH);
    const totalFloats = floatsPerRope * (lanes - 1);

    const { geometry, material, cordGeometry, cordMaterial } = useMemo(() => {
        const geo = new CylinderGeometry(DISK_DIAMETER / 2, DISK_DIAMETER / 2, DISK_THICKNESS, 8);
        geo.rotateZ(Math.PI / 2);
        const mat = new MeshStandardMaterial({ roughness: 0.5 });
        const cGeo = new CylinderGeometry(0.005, 0.002, poolLength, 4);
        cGeo.rotateZ(Math.PI / 2);
        const cMat = new MeshStandardMaterial({ color: "#aaaaaa", roughness: 0.5 });
        return { geometry: geo, material: mat, cordGeometry: cGeo, cordMaterial: cMat };
    }, [poolLength]);

    useEffect(() => {
        if (!meshRef.current || totalFloats <= 0) return;
        const totalFloatLength = (floatsPerRope - 1) * DISK_PITCH + DISK_THICKNESS;
        const offset = (poolLength - totalFloatLength) / 2;
        const dummy = new Object3D();
        let idx = 0;
        for (let rope = 1; rope < lanes; rope++) {
            const z = rope * LANE_WIDTH_METERS;
            for (let f = 0; f < floatsPerRope; f++) {
                const x = f * DISK_PITCH + offset + DISK_THICKNESS / 2;
                dummy.position.set(x, y, z);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(idx, dummy.matrix);

                let color = new Color("#0000bb");
                if (x <= 5 || x >= poolLength - 5) {
                    color = new Color("#bb0000");
                } else if (Math.abs(x - 15) < DISK_PITCH / 2 || Math.abs(x - (poolLength - 15)) < DISK_PITCH / 2) {
                    // Using DISK_PITCH / 2 ensures only the single closest disk is colored yellow
                    color = new Color("#bbbb00");
                }
                meshRef.current.setColorAt(idx, color);
                idx++;
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [totalFloats, floatsPerRope, lanes, poolLength, y]);

    if (lanes <= 1 || totalFloats <= 0) return null;

    return (
        <>
            {Array.from({ length: lanes - 1 }).map((_, i) => (
                <mesh
                    key={i}
                    geometry={cordGeometry}
                    material={cordMaterial}
                    position={[poolLength / 2, y, (i + 1) * LANE_WIDTH_METERS]}
                />
            ))}
            <instancedMesh
                ref={meshRef}
                args={[geometry, material, totalFloats]}
                frustumCulled={false}
            />
        </>
    );
}

function LaneMarker({ laneIndex, x, z, y, font, displayIndex }: { laneIndex: number, x: number, z: number, y: number, font: string, displayIndex: number }) {
    return (
        <group position={[x, y + 0.165, z]}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.33, 0.33, 0.02]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text
                position={[0, 0, 0.011]}
                fontSize={0.2}
                color="black"
                font={font}
                anchorX="center"
                anchorY="middle"
            >
                {displayIndex.toString()}
            </Text>
            <Text
                position={[0, 0, -0.011]}
                rotation={[0, Math.PI, 0]}
                fontSize={0.2}
                color="black"
                font={font}
                anchorX="center"
                anchorY="middle"
            >
                {displayIndex.toString()}
            </Text>
        </group>
    );
}

export default function PoolScene(props: Pool3DProps) {
    const { camera, gl, scene, size } = useThree();
    const lanes = props.swimmers.length;
    const poolLengthMeters = props.poolLength === "SC" ? 22.86 : 50;
    const poolWidthMeters = lanes * LANE_WIDTH_METERS;

    const fontDataUri = useMemo(() => `data:font/ttf;base64,${ATKINSON_BOLD}`, []);

    useEffect(() => {
        if (typeof window !== "undefined" && gl.domElement) {
            const testWin = window as unknown as TestWindow;
            testWin.__TEST_CAMERA__ = camera;
            testWin.__TEST_SCENE__ = scene;
            gl.domElement.setAttribute('data-test-ready', 'true');
        }
    }, [camera, gl.domElement, scene]);

    useEffect(() => {
        const isRight = props.startingEnd === StartingEnd.RIGHT;
        const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;
        const observerZ = poolWidthMeters + 2.0;
        const lookAtX = isRight ? poolLengthMeters : 0;
        const lookAtZ = poolWidthMeters / 2;

        camera.position.set(observerX, DECK_Y + 1.67, observerZ);
        camera.lookAt(lookAtX, WATER_Y, lookAtZ);

        if (camera instanceof PerspectiveCamera) {
            const cam = camera as PerspectiveCamera;
            const aspect = (size.width / size.height) || 1.0;
            const hFOV = Math.PI / 2;
            const vFOV = 2 * Math.atan(Math.tan(hFOV / 2) / aspect);
            // eslint-disable-next-line react-hooks/immutability
            cam.fov = vFOV * (180 / Math.PI);
            cam.updateProjectionMatrix();
        }
    }, [camera, props.startingEnd, poolWidthMeters, poolLengthMeters, size]);

    return (
        <>
            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />

            {/* Deck Areas */}
            <mesh position={[poolLengthMeters / 2, DECK_Y, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters + 20, 10]} />
                <meshStandardMaterial color="#888888" />
            </mesh>
            <mesh position={[poolLengthMeters / 2, DECK_Y, poolWidthMeters + 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters + 20, 10]} />
                <meshStandardMaterial color="#888888" />
            </mesh>
            <mesh position={[-5, DECK_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, poolWidthMeters]} />
                <meshStandardMaterial color="#888888" />
            </mesh>
            <mesh position={[poolLengthMeters + 5, DECK_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, poolWidthMeters]} />
                <meshStandardMaterial color="#888888" />
            </mesh>

            {/* Pool Walls */}
            <mesh position={[0, (DECK_Y + FLOOR_Y) / 2, poolWidthMeters / 2]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[poolWidthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial color="#add8e6" side={DoubleSide} />
            </mesh>
            <mesh position={[poolLengthMeters, (DECK_Y + FLOOR_Y) / 2, poolWidthMeters / 2]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[poolWidthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial color="#add8e6" side={DoubleSide} />
            </mesh>
            <mesh position={[poolLengthMeters / 2, (DECK_Y + FLOOR_Y) / 2, 0]}>
                <planeGeometry args={[poolLengthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial color="#add8e6" side={DoubleSide} />
            </mesh>
            <mesh position={[poolLengthMeters / 2, (DECK_Y + FLOOR_Y) / 2, poolWidthMeters]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[poolLengthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial color="#add8e6" side={DoubleSide} />
            </mesh>

            {/* Water Surface */}
            <mesh position={[poolLengthMeters / 2, WATER_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial
                    color="#0099ff"
                    opacity={0.6}
                    transparent
                    side={DoubleSide}
                />
            </mesh>

            {/* Pool Floor */}
            <mesh position={[poolLengthMeters / 2, FLOOR_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial color="#add8e6" />
            </mesh>

            <LaneRopes poolLength={poolLengthMeters} lanes={lanes} y={WATER_Y} />

            {Array.from({ length: lanes }).map((_, i) => {
                const isRight = props.startingEnd === StartingEnd.RIGHT;
                const markerX = isRight ? poolLengthMeters + 0.2 : -0.2;
                const markerZ = (i + 0.5) * LANE_WIDTH_METERS;
                // If AWAY (Bottom to top), lane 1 is nearest viewer (highest index i)
                // If TOWARDS (Top to bottom), lane 1 is farthest from viewer (lowest index i)
                const displayIndex = props.numbering === NumberingDirection.AWAY ? lanes - i : i + 1;
                return (
                    <LaneMarker
                        key={i}
                        laneIndex={i}
                        x={markerX}
                        z={markerZ}
                        y={DECK_Y}
                        font={fontDataUri}
                        displayIndex={displayIndex}
                    />
                );
            })}

            {props.swimmers.map((swimmer, i) => (
                <Swimmer3D
                    key={i}
                    swimmer={swimmer}
                    laneIndex={i}
                    laneWidth={LANE_WIDTH_METERS}
                    poolLength={poolLengthMeters}
                    isRight={props.startingEnd === StartingEnd.RIGHT}
                    waterY={WATER_Y}
                />
            ))}
        </>
    );
}
