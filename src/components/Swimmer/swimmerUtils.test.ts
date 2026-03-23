import { describe, it, expect } from 'vitest';
import { getPosition, getAnchor } from './swimmerUtils';
import { PointData } from 'pixi.js';

describe('swimmerUtils', () => {
    describe('getPosition', () => {
        it('calculates position correctly when location is 0', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            const location = 0;
            const expected: PointData = { x: 0, y: 0 };

            expect(getPosition(startEnd, turnEnd, location)).toEqual(expected);
        });

        it('calculates position correctly when location is 1', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            const location = 1;
            const expected: PointData = { x: 100, y: 0 };

            expect(getPosition(startEnd, turnEnd, location)).toEqual(expected);
        });

        it('calculates position correctly when location is 0.5', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            const location = 0.5;
            const expected: PointData = { x: 50, y: 0 };

            expect(getPosition(startEnd, turnEnd, location)).toEqual(expected);
        });

        it('calculates position correctly with negative coordinates', () => {
            const startEnd: PointData = { x: 100, y: 50 };
            const turnEnd: PointData = { x: 0, y: 50 };
            const location = 0.25;
            const expected: PointData = { x: 75, y: 50 };

            expect(getPosition(startEnd, turnEnd, location)).toEqual(expected);
        });
    });

    describe('getAnchor', () => {
        it('anchors to the right edge when moving left to right (going to turn)', () => {
            // start is left, turn is right. dx > 0
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };

            // normalizedLocation 0.5 <= 1 (goingToTurn is true)
            // dx > 0, goingToTurn is true => movingRight is true
            expect(getAnchor(startEnd, turnEnd, 0.5)).toEqual({ x: 1, y: 0.5 });
        });

        it('anchors to the left edge when moving right to left (going to turn)', () => {
            // start is right, turn is left. dx < 0
            const startEnd: PointData = { x: 100, y: 0 };
            const turnEnd: PointData = { x: 0, y: 0 };

            // normalizedLocation 0.5 <= 1 (goingToTurn is true)
            // dx < 0, goingToTurn is true => movingRight is false
            expect(getAnchor(startEnd, turnEnd, 0.5)).toEqual({ x: 0, y: 0.5 });
        });

        it('anchors to the left edge when moving right to left (returning to start)', () => {
            // start is left, turn is right. dx > 0
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };

            // normalizedLocation 1.5 > 1 (goingToTurn is false)
            // dx > 0, goingToTurn is false => movingRight is false
            expect(getAnchor(startEnd, turnEnd, 1.5)).toEqual({ x: 0, y: 0.5 });
        });

        it('anchors to the right edge when moving left to right (returning to start)', () => {
            // start is right, turn is left. dx < 0
            const startEnd: PointData = { x: 100, y: 0 };
            const turnEnd: PointData = { x: 0, y: 0 };

            // normalizedLocation 1.5 > 1 (goingToTurn is false)
            // dx < 0, goingToTurn is false => movingRight is true
            expect(getAnchor(startEnd, turnEnd, 1.5)).toEqual({ x: 1, y: 0.5 });
        });

        it('handles exact location 0 correctly', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            // normalizedLocation 0 <= 1 (goingToTurn is true)
            // movingRight is true
            expect(getAnchor(startEnd, turnEnd, 0)).toEqual({ x: 1, y: 0.5 });
        });

        it('handles exact location 1 correctly', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            // normalizedLocation 1 <= 1 (goingToTurn is true)
            // movingRight is true
            expect(getAnchor(startEnd, turnEnd, 1)).toEqual({ x: 1, y: 0.5 });
        });

        it('handles exact location 2 correctly', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            // normalizedLocation 0 <= 1 (goingToTurn is true)
            // movingRight is true
            expect(getAnchor(startEnd, turnEnd, 2)).toEqual({ x: 1, y: 0.5 });
        });

        it('handles exact location 1.0001 correctly', () => {
            const startEnd: PointData = { x: 0, y: 0 };
            const turnEnd: PointData = { x: 100, y: 0 };
            // normalizedLocation 1.0001 > 1 (goingToTurn is false)
            // movingRight is false
            expect(getAnchor(startEnd, turnEnd, 1.0001)).toEqual({ x: 0, y: 0.5 });
        });
    });
});
