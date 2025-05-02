'use client'
import Swimmer from "@/components/Swimmer/Swimmer";
import { ISwimmer } from "@/modules/SwimmerModel";
import { Application, extend, useApplication, useTick } from "@pixi/react";
import { Assets, Container, Graphics, Rectangle, TextStyle, Texture } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { NumberingDirection } from "../Settings/Settings";

extend({ Container, Graphics });

// 103.3.2A: Lane width is 2.5m
const LANE_WIDTH_METERS = 2.5;

export enum PoolLength {
    SC = "SC",
    LC = "LC",
}

export type PoolProps = {
    poolLength: PoolLength;
    numbering: NumberingDirection;
    swimmers: ISwimmer[];
    className?: string;
};


function PoolContents(props: PoolProps) {
    const app = useApplication();
    const lanes = props.swimmers.length;
    const poolLengthMeters = (props.poolLength === PoolLength.SC ? 25 : 50);
    const poolWidthMeters = LANE_WIDTH_METERS * lanes;
    const poolEdgeMeters = 2; // Width of the pool wall (meters)

    const [canvasRect, setCanvasRect] = useState(new Rectangle());

    const scaleFactor = (Math.min(
        canvasRect.width / (poolLengthMeters + 2 * poolEdgeMeters),
        canvasRect.height / (poolWidthMeters + 2 * poolEdgeMeters)
    ));

    // Convert distances to pixels
    const poolLengthPixels = poolLengthMeters * scaleFactor;
    const poolWidthPixels = poolWidthMeters * scaleFactor;
    const poolEdgePixels = poolEdgeMeters * scaleFactor;
    const laneWidthPixels = LANE_WIDTH_METERS * scaleFactor;

    // Calculate the offset to center the pool in the canvas
    const offsetX = (canvasRect.width - poolLengthPixels - 2 * poolEdgePixels) / 2;
    const offsetY = (canvasRect.height - poolWidthPixels - 2 * poolEdgePixels) / 2;

    const updateCanvasSize = useCallback(() => {
        // Determine if the canvas size has changed
        const canvas = app.app.renderer?.screen || new Rectangle();
        if (canvas.width !== canvasRect.width || canvas.height !== canvasRect.height) {
            // console.log("Canvas size changed", canvas.width, canvas.height);
            const canvasCopy = new Rectangle();
            canvasCopy.copyFrom(canvas);
            setCanvasRect(canvasCopy);
        }
    }, [app, canvasRect]);
    useTick(updateCanvasSize);

    const [waterImg, setWaterImg] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (waterImg === Texture.EMPTY) {
            Assets.load("/images/brushwalker437.png").then((texture: Texture) => {
                setWaterImg(texture);
            });
        }
    }, [waterImg]);

    const [deckImg, setDeckImg] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (deckImg === Texture.EMPTY) {
            Assets.load("/images/concrete2_seamless_diffuse_1k.png").then((texture: Texture) => {
                setDeckImg(texture);
            });
        }
    }, [deckImg]);

    const drawPool = (g: Graphics) => {
        // Draw the pool
        g.clear();
        // Draw the pool deck
        g.roundRect(offsetX, offsetY, (poolLengthPixels + 2 * poolEdgePixels), (poolWidthPixels + 2 * poolEdgePixels), poolEdgePixels / 3)
            // .fill(0xCEC9BB);
            .fill({
                texture: deckImg,
            });

        // Draw the water
        g.roundRect(offsetX + poolEdgePixels, offsetY + poolEdgePixels, poolLengthPixels, poolWidthPixels, poolEdgePixels / 6)
            .fill('black');
        g.roundRect(offsetX + poolEdgePixels, offsetY + poolEdgePixels, poolLengthPixels, poolWidthPixels, poolEdgePixels / 6)
            .stroke({
                color: 0x000000,
                width: 0.15 * scaleFactor,
            })
            .fill({
                texture: waterImg,
                alpha: 0.6,
            });
        // Draw the lane lines
        if (lanes > 0) {
            for (let i = 1; i < lanes; i++) {
                const y = i * laneWidthPixels + poolEdgePixels + offsetY;
                g.moveTo(offsetX + poolEdgePixels, y)
                    // Lane lines should be inside the pool wall
                    .lineTo(poolLengthPixels + poolEdgePixels + offsetX, y)
                    .stroke({ color: 0xCC0000, width: 0.15 * scaleFactor });
            }
        }
        // Draw lane numbers
        for (let i = 0; i < lanes; i++) {
            const y = (i + 0.5) * laneWidthPixels + poolEdgePixels + offsetY;
            g.moveTo(offsetX + poolEdgePixels / 2, y)
                .lineTo(offsetX + poolEdgePixels / 2, y)
                .stroke({ color: 0xFFFFFF, width: 0.1 * scaleFactor });
        }
    };

    return (
        <>
            <pixiGraphics draw={drawPool} />

            {Array.from({ length: lanes }).map((_, i) => (
                <pixiText key={i}
                    text={props.numbering === NumberingDirection.AWAY ? lanes - i : i + 1}
                    style={new TextStyle({
                        fontSize: laneWidthPixels * 0.5,
                        fill: "black", // Text color
                        fontFamily: "Atkinson Hyperlegible",
                        fontStyle: "normal",
                        fontWeight: "bold",
                        align: "center",
                        stroke: { color: "white", width: 0.1 * scaleFactor },
                    })}
                    position={{
                        x: poolEdgePixels / 2 + offsetX,
                        y: (i + 0.5) * laneWidthPixels + poolEdgePixels + offsetY,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                />
            ))}

            {props.swimmers.map((swimmer, index) => (
                <Swimmer
                    key={index}
                    laneWidth={laneWidthPixels}
                    startEnd={{
                        x: poolEdgePixels + offsetX,
                        y: (index + 0.5) * laneWidthPixels + poolEdgePixels + offsetY,
                    }}
                    turnEnd={{
                        x: poolLengthPixels + poolEdgePixels + offsetX,
                        y: (index + 0.5) * laneWidthPixels + poolEdgePixels + offsetY,
                    }}
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
                backgroundAlpha={0}
                resizeTo={divRef}
            >
                <PoolContents {...props} />
            </Application>
        </div>
    );
}
