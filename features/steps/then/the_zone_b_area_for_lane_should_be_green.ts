import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the Zone B area for Lane {int} should be green`, async function (this: CustomWorld, laneNumber: number) {
  const selector = `[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`;

  await this.page!.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    return el?.classList.contains('bg-success');
  }, selector, { timeout: 5000 }).catch(() => {});

  const zoneB = await this.page!.$(selector);
  expect(zoneB, `Zone B for lane ${laneNumber} not found`).toBeTruthy();
  const classes = await zoneB!.getAttribute('class');
  expect(classes?.includes('bg-success'), `Zone B for lane ${laneNumber} is not green. Classes: ${classes}`).toBeTruthy();
});
