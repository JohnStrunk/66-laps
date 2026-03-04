import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the Zone B area for Lane {int} should not display a progress indicator for the lockout duration`, async function (this: CustomWorld, laneNumber: number) {
  const progress = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lockout-progress"]`);
  expect(!progress, `Progress indicator for lane ${laneNumber} should not be found`).toBeTruthy();
});
