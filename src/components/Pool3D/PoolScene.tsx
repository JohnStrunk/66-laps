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

// We use 2 slots per swimmer (current + ghost)
const MAX_SWIMMERS = 10;
const MAX_SOURCES = MAX_SWIMMERS * 2;

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
        uPositions: { value: Array(MAX_SOURCES).fill(new Vector2(-100, -100)) },
        uVelocities: { value: Array(MAX_SOURCES).fill(new Vector2(0, 0)) },
        uWeights: { value: Array(MAX_SOURCES).fill(0) },
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
        uniform vec2 uPositions[${MAX_SOURCES}];
        uniform vec2 uVelocities[${MAX_SOURCES}];
        uniform float uWeights[${MAX_SOURCES}];
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
            float totalWake = 0.0;
            float g = 9.81;
            float u = 1.5;
            float k0 = g / (u * u);

            for(int i = 0; i < ${MAX_SOURCES}; i++) {
                float weight = uWeights[i];
                if (weight <= 0.0) continue;

                vec2 pos = uPositions[i];
                vec2 vel = uVelocities[i];

                vec2 dirForward = normalize(vel);
                vec2 dirRight = vec2(-dirForward.y, dirForward.x);
                vec2 toPixel = vWorldPosition.xz - pos;

                float localX = dot(toPixel, -dirForward);
                float localY = dot(toPixel, dirRight);

                if (localX > -0.5 && localX < 12.0 && abs(localY) < (localX + 0.5) * 0.8) {
                    float mask = smoothstep(0.8, 0.4, abs(localY) / (localX + 0.5)) * smoothstep(12.0, 8.0, localX);
                    float swimmerWake = 0.0;
                    for (int j = 0; j < 4; j++) {
                        float theta = (float(j) / 3.0 - 0.5) * 1.2;
                        float cosT = cos(theta);
                        float sinT = sin(theta);
                        float k = k0 / (cosT * cosT);
                        float phase = k * (localX * cosT + localY * sinT);
                        float omega = sqrt(g * k);

                        swimmerWake += cos(phase - uTime * omega * 1.2) / (sqrt(abs(localX) + 1.0) * cosT);
                    }
                    totalWake += (swimmerWake / 4.0) * mask * weight;
                }
            }

            vec3 finalColor = uColor + (totalWake * 0.4);
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

    const waterMaterialRef = useRef<ShaderMaterial>(null);

    // State for current and ghost sources
    const positionsRef = useRef<Vector2[]>(Array(MAX_SOURCES).fill(0).map(() => new Vector2(-100, -100)));
    const velocitiesRef = useRef<Vector2[]>(Array(MAX_SOURCES).fill(0).map(() => new Vector2(0, 0)));
    const weightsRef = useRef<number[]>(Array(MAX_SOURCES).fill(0));

    // Tracking previous velocities to detect turns
    const lastVelRef = useRef<Vector2[]>(Array(MAX_SWIMMERS).fill(0).map(() => new Vector2(0, 0)));

    const handleSwimmerPositionUpdate = useCallback((index: number, x: number, z: number, vx: number, vz: number) => {
        if (index >= MAX_SWIMMERS) return;

        const currentIdx = index;
        const ghostIdx = index + MAX_SWIMMERS;

        // Detect direction change (turn)
        const currentVel = new Vector2(vx, vz);
        if (lastVelRef.current[index].length() > 0 && currentVel.dot(lastVelRef.current[index]) < -0.5) {
            // Transfer current state to ghost
            positionsRef.current[ghostIdx].copy(positionsRef.current[currentIdx]);
            velocitiesRef.current[ghostIdx].copy(velocitiesRef.current[currentIdx]);
            weightsRef.current[ghostIdx] = 1.0;
        }
        lastVelRef.current[index].copy(currentVel);

        // Update current source
        positionsRef.current[currentIdx].set(x, z);
        velocitiesRef.current[currentIdx].set(vx, vz);
        weightsRef.current[currentIdx] = (vx === 0 && vz === 0) ? 0 : 1.0;
    }, []);

    useFrame((state, delta) => {
        const now = state.clock.elapsedTime;
        const speed = 1.5; // Matches 'u' in shader

        // Decay ghost weights and project their positions forward
        for (let i = MAX_SWIMMERS; i < MAX_SOURCES; i++) {
            if (weightsRef.current[i] > 0) {
                // Keep the ghost moving at its last velocity so ripples don't change phase speed
                positionsRef.current[i].x += velocitiesRef.current[i].x * speed * delta;
                positionsRef.current[i].y += velocitiesRef.current[i].y * speed * delta;

                weightsRef.current[i] = Math.max(0, weightsRef.current[i] - delta * 0.25); // Fade over 4s (twice as long)
            }
        }

        if (waterMaterialRef.current) {
            waterMaterialRef.current.uniforms.uTime.value = now;
            waterMaterialRef.current.uniforms.uPositions.value = positionsRef.current;
            waterMaterialRef.current.uniforms.uVelocities.value = velocitiesRef.current;
            waterMaterialRef.current.uniforms.uWeights.value = weightsRef.current;
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

            <mesh position={[poolLengthMeters / 2, WATER_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters, 128, 64]} />
                <shaderMaterial
                    ref={waterMaterialRef}
                    args={[WaterShader]}
                    transparent
                    side={DoubleSide}
                />
            </mesh>

            <mesh position={[poolLengthMeters / 2, FLOOR_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial map={textures.floorTexture} />
            </mesh>

            {Array.from({ length: lanes }).map((_, i: number) => (
                <LaneMarkings
                    key={`marking-${i}`}
                    poolLength={poolLengthMeters}
                    zCenter={(i + 0.5) * LANE_WIDTH_METERS}
                    yFloor={FLOOR_Y}
                />
            ))}

            <LaneRopes poolLength={poolLengthMeters} lanes={lanes} y={WATER_Y} />

            {Array.from({ length: lanes }).map((_, i: number) => {
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
