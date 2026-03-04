import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the plus button in Zone A for Lane {int} should be green`, async function (this: CustomWorld, laneNumber: number) {
  const button = await this.page!.$(`[data-lane-number="${laneNumber}"] [aria-label="Increment lane ${laneNumber}"]`);
  expect(button, `Plus button for lane ${laneNumber} not found`).toBeTruthy();
  const classes = await button!.getAttribute('class');
  expect(classes?.includes('bg-success'), `Plus button for lane ${laneNumber} is not green. Classes: ${classes}`).toBeTruthy();
});
