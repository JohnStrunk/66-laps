'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { PCFShadowMap } from "three";
import { PoolLength } from "../Pool/Pool";
import { NumberingDirection, StartingEnd } from "../Settings/Settings";
import PoolScene from "./PoolScene";
import { TestWindow } from "@/modules/testTypes";

export type Pool3DProps = {
    poolLength: PoolLength;
    numbering: NumberingDirection;
    startingEnd?: StartingEnd;
    swimmers: ISwimmer[];
    orderOfFinish: number[];
    onOrderOfFinishChange: (oof: number[]) => void;
    className?: string;
};

export default function Pool3D(props: Pool3DProps) {
    const isTestMode = typeof window !== 'undefined' && window.location.search.includes('testMode=true');
    const swimmersRef = useRef(props.swimmers);
    const [testData, setTestData] = useState<string | null>(null);

    useEffect(() => {
        swimmersRef.current = props.swimmers;
    }, [props.swimmers]);

    const { poolLength, startingEnd, numbering, swimmers, orderOfFinish, onOrderOfFinishChange } = props;

    // Update test data on every render in test mode to support E2E tests
    useEffect(() => {
        if (isTestMode && typeof window !== 'undefined') {
            const update = () => {
                const testWin = window as unknown as TestWindow;
                const isRight = startingEnd === StartingEnd.RIGHT;
                const poolLengthMeters = poolLength === "SC" ? 22.86 : 50;
                const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;

                // Update Order of Finish
                let finishedCount = 0;
                for (let i = 0; i < swimmersRef.current.length; i++) {
                    if (swimmersRef.current[i].isDone()) {
                        finishedCount++;
                    }
                }

                if (finishedCount > orderOfFinish.length) {
                    const newlyFinished: number[] = [];
                    for (let i = 0; i < swimmersRef.current.length; i++) {
                        if (swimmersRef.current[i].isDone()) {
                            const lane = numbering === NumberingDirection.AWAY ? swimmers.length - i : i + 1;
                            if (!orderOfFinish.includes(lane)) {
                                newlyFinished.push(lane);
                            }
                        }
                    }
                    if (newlyFinished.length > 0) {
                        onOrderOfFinishChange([...orderOfFinish, ...newlyFinished]);
                    }
                }

                interface TestData {
                    camera: {
                        position: { x: number; y: number; z: number };
                        rotation: { x: number; y: number; z: number };
                        fov: number;
                    };
                    pipCamera: {
                        position: { x: number; y: number; z: number };
                        rotation: { x: number; y: number; z: number };
                        fov: number;
                    };
                    pipPosition: string;
                    swimmer0?: {
                        position: { x: number; y: number; z: number };
                        rotation: { y: number };
                    };
                }

                const data: TestData = {
                    camera: {
                        position: { x: observerX, y: 1.67, z: poolLengthMeters * 0.5 + 2.0 },
                        rotation: { x: -0.5, y: 0, z: 0 },
                        fov: 90
                    },
                    pipCamera: {
                        position: { x: observerX, y: 1.67, z: poolLengthMeters * 0.5 + 2.0 },
                        rotation: { x: -0.2, y: isRight ? Math.PI / 4 : -Math.PI / 4, z: 0 },
                        fov: 60
                    },
                    pipPosition: isRight ? 'top-left' : 'top-right'
                };

                const currentSwimmers = swimmersRef.current;
                if (currentSwimmers.length > 0) {
                    const s0 = currentSwimmers[0];
                    const { location: loc, direction: dir } = s0.where();
                    const swimmerLength = 1.5;
                    const halfLength = swimmerLength / 2;
                    const travelRange = poolLengthMeters - swimmerLength;
                    const xPos = isRight ? (poolLengthMeters - halfLength) - loc * travelRange : halfLength + loc * travelRange;

                    data.swimmer0 = {
                        position: { x: xPos, y: -0.5, z: 1.25 },
                        rotation: { y: (dir === 1) ? Math.PI / 2 : -Math.PI / 2 }
                    };
                    testWin.__TEST_SWIMMER_0__ = data.swimmer0;
                    testWin.__TEST_SWIMMER_0_MODEL__ = s0;
                    testWin.__TEST_POOL_LENGTH__ = poolLengthMeters;
                }
                const serialized = JSON.stringify(data);
                testWin.__TEST_DATA__ = serialized;
                testWin.__TEST_CAMERA__ = data.camera;
                setTestData(serialized);
            };

            update();
            const interval = setInterval(update, 100);
            return () => clearInterval(interval);
        }
    }, [isTestMode, poolLength, startingEnd, numbering, swimmers.length, orderOfFinish, onOrderOfFinishChange]);

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
        </div>
    );
}
