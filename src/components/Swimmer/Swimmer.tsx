'use client'
import { extend } from "@pixi/react";
import { Assets, Container, Graphics, GraphicsContext, Sprite } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import swimSVG from "./mdi-swim.svg";

extend({ Container, Graphics, GraphicsContext, Sprite });

export default function Swimmer() {
    const graphicsRef = useRef<Graphics>(null);
    const [swimGraphic, setSwimGraphic] = useState<GraphicsContext>(new GraphicsContext());
    useEffect(() => {
        if (swimGraphic.bounds.width < 1) {
            Assets.load({
                src: swimSVG.src,
                data: { parseAsGraphicsContext: true, }
            }).then((result: GraphicsContext) => {
                setSwimGraphic(result);
            });
        }
    }, [swimGraphic]);

    // useTick((ticker) => {
    //     ticker.maxFPS = 30;
    //     ticker.minFPS = 10;
    //     if (graphicsRef.current) {
    //         const g = graphicsRef.current;
    //         g.rotation += 0.01 * ticker.deltaTime;
    //     }
    // })

    return (
        <pixiGraphics draw={(g: Graphics) => {
            g.clear();
            g.context = swimGraphic;
            graphicsRef.current = g;

            // Make the axis of rotation/scaling the center of the swimmer
            const bounds = g.getLocalBounds()
            g.pivot.set((bounds.x + bounds.width) / 2, (bounds.y + bounds.height) / 2);

            g.scale.set(5);
            g.stroke({ color: 0xFFFFFF, width: 1 });
            g.fill(0x00ff00);

            //flip horizontally
            g.scale.x *= -1;

            g.position.set(150, 100);
        }} />
    )
}
