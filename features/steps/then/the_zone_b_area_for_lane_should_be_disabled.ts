import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the Zone B area for Lane {int} should be disabled`, async function (this: CustomWorld, laneNumber: number) {
  const zoneB = await this.page!.$(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  expect(zoneB, `Zone B for lane ${laneNumber} not found`).toBeTruthy();
  const classes = await zoneB!.getAttribute('class');
  expect(classes?.includes('pointer-events-none'), `Zone B for lane ${laneNumber} is not disabled (missing pointer-events-none). Classes: ${classes}`).toBeTruthy();
});
