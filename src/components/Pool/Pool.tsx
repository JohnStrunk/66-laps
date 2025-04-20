'use client'
import Swimmer from "@/components/Swimmer/Swimmer";
import { ISwimmer } from "@/modules/SwimmerModel";
import { Application, extend, useApplication } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useRef } from "react";

extend({ Container, Graphics });

// 103.3.2A: Lane width is 2.5m
const LANE_WIDTH_METERS = 2.5;

export enum PoolLength {
    SC = "SC",
    LC = "LC",
}

export type PoolProps = {
    poolLength: PoolLength;
    swimmers: ISwimmer[];
    className?: string;
};

function PoolContents(props: PoolProps) {
    const app = useApplication();
    const screen = app.app.renderer?.screen || { width: 0, height: 0 };

    const lanes = props.swimmers.length;
    const poolLengthMeters = (props.poolLength === PoolLength.SC ? 25 : 50);
    const poolWidthMeters = LANE_WIDTH_METERS * lanes;
    const poolEdgeMeters = 2; // Width of the pool wall (meters)

    // Determine the scale factor to fit the pool to the canvas
    const scaleFactor = (Math.min(
        screen.width / (poolLengthMeters + 2 * poolEdgeMeters),
        screen.height / (poolWidthMeters + 2 * poolEdgeMeters)
    ));

    // Convert distances to pixels
    const poolLengthPixels = poolLengthMeters * scaleFactor;
    const poolWidthPixels = poolWidthMeters * scaleFactor;
    const poolEdgePixels = poolEdgeMeters * scaleFactor;
    const laneWidthPixels = LANE_WIDTH_METERS * scaleFactor;

    // Calculate the offset to center the pool in the canvas
    const offsetX = (screen.width - poolLengthPixels - 2 * poolEdgePixels) / 2;
    const offsetY = (screen.height - poolWidthPixels - 2 * poolEdgePixels) / 2;

    const drawPool = useCallback((graphics: Graphics) => {
        graphics.clear()

        // Draw the pool deck
        graphics.rect(offsetX, offsetY, (poolLengthPixels + 2 * poolEdgePixels), (poolWidthPixels + 2 * poolEdgePixels))
            .fill(0xCEC9BB);

        // Draw the water
        graphics.rect(offsetX + poolEdgePixels, offsetY + poolEdgePixels, poolLengthPixels, poolWidthPixels)
            .fill(0x1111CC);

        // Draw the lane lines
        if (lanes > 0) {
            for (let i = 1; i < lanes; i++) {
                const y = i * laneWidthPixels + poolEdgePixels + offsetY;
                graphics.moveTo(offsetX + poolEdgePixels, y)
                    // Lane lines should be inside the pool wall
                    .lineTo(poolLengthPixels + poolEdgePixels + offsetX, y)
                    .stroke({ color: 0xCC0000, width: 0.1 * scaleFactor });
            }
        }
    }, [offsetX, offsetY, poolEdgePixels, poolLengthPixels, poolWidthPixels, lanes, laneWidthPixels, scaleFactor]);

    return (
        <>
            <pixiGraphics draw={drawPool} />
            {props.swimmers.map((swimmer, index) => (
                <Swimmer
                    key={index}
                    laneWidth={laneWidthPixels}
                    startEnd={{ x: poolEdgePixels + offsetX, y: (index + 0.5) * laneWidthPixels + poolEdgePixels + offsetY }}
                    turnEnd={{ x: poolLengthPixels + poolEdgePixels + offsetX, y: (index + 0.5) * laneWidthPixels + poolEdgePixels + offsetY }}
                    swimmer={swimmer}
                />
            ))}
        </>
    )
}

export default function Pool(props: PoolProps) {
    const divRef = useRef<HTMLDivElement>(null);
    return (
        <div ref={divRef} className={props.className}>
            <Application
                autoDensity={true}
                antialias={true}
                resolution={window.devicePixelRatio || 1}
                backgroundColor={0x999999}
                backgroundAlpha={1}
                resizeTo={divRef}
            >
                <PoolContents {...props} />
            </Application>
        </div>
    );
}
