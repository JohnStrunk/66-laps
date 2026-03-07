'use client'
import { ISwimmer } from "@/modules/SwimmerModel";
import { extend, useTick } from "@pixi/react";
import { Container, Graphics, GraphicsContext, PointData, Sprite, Text, TextStyle } from "pixi.js";
import { useRef } from "react";
import { getAnchor, getPosition } from "./swimmerUtils";

extend({ Container, Graphics, GraphicsContext, Sprite, Text });

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
            text={props.swimmer.avatar.emoji}
            style={new TextStyle({
                fontSize: props.laneWidth * 0.5,
                fill: "white", // Text color
                fontFamily: ["var(--font-noto-color-emoji)", "Noto Color Emoji", "sans-serif"],
                fontStyle: "normal",
            })}
        />
    )
};
