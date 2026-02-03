/** The direction of the swimmer */
export const Direction = {
    /** The swimmer is moving toward the start end of the pool */
    TOSTART: 0,
    /** The swimmer is moving toward the turn end of the pool */
    TOTURN: 1,
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

/** The position and direction of a swimmer */
export type SwimVector = {
    /** The location of the swimmer in the pool as a fraction of the distance
     * from the start to the turn end. */
    location: number;
    /** The direction the swimmer is moving */
    direction: Direction;
};

export interface ISwimmer {
    /**
     * Determines the swimmer's current position and direction in the pool.
     *
     * @param currentTimeMs - The current time in milliseconds since the Unix
     * epoch. Defaults to the current time.
     * @returns An object containing the swimmer's location (a value between 0
     * and 1) and their direction (`Direction.TOTURN` or `Direction.TOSTART`).
     */
    where(currentTimeMs?: number): SwimVector;

    /**
     * Determines if the swimmer has completed all laps and is finished with
     * the race.
     *
     * @param currentTimeMs - The current time in milliseconds since the Unix
     * epoch. Defaults to the current time.
     * @returns A boolean indicating whether the swimmer has completed all
     * laps
     */
    isDone(currentTimeMs?: number): boolean;
}

/**
 * Represents a swimmer's movement model in a pool, tracking their current
 * position based on elapsed time.
 *
 * The `SwimmerModel` class calculates the swimmer's location and direction
 * within the pool based on the provided lap times and the elapsed time since
 * the start of the swim.
 */
/**
 * Represents a swimmer model that tracks lap times and calculates the swimmer's current position and direction.
 */
export class SwimmerModel implements ISwimmer {
    /**
     * Array of lap times (in seconds) for the swimmer.
     * Each value represents the time taken to complete a lap.
     */
    private _lapTimes: number[];

    /**
     * The start time of the swimmer in milliseconds since the Unix epoch.
     */
    private _startTimeMs: number;

    /**
     * Creates an instance of the SwimmerModel.
     *
     * @param lapTimes - An array of lap times (in seconds) for the swimmer.
     * @param startTimeMs - The start time of the swimmer in milliseconds since
     * the Unix epoch. Defaults to the current time.
     */
    constructor(lapTimes: number[], startTimeMs: number = Date.now()) {
        this._startTimeMs = startTimeMs;
        this._lapTimes = lapTimes;
    }

    /**
     * Determines the swimmer's current position and direction in the pool.
     *
     * @param currentTimeMs - The current time in milliseconds since the Unix
     * epoch. Defaults to the current time.
     * @returns An object containing the swimmer's location (a value between 0
     * and 1) and their direction (`Direction.TOTURN` or `Direction.TOSTART`).
     */
    where(currentTimeMs: number = Date.now()): SwimVector {
        let elapsedTimeMs = currentTimeMs - this._startTimeMs;
        let direction = this._lapTimes.length % 2 === 0
            ? Direction.TOTURN
            : Direction.TOSTART;
        for (let i = 0; i < this._lapTimes.length; i++) {
            const lapTimeMs = this._lapTimes[i] * 1000;
            if (elapsedTimeMs < lapTimeMs) {
                return {
                    location: direction === Direction.TOTURN
                        ? elapsedTimeMs / lapTimeMs
                        : 1 - elapsedTimeMs / lapTimeMs,
                    direction: direction,
                };
            }
            elapsedTimeMs -= lapTimeMs;
            direction = direction === Direction.TOSTART
                ? Direction.TOTURN
                : Direction.TOSTART;
        }
        // If we get here, the swimmer has completed all laps
        // and is at the start end of the pool
        return {
            location: 0,
            direction: Direction.TOSTART,
        };
    }

    /**
     * Determines if the swimmer has completed all laps and is finished with
     * the race.
     *
     * @param currentTimeMs - The current time in milliseconds since the Unix
     * epoch. Defaults to the current time.
     * @returns A boolean indicating whether the swimmer has completed all
     * laps
     */
    isDone(currentTimeMs: number = Date.now()): boolean {
        return currentTimeMs - this._startTimeMs >=
            this._lapTimes.reduce((a, b) => a + b, 0) * 1000;
    }
}
