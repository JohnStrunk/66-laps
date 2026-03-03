import { PointData } from "pixi.js";

/**
 * Calculates the current position of a swimmer based on their location fraction.
 *
 * @param startEnd - Coordinates of the start end wall
 * @param turnEnd - Coordinates of the turn end wall
 * @param location - Fraction of distance from start to turn end (0 to 1)
 * @returns Current coordinates
 */
export function getPosition(startEnd: PointData, turnEnd: PointData, location: number): PointData {
    return {
        x: startEnd.x + (turnEnd.x - startEnd.x) * location,
        y: startEnd.y + (turnEnd.y - startEnd.y) * location
    };
}

/**
 * Calculates the anchor for the swimmer's representation to keep them inside the pool.
 *
 * @param startEnd - Coordinates of the start end wall
 * @param turnEnd - Coordinates of the turn end wall
 * @param location - Fraction of distance from start to turn end (0 to 1)
 * @returns Anchor point (x, y)
 */
export function getAnchor(startEnd: PointData, turnEnd: PointData, location: number): PointData {
    // If startEnd is to the left of turnEnd (normal case)
    if (startEnd.x <= turnEnd.x) {
        return { x: location, y: 0.5 };
    } else {
        // If startEnd is to the right of turnEnd
        // When location is 0 (at startEnd), anchor should be 1
        // When location is 1 (at turnEnd), anchor should be 0
        return { x: 1 - location, y: 0.5 };
    }
}
