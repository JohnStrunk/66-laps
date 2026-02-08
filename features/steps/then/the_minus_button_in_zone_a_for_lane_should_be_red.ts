import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the minus button in Zone A for Lane {int} should be red`, async function (this: CustomWorld, laneNumber: number) {
  const button = await this.page!.$(`[data-lane-number="${laneNumber}"] [aria-label="Decrement lane ${laneNumber}"]`);
  assert.ok(button, `Minus button for lane ${laneNumber} not found`);
  const classes = await button.getAttribute('class');
  assert.ok(classes?.includes('bg-danger'), `Minus button for lane ${laneNumber} is not red. Classes: ${classes}`);
});
