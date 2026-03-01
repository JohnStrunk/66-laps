'use client'

import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { Color, DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, PerspectiveCamera, CylinderGeometry, RepeatWrapping, ShaderMaterial, Vector2 } from "three";
import { Text, useTexture } from "@react-three/drei";
import { Pool3DProps } from "./Pool3D";
import { NumberingDirection, StartingEnd } from "../Settings/Settings";
import Swimmer3D from "./Swimmer3D";
import { TestWindow } from "@/modules/testTypes";
import { ATKINSON_BOLD } from "@/modules/fonts/AtkinsonBold";
import { ISwimmer } from "@/modules/SwimmerModel";

const LANE_WIDTH_METERS = 2.5;
const DISK_DIAMETER = 0.12;
const DISK_THICKNESS = 0.03;
const DISK_SPACING = 0.05;
const DISK_PITCH = DISK_THICKNESS + DISK_SPACING;

const DECK_Y = 0;
const WATER_Y = -0.5;
const POOL_DEPTH = 3.0;
const FLOOR_Y = WATER_Y - POOL_DEPTH;

const MAX_SWIMMERS = 10;

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

function LaneMarker({ x, z, y, font, displayIndex }: { x: number, z: number, y: number, font: string, displayIndex: number }) {
    return (
        <group position={[x, y + 0.165, z]}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.33, 0.33, 0.02]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text
                position={[0, 0, 0.011]}
                fontSize={0.28}
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
                fontSize={0.28}
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

function LaneMarkings({ poolLength, zCenter, yFloor }: { poolLength: number, zCenter: number, yFloor: number }) {
    const stripeWidth = 0.25;
    const tCrossbarWidth = 1.0;
    const tCrossbarLength = 0.25;
    const distanceFromWall = 2.0;

    const xStartT = distanceFromWall + tCrossbarLength / 2;
    const xEndT = poolLength - distanceFromWall - tCrossbarLength / 2;
    const stripeStart = distanceFromWall + tCrossbarLength;
    const stripeEnd = poolLength - distanceFromWall - tCrossbarLength;
    const mainStripeLength = stripeEnd - stripeStart;
    const xMainStripe = (stripeStart + stripeEnd) / 2;

    const wallPlusThickness = 0.25;
    const wallPlusHorizontalWidth = LANE_WIDTH_METERS * 0.75;
    const wallPlusVerticalTop = -0.04;
    const wallPlusVerticalHeight = (Math.abs(wallPlusVerticalTop - WATER_Y)) * 2;

    return (
        <>
            <group position={[0, yFloor + 0.01, 0]}>
                <mesh position={[xStartT, 0, zCenter]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[tCrossbarLength, tCrossbarWidth]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                <mesh position={[xEndT, 0, zCenter]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[tCrossbarLength, tCrossbarWidth]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                <mesh position={[xMainStripe, 0, zCenter]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[mainStripeLength, stripeWidth]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
            </group>

            <group position={[0.01, WATER_Y, zCenter]} rotation={[0, Math.PI / 2, 0]}>
                <mesh>
                    <planeGeometry args={[wallPlusThickness, wallPlusVerticalHeight]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                <mesh>
                    <planeGeometry args={[wallPlusHorizontalWidth, wallPlusThickness]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
            </group>

            <group position={[poolLength - 0.01, WATER_Y, zCenter]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh>
                    <planeGeometry args={[wallPlusThickness, wallPlusVerticalHeight]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                <mesh>
                    <planeGeometry args={[wallPlusHorizontalWidth, wallPlusThickness]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
            </group>
        </>
    );
}

const WaterShader = {
    uniforms: {
        uTime: { value: 0 },
        uSwimmerPositions: { value: Array(MAX_SWIMMERS).fill(new Vector2(-100, -100)) },
        uSwimmerVelocities: { value: Array(MAX_SWIMMERS).fill(new Vector2(0, 0)) },
        uNumSwimmers: { value: 0 },
        uColor: { value: new Color("#0099ff") }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
            vUv = uv;
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec2 uSwimmerPositions[${MAX_SWIMMERS}];
        uniform vec2 uSwimmerVelocities[${MAX_SWIMMERS}];
        uniform int uNumSwimmers;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
            float totalWake = 0.0;
            float g = 9.81;
            float u = 1.5; // Assumed average swimming speed for wave calculation
            float k0 = g / (u * u);

            for(int i = 0; i < ${MAX_SWIMMERS}; i++) {
                if (i >= uNumSwimmers) break;

                vec2 swimmerPos = uSwimmerPositions[i];
                vec2 swimmerVel = uSwimmerVelocities[i];
                if (length(swimmerVel) < 0.1) continue;

                vec2 dirForward = normalize(swimmerVel);
                vec2 dirRight = vec2(-dirForward.y, dirForward.x);

                vec2 toPixel = vWorldPosition.xz - swimmerPos;

                // Transform to local coordinates:
                // localX is distance BEHIND the swimmer
                // localY is lateral distance
                float localX = dot(toPixel, -dirForward);
                float localY = dot(toPixel, dirRight);

                // Kelvin wake is contained within ~19.5 degrees (tan approx 0.35)
                // We expand it slightly for visual softness
                if (localX > 0.0 && localX < 6.0 && abs(localY) < localX * 0.8) {
                    float mask = smoothstep(0.8, 0.4, abs(localY) / localX) * smoothstep(6.0, 4.0, localX);

                    float swimmerWake = 0.0;
                    // Sum wave components at different angles
                    for (int j = 0; j < 6; j++) {
                        float theta = (float(j) / 5.0 - 0.5) * 1.2; // Sample angles
                        float cosT = cos(theta);
                        float sinT = sin(theta);

                        // Phase based on deep water dispersion relation
                        float k = k0 / (cosT * cosT);
                        float phase = k * (localX * cosT + localY * sinT);
                        float omega = sqrt(g * k);

                        swimmerWake += cos(phase - uTime * omega * 1.2) / (sqrt(localX + 0.5) * cosT);
                    }
                    totalWake += (swimmerWake / 6.0) * mask;
                }
            }

            // Add highlights and shadows based on wake height
            vec3 finalColor = uColor + (totalWake * 0.4);
            // Add a slight top-down sparkle
            finalColor += max(0.0, totalWake) * 0.2;

            gl_FragColor = vec4(finalColor, 0.7);
        }
    `
};

export default function PoolScene(props: Pool3DProps) {
    const { camera, gl, scene, size } = useThree();
    const lanes = props.swimmers.length;
    const poolLengthMeters = props.poolLength === "SC" ? 22.86 : 50;
    const poolWidthMeters = lanes * LANE_WIDTH_METERS;

    const fontDataUri = useMemo(() => `data:font/ttf;base64,${ATKINSON_BOLD}`, []);
    const concreteTexture = useTexture("/images/concrete2_seamless_diffuse_1k.png");
    const tileTexture = useTexture("/images/photoreal_tile_03-512x512_0.png");

    const swimmerPositions = useRef<Vector2[]>(Array(MAX_SWIMMERS).fill(0).map(() => new Vector2(-100, -100)));
    const swimmerVelocities = useRef<Vector2[]>(Array(MAX_SWIMMERS).fill(0).map(() => new Vector2(0, 0)));
    const waterMaterialRef = useRef<ShaderMaterial>(null);

    const handleSwimmerPositionUpdate = useCallback((index: number, x: number, z: number, vx: number, vz: number) => {
        if (index < MAX_SWIMMERS) {
            swimmerPositions.current[index].set(x, z);
            swimmerVelocities.current[index].set(vx, vz);
        }
    }, []);

    useFrame((state) => {
        if (waterMaterialRef.current) {
            waterMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            waterMaterialRef.current.uniforms.uSwimmerPositions.value = swimmerPositions.current;
            waterMaterialRef.current.uniforms.uSwimmerVelocities.value = swimmerVelocities.current;
            waterMaterialRef.current.uniforms.uNumSwimmers.value = lanes;
        }
    });

    const textures = useMemo(() => {
        const sn = concreteTexture.clone();
        sn.wrapS = sn.wrapT = RepeatWrapping;
        sn.repeat.set((poolLengthMeters + 20) / 2, 10 / 2);

        const we = concreteTexture.clone();
        we.wrapS = we.wrapT = RepeatWrapping;
        we.repeat.set(10 / 2, poolWidthMeters / 2);

        const floor = concreteTexture.clone();
        floor.wrapS = floor.wrapT = RepeatWrapping;
        floor.repeat.set(poolLengthMeters / 2, poolWidthMeters / 2);

        const wallLong = tileTexture.clone();
        wallLong.wrapS = wallLong.wrapT = RepeatWrapping;
        const totalDepth = DECK_Y - FLOOR_Y;
        wallLong.repeat.set(poolLengthMeters / 0.75, totalDepth / 0.75);

        const wallWide = tileTexture.clone();
        wallWide.wrapS = wallWide.wrapT = RepeatWrapping;
        wallWide.repeat.set(poolWidthMeters / 0.75, totalDepth / 0.75);

        return {
            southNorthTexture: sn,
            westEastTexture: we,
            floorTexture: floor,
            wallLongTexture: wallLong,
            wallWideTexture: wallWide
        };
    }, [concreteTexture, tileTexture, poolLengthMeters, poolWidthMeters]);
    // Expose for testing
    useEffect(() => {
        if (typeof window !== "undefined" && gl.domElement) {
            const testWin = window as unknown as TestWindow;
            testWin.__TEST_CAMERA__ = camera;
            testWin.__TEST_SCENE__ = scene;

            // Periodically update a serialized version for robust testing
            const interval = setInterval(() => {
                const data = {
                    camera: {
                        position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
                        rotation: { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z },
                        fov: (camera as PerspectiveCamera).fov
                    }
                };
                (window as any).__TEST_DATA__ = JSON.stringify(data);
            }, 100);

            gl.domElement.setAttribute('data-test-ready', 'true');
            return () => clearInterval(interval);
        }
    }, [camera, gl.domElement, scene]);


    useEffect(() => {
        const isRight = props.startingEnd === StartingEnd.RIGHT;
        const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;
        const observerZ = poolWidthMeters + 2.0;
        const lookAtX = isRight ? poolLengthMeters - 3.0 : 3.0;
        const lookAtZ = poolWidthMeters / 2;

        camera.position.set(observerX, DECK_Y + 1.67, observerZ);
        camera.lookAt(lookAtX, -2.0, lookAtZ);

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
                <meshStandardMaterial map={textures.southNorthTexture} />
            </mesh>
            <mesh position={[poolLengthMeters / 2, DECK_Y, poolWidthMeters + 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[poolLengthMeters + 20, 10]} />
                <meshStandardMaterial map={textures.southNorthTexture} />
            </mesh>
            <mesh position={[-5, DECK_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, poolWidthMeters]} />
                <meshStandardMaterial map={textures.westEastTexture} />
            </mesh>
            <mesh position={[poolLengthMeters + 5, DECK_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[10, poolWidthMeters]} />
                <meshStandardMaterial map={textures.westEastTexture} />
            </mesh>

            {/* Pool Walls */}
            <mesh position={[0, (DECK_Y + FLOOR_Y) / 2, poolWidthMeters / 2]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[poolWidthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial map={textures.wallWideTexture} side={DoubleSide} />
            </mesh>
            <mesh position={[poolLengthMeters, (DECK_Y + FLOOR_Y) / 2, poolWidthMeters / 2]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[poolWidthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial map={textures.wallWideTexture} side={DoubleSide} />
            </mesh>
            <mesh position={[poolLengthMeters / 2, (DECK_Y + FLOOR_Y) / 2, 0]}>
                <planeGeometry args={[poolLengthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial map={textures.wallLongTexture} side={DoubleSide} />
            </mesh>
            <mesh position={[poolLengthMeters / 2, (DECK_Y + FLOOR_Y) / 2, poolWidthMeters]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[poolLengthMeters, DECK_Y - FLOOR_Y]} />
                <meshStandardMaterial map={textures.wallLongTexture} side={DoubleSide} />
            </mesh>

            {/* Water Surface with Ripples */}
            <mesh position={[poolLengthMeters / 2, WATER_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters, 128, 64]} />
                <shaderMaterial
                    ref={waterMaterialRef}
                    args={[WaterShader]}
                    transparent
                    side={DoubleSide}
                />
            </mesh>

            {/* Pool Floor */}
            <mesh position={[poolLengthMeters / 2, FLOOR_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial map={textures.floorTexture} />
            </mesh>

            {/* Lane Markings */}
            {Array.from({ length: lanes }).map((_, i) => (
                <LaneMarkings
                    key={`marking-${i}`}
                    poolLength={poolLengthMeters}
                    zCenter={(i + 0.5) * LANE_WIDTH_METERS}
                    yFloor={FLOOR_Y}
                />
            ))}

            <LaneRopes poolLength={poolLengthMeters} lanes={lanes} y={WATER_Y} />

            {Array.from({ length: lanes }).map((_, i) => {
                const isRight = props.startingEnd === StartingEnd.RIGHT;
                const markerX = isRight ? poolLengthMeters + 0.2 : -0.2;
                const markerZ = (i + 0.5) * LANE_WIDTH_METERS;
                const displayIndex = props.numbering === NumberingDirection.AWAY ? lanes - i : i + 1;
                return (
                    <LaneMarker
                        key={i}
                        x={markerX}
                        z={markerZ}
                        y={DECK_Y}
                        font={fontDataUri}
                        displayIndex={displayIndex}
                    />
                );
            })}

            {props.swimmers.map((swimmer: ISwimmer, i: number) => (
                <Swimmer3D
                    key={i}
                    swimmer={swimmer}
                    laneIndex={i}
                    laneWidth={LANE_WIDTH_METERS}
                    poolLength={poolLengthMeters}
                    isRight={props.startingEnd === StartingEnd.RIGHT}
                    waterY={WATER_Y}
                    onPositionUpdate={handleSwimmerPositionUpdate}
                />
            ))}
        </>
    );
}
