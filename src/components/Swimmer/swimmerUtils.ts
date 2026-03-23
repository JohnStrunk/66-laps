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
    // Determine direction based on location
    const normalizedLocation = location % 2;
    const goingToTurn = normalizedLocation <= 1;

    // If going left to right (dx > 0)
    const dx = turnEnd.x - startEnd.x;
    const movingRight = goingToTurn ? dx > 0 : dx < 0;

    // Anchor at the leading edge
    if (movingRight) {
        return { x: 1, y: 0.5 }; // Right edge
    } else {
        return { x: 0, y: 0.5 }; // Left edge
    }
}
