import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the Zone B area for Lane {int} should be in lockout state`, async function (this: CustomWorld, laneNumber: number) {
  const selector = `[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`;

  await this.page!.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    return el?.classList.contains('bg-content3') || el?.classList.contains('cursor-wait');
  }, selector, { timeout: 5000 }).catch(() => {});

  const zoneB = await this.page!.$(selector);
  expect(zoneB, `Zone B for lane ${laneNumber} not found`).toBeTruthy();
  const classes = await zoneB!.getAttribute('class');
  expect(classes?.includes('bg-content3') || classes?.includes('cursor-wait'), `Zone B for lane ${laneNumber} is not in lockout state. Classes: ${classes}`).toBeTruthy();
});
