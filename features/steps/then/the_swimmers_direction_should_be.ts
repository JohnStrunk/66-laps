import { Then } from '@cucumber/cucumber';
import { Direction } from '../../../src/modules/SwimmerModel';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the swimmer's direction should be {string}`, function (this: CustomWorld, directionStr: string) {
  const expectedDirection = directionStr === 'TOTURN' ? Direction.TOTURN : Direction.TOSTART;
  const actual = this.swimmer!.where(this.currentTime!);
  expect(actual.direction, `Expected direction ${directionStr} but got ${actual.direction === Direction.TOTURN ? 'TOTURN' : 'TOSTART'}`).toBe(expectedDirection);
});
