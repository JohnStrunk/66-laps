'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { extend, useTick } from "@pixi/react";
import { Container, Graphics, GraphicsContext, PointData, Sprite, Text, TextStyle } from "pixi.js";
import { useRef, useState } from "react";
import { getAnchor, getPosition } from "./swimmerUtils";

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

export default function Swimmer(props: SwimmerProps) {
    // When first created, pick a random emoji from the list
    const [useChar] = useState<string>(() => emojis[Math.floor(Math.random() * emojis.length)]);
    const textRef = useRef<Text>(null);

    useTick(() => {
        if (!textRef.current) return;
        const swimmer = props.swimmer.where();
        const position = getPosition(props.startEnd, props.turnEnd, swimmer.location);
        const anchor = getAnchor(props.startEnd, props.turnEnd, swimmer.location);
        textRef.current.position.set(position.x, position.y);
        textRef.current.anchor.set(anchor.x, anchor.y);
    });

    return (
        <pixiText
            ref={textRef}
            text={useChar}
            style={new TextStyle({
                fontSize: props.laneWidth * 0.5,
                fill: "white", // Text color
                fontFamily: "Noto Color Emoji",
                fontStyle: "normal",
            })}
        />
    )
};
