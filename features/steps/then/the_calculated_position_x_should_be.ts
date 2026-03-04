import { Then } from '@cucumber/cucumber';
import { getPosition } from '../../../src/components/Swimmer/swimmerUtils';
import { CustomWorld } from '../../support/world';
import { PointData } from 'pixi.js';
import { expect } from '@playwright/test';

interface SwimmerState {
    startEnd: PointData;
    turnEnd: PointData;
    location: number;
}

Then('the calculated position X should be {float}', function (this: CustomWorld, expectedPosX: number) {
    const state = this.swimmerState as SwimmerState;
    const pos = getPosition(state.startEnd, state.turnEnd, state.location);
    expect(pos.x).toBe(expectedPosX);
});
