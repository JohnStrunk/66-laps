'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { Application, ApplicationRef, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import Swimmer from "../Swimmer/Swimmer";

extend({ Container, Graphics });

// 103.3.2A: Lane width is 2.5m
const LANE_WIDTH = 2.5;

export enum PoolLength {
    SC = "SC",
    LC = "LC",
}

export type PoolProps = {
    poolLength: PoolLength;
    swimmers: ISwimmer[];
    className?: string;
};

export default function Pool(props: PoolProps) {
    const lanes = props.swimmers.length;
    const scale = 10; // 10px per meter
    // console.log("clientWidth", props.resizeTo?.current?.clientWidth);
    const length = scale * (props.poolLength === PoolLength.SC ? 25 : 50);
    const laneWidth = LANE_WIDTH * scale;
    const width = laneWidth * lanes;
    const wallWidth = 1; // Wall width in pixels
    console.log("Pool length", length, "width", width, "lanes", lanes);

    const drawWater = useCallback((graphics: Graphics) => {
        graphics.clear()
        graphics.rect(0, 0, length, width)
            .fill(0x1111CC)
            // .stroke({ color: 0xFFFFFF, width: wallWidth })
            .stroke({ color: 0x00FF00, width: wallWidth * 10 })
    }, [length, width]);

    const drawLaneLines = useCallback((graphics: Graphics) => {
        graphics.clear();
        if (lanes > 0) {
            for (let i = 1; i < lanes; i++) {
                const y = i * laneWidth;
                graphics.moveTo(0, y)
                    // Lane lines should be inside the pool wall
                    .lineTo(length - wallWidth, y)
                    .stroke({ color: 0xCC0000, width: 3 });
            }
        }
    }, [lanes, length, laneWidth]);

    const appRef = useRef<ApplicationRef>(null);
    useEffect(() => {
        if (appRef.current) {
            const canvas = appRef.current.getCanvas()
            if (canvas) {
                canvas.width = length;
                canvas.height = width;
            }
        }
    }, [length, width]);

    const divRef = useRef<HTMLDivElement>(null);
    return (
        <div ref={divRef} className={props.className}>
            <Application autoDensity={true} antialias={true} resolution={window.devicePixelRatio || 1} backgroundColor={0x999999} backgroundAlpha={1} resizeTo={divRef} ref={appRef}>
                <pixiGraphics draw={drawWater} />
                <pixiGraphics draw={drawLaneLines} />
                {props.swimmers.map((swimmer, index) => (
                    <Swimmer
                        key={index}
                        laneWidth={laneWidth}
                        startEnd={{ x: 0, y: (index + 0.5) * laneWidth }}
                        turnEnd={{ x: length, y: (index + 0.5) * laneWidth }}
                        swimmer={swimmer}
                    />
                ))}
            </Application>
        </div>
    )
}
