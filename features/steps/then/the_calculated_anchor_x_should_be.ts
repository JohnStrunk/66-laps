import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { getAnchor } from '../../../src/components/Swimmer/swimmerUtils';
import { CustomWorld } from '../../support/world';
import { PointData } from 'pixi.js';

interface SwimmerState {
    startEnd: PointData;
    turnEnd: PointData;
    location: number;
}

Then('the calculated anchor X should be {float}', function (this: CustomWorld, expectedAnchorX: number) {
    const state = this.swimmerState as SwimmerState;
    const anchor = getAnchor(state.startEnd, state.turnEnd, state.location);
    assert.equal(anchor.x, expectedAnchorX);
});
