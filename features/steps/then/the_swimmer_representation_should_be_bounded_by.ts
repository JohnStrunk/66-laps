import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { getPosition, getAnchor } from '../../../src/components/Swimmer/swimmerUtils';
import { CustomWorld } from '../../support/world';
import { PointData } from 'pixi.js';

interface SwimmerState {
    startEnd: PointData;
    turnEnd: PointData;
    location: number;
}

Then('the swimmer\'s representation should be bounded by {float} and {float}', function (this: CustomWorld, minX: number, maxX: number) {
    const state = this.swimmerState as SwimmerState;
    const pos = getPosition(state.startEnd, state.turnEnd, state.location);
    const anchor = getAnchor(state.startEnd, state.turnEnd, state.location);

    // Assume a constant width for the representation (e.g., 20 pixels)
    const width = 20;

    // Calculate the actual boundaries based on position, anchor, and width
    // pos.x - anchor.x * width = left edge
    // left edge + width = right edge
    const leftEdge = pos.x - anchor.x * width;
    const rightEdge = leftEdge + width;

    assert.ok(leftEdge >= minX, `Left edge ${leftEdge} is less than minX ${minX} (at pos.x=${pos.x}, anchor.x=${anchor.x})`);
    assert.ok(rightEdge <= maxX, `Right edge ${rightEdge} is greater than maxX ${maxX} (at pos.x=${pos.x}, anchor.x=${anchor.x})`);
});
