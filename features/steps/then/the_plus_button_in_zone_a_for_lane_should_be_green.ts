import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the plus button in Zone A for Lane {int} should be green`, async function (this: CustomWorld, laneNumber: number) {
  const button = await this.page!.$(`[data-lane-number="${laneNumber}"] [aria-label="Increment lane ${laneNumber}"]`);
  assert.ok(button, `Plus button for lane ${laneNumber} not found`);
  const classes = await button.getAttribute('class');
  assert.ok(classes?.includes('bg-success'), `Plus button for lane ${laneNumber} is not green. Classes: ${classes}`);
});
