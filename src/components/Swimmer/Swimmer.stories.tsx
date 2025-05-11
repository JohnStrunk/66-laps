import type { Meta, StoryObj } from '@storybook/react';

import { Direction, ISwimmer, SwimmerModel, SwimVector } from '@/modules/SwimmerModel';
import { Application } from '@pixi/react';
import Swimmer from './Swimmer';

const meta: Meta<typeof Swimmer> = {
    component: Swimmer,
    decorators: [
        (Story) => (
            <Application autoStart sharedTicker>
                <Story />
            </Application>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Swimmer>;

class MockSwimmer implements ISwimmer {
    private _location: number;
    private _direction: Direction;

    constructor(location: number, direction: Direction) {
        this._location = location;
        this._direction = direction;
    }

    where(): SwimVector {
        return {
            location: this._location,
            direction: this._direction,
        };
    }

    isDone(): boolean {
        return false;
    }
}

export const StartEnd: Story = {
    args: {
        laneWidth: 50,
        startEnd: { "x": 50, "y": 50 },
        turnEnd: { "x": 200, "y": 50 },
        swimmer: new MockSwimmer(
            0, // Example position of the swimmer
            Math.random() > 0.5
                ? Direction.TOSTART // Randomly choose direction for demo
                : Direction.TOTURN
        )
    }
};

export const TurnEnd: Story = {
    args: {
        laneWidth: 50,
        startEnd: { "x": 50, "y": 50 },
        turnEnd: { "x": 200, "y": 50 },
        swimmer: new MockSwimmer(
            1, // Example position of the swimmer
            Math.random() > 0.5
                ? Direction.TOSTART // Randomly choose direction for demo
                : Direction.TOTURN
        )
    }
};

export const Swimming: Story = {
    args: {
        laneWidth: 50,
        startEnd: { "x": 50, "y": 50 },
        turnEnd: { "x": 400, "y": 50 },
        swimmer: new SwimmerModel([15, 17])
    }
};
