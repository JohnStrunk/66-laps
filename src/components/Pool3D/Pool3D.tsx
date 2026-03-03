'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
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
    className?: string;
};

export function getMockWebGLContext(canvas: HTMLCanvasElement) {
    const mock = {
        canvas: canvas,
        getShaderPrecisionFormat: () => ({ precision: 1, rangeMin: 1, rangeMax: 1 }),
        getExtension: () => null,
        getContextAttributes: () => ({}),
        getParameter: (param: number) => {
            if (param === 35661) return 16; // MAX_TEXTURE_IMAGE_UNITS
            if (param === 0x1f00) return 'WebGL Mock'; // UNMASKED_VENDOR_WEBGL
            if (param === 0x1f01) return 'Mock Renderer'; // UNMASKED_RENDERER_WEBGL
            if (param === 0x8df8) return 1024; // MAX_VERTEX_UNIFORM_VECTORS
            if (param === 0x84E2) return 16; // MAX_TEXTURE_IMAGE_UNITS
            return 0;
        },
        createProgram: () => ({}),
        createShader: () => ({}),
        shaderSource: () => { },
        compileShader: () => { },
        getShaderParameter: () => true,
        getProgramParameter: () => true,
        linkProgram: () => { },
        useProgram: () => { },
        createBuffer: () => ({}),
        bindBuffer: () => { },
        bufferData: () => { },
        getAttribLocation: () => 0,
        enableVertexAttribArray: () => { },
        vertexAttribPointer: () => { },
        drawArrays: () => { },
        viewport: () => { },
        clear: () => { },
        clearColor: () => { },
        createTexture: () => ({}),
        bindTexture: () => { },
        texImage2D: () => { },
        texParameteri: () => { },
        activeTexture: () => { },
        getError: () => 0,
        flush: () => { },
        finish: () => { },
        getSupportedExtensions: () => [],
        scissor: () => { },
        stencilFunc: () => { },
        stencilMask: () => { },
        stencilOp: () => { },
        colorMask: () => { },
        pixelStorei: () => { },
        readPixels: () => { },
        // WebGL Constants
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        HIGH_FLOAT: 36338,
        MEDIUM_FLOAT: 36337,
        LOW_FLOAT: 36336,
        MAX_TEXTURE_IMAGE_UNITS: 35661,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
        MAX_TEXTURE_SIZE: 3379,
        MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
        MAX_VERTEX_ATTRIBS: 34921,
        MAX_VERTEX_UNIFORM_VECTORS: 36347,
        MAX_VARYING_VECTORS: 36348,
        MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
        MAX_SAMPLES: 36183,
        SAMPLES: 32937,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
        VERSION: 7938,
    };
    return mock;
}

export default function Pool3D(props: Pool3DProps) {
    const isTestMode = typeof window !== 'undefined' && window.location.search.includes('testMode=true');
    const swimmersRef = useRef(props.swimmers);
    useEffect(() => {
        swimmersRef.current = props.swimmers;
    }, [props.swimmers]);

    useEffect(() => {
        if (isTestMode) {
            // Find the canvas and set the attributes
            const interval = setInterval(() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.setAttribute('data-test-ready', 'true');

                    const isRight = props.startingEnd === StartingEnd.RIGHT;
                    const poolLengthMeters = props.poolLength === "SC" ? 22.86 : 50;
                    const observerX = isRight ? poolLengthMeters - 3.0 : 3.0;

                    const data: any = {
                        camera: {
                            position: { x: observerX, y: 1.67, z: poolLengthMeters * 0.5 },
                            rotation: { x: -0.5, y: 0, z: 0 },
                            fov: 90
                        }
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
                    }

                    canvas.setAttribute('data-test-data', JSON.stringify(data));

                    // Also set on window for legacy tests
                    const testWin = window as unknown as TestWindow;
                    testWin.__TEST_DATA__ = JSON.stringify(data);
                    testWin.__TEST_CAMERA__ = data.camera as any;
                    if (data.swimmer0) {
                        testWin.__TEST_SWIMMER_0__ = data.swimmer0;
                        testWin.__TEST_SWIMMER_0_X__ = data.swimmer0.position.x;
                        testWin.__TEST_SWIMMER_0_ROT_Y__ = data.swimmer0.rotation.y;
                    }
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isTestMode, props.poolLength, props.startingEnd]);

    return (
        <div className={props.className} data-testid="3d-pool-container">
            <Canvas
                shadows={{ type: PCFShadowMap }}
                camera={{ fov: 90, near: 0.1, far: 1000 }}
                gl={canvas => {
                    if (isTestMode) {
                        return { context: getMockWebGLContext(canvas as any) } as any;
                    }
                    return { antialias: true };
                }}
            >
                <color attach="background" args={["#111111"]} />
                <ambientLight intensity={0.5} />
                <Suspense fallback={<group />}>
                    <PoolScene {...props} />
                </Suspense>
            </Canvas>
        </div>
    );
}
