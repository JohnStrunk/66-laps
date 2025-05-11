import { describe, expect, it } from 'vitest';
import { Direction, SwimmerModel, SwimVector } from './SwimmerModel';

describe('SwimmerModel', () => {
    it('should return location 0 and direction TOTURN when no time has elapsed and there are an even number of laps', () => {
        const lapTimes = [30, 40]; // Lap times in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        const result: SwimVector = swimmer.where(startTime);

        expect(result).toEqual({
            location: 0,
            direction: Direction.TOTURN,
        });
    });

    it('should return correct location and direction within the first lap', () => {
        const lapTimes = [30, 40]; // Lap times in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        const elapsedTime = 15 * 1000; // 15 seconds into the first lap
        const result: SwimVector = swimmer.where(startTime + elapsedTime);

        expect(result).toEqual({
            location: 0.5, // Halfway through the first lap
            direction: Direction.TOTURN,
        });
    });

    it('should return correct location and direction within the second lap', () => {
        const lapTimes = [30, 40]; // Lap times in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        const elapsedTime = 35 * 1000; // 5 seconds into the second lap
        const result: SwimVector = swimmer.where(startTime + elapsedTime);

        expect(result).toEqual({
            location: 1 - 0.125, // 5/40 of the way through the second lap
            direction: Direction.TOSTART,
        });
    });

    it('should return location 0 and direction TOSTART after completing all laps', () => {
        const lapTimes = [30, 40]; // Lap times in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        const elapsedTime = 80 * 1000; // Total time exceeds all laps
        const result: SwimVector = swimmer.where(startTime + elapsedTime);

        expect(result).toEqual({
            location: 0,
            direction: Direction.TOSTART,
        });
    });

    it('should start single length races from the turn end', () => {
        const lapTimes = [10];
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);
        expect(swimmer.where(startTime)).toEqual({
            location: 1,
            direction: Direction.TOSTART,
        });

        const elapsedTime = 3 * 1000;
        const result: SwimVector = swimmer.where(startTime + elapsedTime);
        expect(result).toEqual({
            location: 0.7,
            direction: Direction.TOSTART,
        });
    });

    it('should return false if the swimmer has not completed all laps', () => {
        const lapTimes = [30, 40]; // Lap times in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        const elapsedTime = 50 * 1000; // Less than total lap time
        expect(swimmer.isDone(startTime + elapsedTime)).toBe(false);
    });

    it('should return true if the swimmer has completed all laps', () => {
        const lapTimes = [30, 40]; // Lap times in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        const elapsedTime = 80 * 1000; // Equal to total lap time
        expect(swimmer.isDone(startTime + elapsedTime)).toBe(true);
    });

    it('should handle single lap races correctly', () => {
        const lapTimes = [10]; // Single lap time in seconds
        const startTime = Date.now();
        const swimmer = new SwimmerModel(lapTimes, startTime);

        expect(swimmer.isDone(startTime)).toBe(false);

        const elapsedTime = 10 * 1000; // Equal to lap time
        expect(swimmer.isDone(startTime + elapsedTime)).toBe(true);
    });
});
