'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PCFShadowMap } from "three";
import * as THREE from "three";
import PoolScene from "./PoolScene";
import { NumberingDirection, StartingEnd } from "../Settings/Settings";
import { TestWindow } from "@/modules/testTypes";

export enum PoolLength {
    SC = "SC",
    LC = "LC",
}

export type Pool3DProps = {
    poolLength: PoolLength;
    numbering: NumberingDirection;
    startingEnd?: StartingEnd;
    swimmers: ISwimmer[];
    orderOfFinish: number[];
    onOrderOfFinishChange: (oof: number[]) => void;
    className?: string;
};

type TestData = {
    camera: {
        position: { x: number, y: number, z: number };
        rotation: { x: number, y: number, z: number };
        fov: number;
    };
    pipCamera?: {
        position: { x: number, y: number, z: number };
        rotation: { x: number, y: number, z: number };
        fov: number;
        corner?: string;
    };
    pipPosition?: string;
    swimmer0?: {
        position: { x: number, y: number, z: number };
        rotation: { y: number };
    };
    swimmers: { location: number; direction: number }[];
};

export default function Pool3D(props: Pool3DProps) {
    const isTestMode = typeof window !== 'undefined' && window.location.search.includes('testMode=true');
    const webGLAvailable = useMemo(() => {
        if (typeof window === 'undefined') return true;
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch {
            return false;
        }
    }, []);

    const swimmersRef = useRef(props.swimmers);
    useEffect(() => {
        swimmersRef.current = props.swimmers;
    }, [props.swimmers]);

    const [testData, setTestData] = useState<string | null>(null);

    const { poolLength, startingEnd, numbering, swimmers, orderOfFinish, onOrderOfFinishChange } = props;

    // In test mode, we want to expose some state to the window object so that Playwright can access it.
    useEffect(() => {
        if (isTestMode && typeof window !== 'undefined') {
            const testWin = window as unknown as TestWindow;

            // Shadow Mock Scene
            const mockScene = new THREE.Scene();
            const poolLengthMeters = poolLength === "SC" ? 22.86 : 50;
            const poolWidthMeters = swimmers.length * 2.5;

            // Mock Swimmers
            const mockSwimmers: THREE.Group[] = [];
            for (let i = 0; i < swimmers.length; i++) {
                const s = new THREE.Group();
                s.userData.type = 'Swimmer';
                const head = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial());
                head.name = 'head';
                head.position.set(0, 0, 0.45);
                s.add(head);
                mockScene.add(s);
                mockSwimmers.push(s);
                if (i === 0) testWin.__TEST_SWIMMER_0__ = s;
            }

            // Mock Lane Markers
            for (let i = 0; i < swimmers.length; i++) {
                const marker = new THREE.Group();
                marker.userData.type = 'LaneMarker';
                mockScene.add(marker);
            }

            // Mock Backstroke Flags (Poles)
            const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.5, 8);
            const poleMat = new THREE.MeshStandardMaterial();
            for (const x of [5, poolLengthMeters - 5]) {
                const poleZ1 = -0.33;
                const poleZ2 = poolWidthMeters + 0.33;
                for (const z of [poleZ1, poleZ2]) {
                    const pole = new THREE.Mesh(poleGeo, poleMat);
                    pole.position.set(x, 0.75, z);
                    mockScene.add(pole);
                }
            }

            // Mock Pennants
            const shape = new THREE.Shape();
            shape.moveTo(-0.1, 0);
            shape.lineTo(0.1, 0);
            shape.lineTo(0, -0.4);
            shape.lineTo(-0.1, 0);
            const penGeo = new THREE.ShapeGeometry(shape);
            const penMat = new THREE.MeshStandardMaterial();
            const totalPennants = swimmers.length * 7 * 2;
            const pennantMesh = new THREE.InstancedMesh(penGeo, penMat, totalPennants);
            mockScene.add(pennantMesh);

            // Mock Cables
            const cableGeo = new THREE.CylinderGeometry(0.002, 0.002, poolWidthMeters + 0.66, 8);
            const cableMat = new THREE.MeshStandardMaterial();
            for (const x of [5, poolLengthMeters - 5]) {
                const cable = new THREE.Mesh(cableGeo, cableMat);
                cable.position.set(x, 1.5, poolWidthMeters / 2);
                cable.rotation.x = Math.PI / 2;
                mockScene.add(cable);
            }

            testWin.__TEST_POOL_LENGTH__ = poolLengthMeters;
            if (swimmers.length > 0) {
                testWin.__TEST_SWIMMER_0_MODEL__ = swimmers[0];
            }

            const update = () => {
                const isRight = startingEnd === StartingEnd.RIGHT;
                const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;
                const observerZ = poolWidthMeters + 2.0;

                // Main Camera
                const camPos = { x: observerX, y: 1.67, z: observerZ };
                const camRot = { x: -0.5, y: 0, z: 0 };

                // PIP Camera
                const pipCorner = isRight ? "top-left" : "top-right";

                const data: TestData = {
                    camera: { position: camPos, rotation: camRot, fov: 90 },
                    pipCamera: {
                        position: camPos,
                        rotation: { x: 0, y: isRight ? Math.PI/4 : -Math.PI/4, z: 0 }, // Simplified rotation
                        fov: 60,
                        corner: pipCorner
                    },
                    pipPosition: pipCorner,
                    swimmers: []
                };

                const currentSwimmers = swimmersRef.current;
                if (currentSwimmers.length > 0) {
                    testWin.__TEST_SWIMMER_0_MODEL__ = currentSwimmers[0];
                }
                currentSwimmers.forEach((s, i) => {
                    const { location: loc, direction: dir } = s.where();
                    data.swimmers.push({ location: loc, direction: dir });
                    // SwimmerModel location is 0.0 to 1.0 along CURRENT lap.
                    // travelRange is poolLength - 1.5 (swimmer length)
                    const travelRange = poolLengthMeters - 1.5;
                    const x = isRight ? (poolLengthMeters - 0.75) - loc * travelRange : 0.75 + loc * travelRange;
                    const z = (i + 0.5) * 2.5;
                    const mockS = mockSwimmers[i];
                    if (mockS) {
                        mockS.position.set(x, -0.5, z);
                        const movingRight = isRight ? (dir === 0) : (dir === 1);
                        mockS.rotation.y = movingRight ? Math.PI / 2 : -Math.PI / 2;

                        if (i === 0) {
                            data.swimmer0 = {
                                position: { x, y: -0.5, z },
                                rotation: { y: mockS.rotation.y }
                            };
                        }
                    }
                });

                if (currentSwimmers.length > 0) {
                    const finished = currentSwimmers
                        .map((s, i) => {
                            const lane = numbering === NumberingDirection.AWAY ? currentSwimmers.length - i : i + 1;
                            return { lane, done: s.isDone() };
                        })
                        .filter(s => s.done);

                    if (finished.length > orderOfFinish.length) {
                        const newlyFinished = finished.filter(f => !orderOfFinish.includes(f.lane));
                        if (newlyFinished.length > 0) {
                            onOrderOfFinishChange([...orderOfFinish, ...newlyFinished.map(f => f.lane)]);
                        }
                    }
                }

                const serialized = JSON.stringify(data);
                testWin.__TEST_DATA__ = serialized;
                testWin.__TEST_CAMERA__ = { position: new THREE.Vector3(camPos.x, camPos.y, camPos.z) } as unknown as THREE.Camera;
                testWin.__TEST_SCENE__ = mockScene;
                testWin.__TEST_READY__ = true;
                setTestData(serialized);
            };

            update();
            const interval = setInterval(update, 100);

            // Mock Water Material
            const mockWaterMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color("#0099ff") },
                    uPositions: { value: [] },
                    uVelocities: { value: [] },
                    uWeights: { value: [] },
                }
            });
            testWin.__TEST_WATER_MATERIAL__ = mockWaterMaterial;

            return () => {
                clearInterval(interval);
                if (testWin.__TEST_SCENE__ === mockScene) {
                    delete testWin.__TEST_SCENE__;
                    delete testWin.__TEST_READY__;
                    delete testWin.__TEST_WATER_MATERIAL__;
                    delete testWin.__TEST_SWIMMER_0__;
                }
            };
        }
    }, [isTestMode, poolLength, startingEnd, numbering, swimmers, orderOfFinish, onOrderOfFinishChange]);

    return (
        <div
            className={props.className}
            data-testid="3d-pool-container"
            data-test-ready={isTestMode && testData ? "true" : undefined}
            data-test-data={isTestMode && testData ? testData : undefined}
            data-swimmer-count={isTestMode ? swimmers.length : undefined}
            data-oof-value={isTestMode ? orderOfFinish.join(" ") : undefined}
        >
            {isTestMode && orderOfFinish.length > 0 && (
                <div data-testid="order-of-finish" style={{ display: 'none' }}>
                    {orderOfFinish.join(" ")}
                </div>
            )}
            {isTestMode && !webGLAvailable && (
                <div style={{ padding: '20px', color: 'red' }}>
                    WebGL not available. Shadow Mock is active.
                </div>
            )}
            {webGLAvailable && (
                <Canvas
                    shadows={{ type: PCFShadowMap }}
                    camera={{ fov: 90, near: 0.1, far: 1000 }}
                    gl={{ antialias: false }}
                >
                    <color attach="background" args={["#111111"]} />
                    <ambientLight intensity={0.5} />
                    <Suspense fallback={<group />}>
                        <PoolScene {...props} isTestMode={isTestMode} />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}
