'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { extend, useTick } from "@pixi/react";
import { Container, Graphics, GraphicsContext, PointData, Sprite, Text, TextStyle } from "pixi.js";
import { useState } from "react";

extend({ Container, Graphics, GraphicsContext, Sprite, Text });
const emojis = [
    "🦈",  // MOR
    "🩴",  // NCAC
    "🏠",  // RSA
    "🔱",  // TAC
    "🌊",  // WAVE
];

export type SwimmerProps = {
    /** Coordinates of the end wall at the start end of the pool */
    startEnd: PointData;
    /** Coordinates of the end wall at the turn end of the pool */
    turnEnd: PointData;
    /** Width of the lane (px) */
    laneWidth: number;
    /** The swimmer position */
    swimmer: ISwimmer;
};

function getPosition(startEnd: PointData, turnEnd: PointData, location: number): PointData {
    // Calculate the current position based on the location fraction
    const currentPosition = {
        x: startEnd.x + (turnEnd.x - startEnd.x) * location,
        y: startEnd.y + (turnEnd.y - startEnd.y) * location
    };
    return currentPosition;
};

export default function Swimmer(props: SwimmerProps) {
    // When first created, pick a random emoji from the list
    const [useChar,] = useState<string>(emojis[Math.floor(Math.random() * emojis.length)]);
    const [usePosition, setPosition] = useState<PointData>({ x: 0, y: 0 });

    useTick(() => {
        const swimmer = props.swimmer.where();
        const position = getPosition(props.startEnd, props.turnEnd, swimmer.location);
        setPosition(position);
    });

    return (
        <pixiText
            text={useChar}
            style={new TextStyle({
                fontSize: props.laneWidth * 0.5,
                fill: "white", // Text color
                fontFamily: "Noto Color Emoji",
                fontStyle: "normal",
            })}
            position={usePosition}
            anchor={{ x: props.swimmer.where().location, y: 0.5 }}
        />
    )
};
