import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the Zone B area for Lane {int} should be green`, async function (this: CustomWorld, laneNumber: number) {
  const selector = `[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`;

  await this.page!.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    return el?.classList.contains('bg-success');
  }, selector, { timeout: 5000 }).catch(() => {});

  const zoneB = await this.page!.$(selector);
  assert.ok(zoneB, `Zone B for lane ${laneNumber} not found`);
  const classes = await zoneB.getAttribute('class');
  assert.ok(classes?.includes('bg-success'), `Zone B for lane ${laneNumber} is not green. Classes: ${classes}`);
});
