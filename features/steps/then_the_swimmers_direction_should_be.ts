import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Direction } from '../../src/modules/SwimmerModel';
import { CustomWorld } from '../support/world';

Then(`the swimmer's direction should be {string}`, function (this: CustomWorld, directionStr: string) {
  const expectedDirection = directionStr === 'TOTURN' ? Direction.TOTURN : Direction.TOSTART;
  const actual = this.swimmer!.where(this.currentTime!);
  assert.equal(actual.direction, expectedDirection, `Expected direction ${directionStr} but got ${actual.direction === Direction.TOTURN ? 'TOTURN' : 'TOSTART'}`);
});
