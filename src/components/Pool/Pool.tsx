'use client'
import { SwimmerModel } from "@/modules/SwimmerModel";
import { extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback } from "react";
import Swimmer from "../Swimmer/Swimmer";

extend({ Container, Graphics });

// 103.3.2A: Lane width is 2.5m
const LANE_WIDTH = 2.5;

export type PoolProps = {
    poolLength: "SC" | "LC";
    lanes: number;
};

export default function Pool(props: PoolProps) {
    const scale = 12;
    const length = scale * (props.poolLength === "SC" ? 25 : 50);
    const laneWidth = LANE_WIDTH * scale;
    const width = laneWidth * props.lanes;

    const drawWater = useCallback((graphics: Graphics) => {
        graphics.clear()
        graphics.rect(0, 0, length, width)
            .fill(0x1111CC)
            .stroke({ color: 0xFFFFFF, width: 1 })
    }, [length, width]);

    const drawLaneLines = useCallback((graphics: Graphics) => {
        graphics.clear();
        if (props.lanes > 0) {
            for (let i = 1; i < props.lanes; i++) {
                const y = i * laneWidth;
                graphics.moveTo(0, y)
                    .lineTo(length, y)
                    .stroke({ color: 0xCC0000, width: 3 });
            }
        }
    }, [props.lanes, length, laneWidth]);

    const swimmers: SwimmerModel[] = [];
    for (let l = 0; l < props.lanes; l++) {
        swimmers.push(new SwimmerModel([12 + Math.random() * 5, 13 + Math.random() * 5], Date.now()));
    }

    return (
        <pixiContainer x={100} y={100}>
            <pixiGraphics draw={drawWater} />
            <pixiGraphics draw={drawLaneLines} />
            {swimmers.map((swimmer, index) => (
                <Swimmer
                    key={index}
                    laneWidth={laneWidth}
                    startEnd={{ x: 0, y: (index + 0.5) * laneWidth }}
                    turnEnd={{ x: length, y: (index + 0.5) * laneWidth }}
                    swimmer={swimmer}
                />
            ))}
        </pixiContainer>
    )
}
