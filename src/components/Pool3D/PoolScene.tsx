'use client'

import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { Color, DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, PerspectiveCamera, CylinderGeometry, RepeatWrapping, ShaderMaterial, Vector2, DataTexture, RGBAFormat, Shape, ShapeGeometry } from "three";
import { Text, useTexture } from "@react-three/drei";
import { useTheme } from "next-themes";
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

function BackstrokeFlags({ poolLength, poolWidth, lanes }: { poolLength: number, poolWidth: number, lanes: number }) {
    const cableHeight = WATER_Y + 2.0;
    const poleRadius = 0.025; // 5cm diameter -> 2.5cm radius
    const poleHeight = cableHeight - DECK_Y;
    const poleY = DECK_Y + poleHeight / 2;
    const poleZ1 = -0.33;
    const poleZ2 = poolWidth + 0.33;
    const cableLength = poleZ2 - poleZ1;
    const cableZCenter = (poleZ1 + poleZ2) / 2;

    const pennantsPerLane = 7;
    const totalPennants = lanes * pennantsPerLane * 2; // 2 ends

    const { poleGeo, poleMat, cableGeo, cableMat, pennantGeo, pennantMat } = useMemo(() => {
        const pGeo = new CylinderGeometry(poleRadius, poleRadius, poleHeight, 16);
        const pMat = new MeshStandardMaterial({ color: "#dddddd", roughness: 0.3 });

        const cGeo = new CylinderGeometry(0.002, 0.002, cableLength, 8);
        cGeo.rotateX(Math.PI / 2); // Orient along Z axis
        const cMat = new MeshStandardMaterial({ color: "#888888", roughness: 0.8 });

        const shape = new Shape();
        shape.moveTo(-0.1, 0);
        shape.lineTo(0.1, 0);
        shape.lineTo(0, -0.4);
        shape.lineTo(-0.1, 0);

        const penGeo = new ShapeGeometry(shape);
        const penMat = new MeshStandardMaterial({ side: DoubleSide, roughness: 0.6 });

        return { poleGeo: pGeo, poleMat: pMat, cableGeo: cGeo, cableMat: cMat, pennantGeo: penGeo, pennantMat: penMat };
    }, [poleHeight, cableLength]);

    const pennantMeshRef = useRef<InstancedMesh>(null);

    useEffect(() => {
        if (!pennantMeshRef.current || totalPennants === 0) return;
        const dummy = new Object3D();
        let idx = 0;
        const red = new Color("#bb0000");
        const yellow = new Color("#bbbb00");

        for (const endX of [5, poolLength - 5]) {
            let colorIdx = 0;
            for (let lane = 0; lane < lanes; lane++) {
                const laneStartZ = lane * LANE_WIDTH_METERS;
                const spacing = LANE_WIDTH_METERS / pennantsPerLane;
                for (let p = 0; p < pennantsPerLane; p++) {
                    const z = laneStartZ + (p + 0.5) * spacing;
                    dummy.position.set(endX, cableHeight, z);
                    dummy.rotation.set(0, Math.PI / 2, 0);
                    dummy.updateMatrix();
                    pennantMeshRef.current.setMatrixAt(idx, dummy.matrix);

                    pennantMeshRef.current.setColorAt(idx, colorIdx % 2 === 0 ? red : yellow);
                    colorIdx++;
                    idx++;
                }
            }
        }
        pennantMeshRef.current.instanceMatrix.needsUpdate = true;
        if (pennantMeshRef.current.instanceColor) pennantMeshRef.current.instanceColor.needsUpdate = true;
    }, [lanes, poolLength, cableHeight, totalPennants]);

    return (
        <group>
            <mesh geometry={poleGeo} material={poleMat} position={[5, poleY, poleZ1]} castShadow />
            <mesh geometry={poleGeo} material={poleMat} position={[5, poleY, poleZ2]} castShadow />
            <mesh geometry={cableGeo} material={cableMat} position={[5, cableHeight, cableZCenter]} castShadow />

            <mesh geometry={poleGeo} material={poleMat} position={[poolLength - 5, poleY, poleZ1]} castShadow />
            <mesh geometry={poleGeo} material={poleMat} position={[poolLength - 5, poleY, poleZ2]} castShadow />
            <mesh geometry={cableGeo} material={cableMat} position={[poolLength - 5, cableHeight, cableZCenter]} castShadow />

            <instancedMesh
                ref={pennantMeshRef}
                args={[pennantGeo, pennantMat, totalPennants]}
                castShadow
                frustumCulled={false}
            />
        </group>
    );
}

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

const waterShader = {
    uniforms: {
        uTime: { value: 0 },
        uPositions: { value: Array(MAX_SOURCES).fill(0).map(() => new Vector2(-100, -100)) },
        uVelocities: { value: Array(MAX_SOURCES).fill(0).map(() => new Vector2(0, 0)) },
        uWeights: { value: Array(MAX_SOURCES).fill(0) },
        uColor: { value: new Color("#001133") }
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

                if (localX > 0.1 && localX < 24.0 && abs(localY) < (localX - 0.1 + 0.05) * 0.8) {
                    float mask = smoothstep(0.8, 0.4, abs(localY) / (localX - 0.1 + 0.05)) * smoothstep(24.0, 16.0, localX);
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

export default function PoolScene(props: Pool3DProps & { isTestMode?: boolean }) {
    const { camera, gl, scene, size } = useThree();
    const { resolvedTheme } = useTheme();
    const lanes = props.swimmers.length;
    const poolLengthMeters = props.poolLength === "SC" ? 22.86 : 50;
    const poolWidthMeters = lanes * LANE_WIDTH_METERS;

    const waterMaterialRef = useRef<ShaderMaterial>(null);

    // Detect testMode and expose material reference immediately
    const isTestMode = props.isTestMode || (typeof window !== 'undefined' && window.location.search.includes('testMode=true'));

    // Small data texture in test mode to avoid hangs
    const mockTexture = useMemo(() => {
        const data = new Uint8Array([255, 255, 255, 255]);
        const tex = new DataTexture(data, 1, 1, RGBAFormat);
        tex.needsUpdate = true;
        return tex;
    }, []);

    const fontDataUri = useMemo(() => (isTestMode ? "" : `data:font/ttf;base64,${ATKINSON_BOLD}`), [isTestMode]);

    // Call hooks with tiny images in test mode to avoid hangs
    const concreteTextureReal = useTexture(isTestMode ? "/images/500-empty.png" : "/images/concrete2_seamless_diffuse_1k.png");
    const tileTextureReal = useTexture(isTestMode ? "/images/500-empty.png" : "/images/photoreal_tile_03-512x512_0.png");

    const concreteTexture = isTestMode ? mockTexture : concreteTextureReal;
    const tileTexture = isTestMode ? mockTexture : tileTextureReal;

    // PIP Camera
    const pipCamera = useMemo(() => {
        const cam = new PerspectiveCamera(60, 1, 0.1, 1000);
        return cam;
    }, []);

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

        // Detect direction change (turn) OR stop (end of race)
        const currentVel = new Vector2(vx, vz);
        const lastVel = lastVelRef.current[index];

        const isTurn = lastVel.length() > 0 && currentVel.length() > 0 && currentVel.dot(lastVel) < -0.5;
        const isStop = lastVel.length() > 0 && currentVel.length() === 0;

        if (isTurn || isStop) {
            // Transfer current state to ghost so it can decay naturally
            positionsRef.current[ghostIdx].copy(positionsRef.current[currentIdx]);
            velocitiesRef.current[ghostIdx].copy(lastVel); // Use previous velocity for the ghost
            weightsRef.current[ghostIdx] = 1.0;
        }
        lastVelRef.current[index].copy(currentVel);

        // Update current source
        positionsRef.current[currentIdx].set(x, z);
        velocitiesRef.current[currentIdx].set(vx, vz);
        weightsRef.current[currentIdx] = (vx === 0 && vz === 0) ? 0 : 1.0;
    }, []);

    useFrame((state, delta) => {
        if (typeof window !== 'undefined' && isTestMode) {
            (window as unknown as TestWindow).__TEST_WATER_MATERIAL__ = waterMaterialRef.current ?? undefined;
        }

        let finishedCount = 0;
        for (let i = 0; i < props.swimmers.length; i++) {
            if (props.swimmers[i].isDone()) {
                finishedCount++;
            }
        }

        if (finishedCount > props.orderOfFinish.length) {
            const newlyFinished: number[] = [];
            for (let i = 0; i < props.swimmers.length; i++) {
                if (props.swimmers[i].isDone()) {
                    const lane = props.numbering === NumberingDirection.AWAY ? lanes - i : i + 1;
                    if (!props.orderOfFinish.includes(lane)) {
                        newlyFinished.push(lane);
                    }
                }
            }
            if (newlyFinished.length > 0) {
                props.onOrderOfFinishChange([...props.orderOfFinish, ...newlyFinished]);
            }
        }

        const now = state.clock.elapsedTime;
        const speed = 1.5; // Matches 'u' in shader

        // Decay ghost weights and project their positions forward
        for (let i = MAX_SWIMMERS; i < MAX_SOURCES; i++) {
            if (weightsRef.current[i] > 0) {
                // Keep the ghost moving at its last velocity so ripples don't change phase speed
                positionsRef.current[i].x += velocitiesRef.current[i].x * speed * delta;
                positionsRef.current[i].y += velocitiesRef.current[i].y * speed * delta;

                weightsRef.current[i] = Math.max(0, weightsRef.current[i] - delta * 0.125); // Fade over 8s
            }
        }

        if (waterMaterialRef.current) {
            waterMaterialRef.current.uniforms.uTime.value = now;
            waterMaterialRef.current.uniforms.uPositions.value = positionsRef.current;
            waterMaterialRef.current.uniforms.uVelocities.value = velocitiesRef.current;
            waterMaterialRef.current.uniforms.uWeights.value = weightsRef.current;
            // Update color based on theme
            waterMaterialRef.current.uniforms.uColor.value.set(resolvedTheme === 'dark' ? "#001133" : "#0099ff");
        }

        // Manual render loop for PIP
        const { gl: renderer, scene: activeScene, camera: mainCamera, size: canvasSize } = state;
        const isRight = props.startingEnd === StartingEnd.RIGHT;

        // Update PIP camera
        pipCamera.position.copy(mainCamera.position);
        const pipLookAtX = isRight ? 0 : poolLengthMeters;
        const pipLookAtZ = 0; // Opposite side of the pool
        pipCamera.lookAt(pipLookAtX, WATER_Y, pipLookAtZ);
        if (mainCamera instanceof PerspectiveCamera) {
            // eslint-disable-next-line react-hooks/immutability
            pipCamera.aspect = mainCamera.aspect;
        }
        pipCamera.updateProjectionMatrix();

        // Viewport settings for PIP (1/4 size)
        const w = canvasSize.width / 4;
        const h = canvasSize.height / 4;
        const padding = 20;
        const borderWidth = 2;

        // Calculate border box position
        const borderX = isRight ? padding : canvasSize.width - w - padding - borderWidth * 2;
        const borderY = canvasSize.height - h - padding - borderWidth * 2;

        renderer.autoClear = false;
        renderer.clear();

        // 1. Render main view
        renderer.setViewport(0, 0, canvasSize.width, canvasSize.height);
        renderer.setScissor(0, 0, canvasSize.width, canvasSize.height);
        renderer.setScissorTest(false);
        renderer.render(activeScene, mainCamera);

        // 2. Render PIP border (white)
        renderer.setViewport(borderX, borderY, w + borderWidth * 2, h + borderWidth * 2);
        renderer.setScissor(borderX, borderY, w + borderWidth * 2, h + borderWidth * 2);
        renderer.setScissorTest(true);
        renderer.setClearColor("#ffffff");
        renderer.clear(true, true, true);

        // 3. Render PIP view
        const pipX = borderX + borderWidth;
        const pipY = borderY + borderWidth;
        renderer.setViewport(pipX, pipY, w, h);
        renderer.setScissor(pipX, pipY, w, h);
        renderer.clearDepth();
        renderer.render(activeScene, pipCamera);

        renderer.setScissorTest(false);
        // Reset clear color for next frame
        renderer.setClearColor("#111111");
    }, 1);

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
        if (typeof window !== "undefined") {
            const testWin = window as unknown as TestWindow;
            testWin.__TEST_CAMERA__ = camera;
            testWin.__TEST_SCENE__ = scene;

            // In some test environments, gl.domElement might be a mock or detached
            const el = gl.domElement || document.querySelector('canvas');
            if (el) {
                el.setAttribute('data-test-ready', 'true');
            }
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
                    args={[waterShader]}
                    transparent
                    side={DoubleSide}
                />
            </mesh>

            <mesh position={[poolLengthMeters / 2, FLOOR_Y, poolWidthMeters / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[poolLengthMeters, poolWidthMeters]} />
                <meshStandardMaterial map={textures.floorTexture} />
            </mesh>

            {!isTestMode && (
                <>
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
                </>
            )}

            <BackstrokeFlags poolLength={poolLengthMeters} poolWidth={poolWidthMeters} lanes={lanes} />

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

            {!isTestMode && props.orderOfFinish.length > 0 && (
                <group
                    position={[
                        props.startingEnd === StartingEnd.RIGHT ? poolLengthMeters - 3.0 : 3.0,
                        DECK_Y + 0.01,
                        poolWidthMeters + 0.3
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <Text
                        fontSize={0.4}
                        color="white"
                        font={fontDataUri}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor="#000000"
                    >
                        {props.orderOfFinish.join(" ")}
                    </Text>
                </group>
            )}
        </>
    );
}
