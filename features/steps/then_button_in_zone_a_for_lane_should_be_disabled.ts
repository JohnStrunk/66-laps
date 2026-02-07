import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the {string} button in Zone A for Lane {int} should be disabled', async function (this: CustomWorld, button: string, laneNumber: number) {
  const action = button === '+' ? 'Increment' : 'Decrement';
  const btn = this.page!.locator(`button[aria-label="${action} lane ${laneNumber}"]`);
  const isDisabled = await btn.isDisabled();
  assert.ok(isDisabled, `Button ${button} for Lane ${laneNumber} should be disabled`);
});
