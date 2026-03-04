import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the font size in Zone A and Zone B for Lane {int} should be the same', async function (this: CustomWorld, laneNumber: number) {
  const zoneA = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-a"] [data-testid="lane-count"]`);
  const zoneB = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"] span`);

  await expect(zoneA).toBeVisible();
  await expect(zoneB).toBeVisible();

  const fontSizeA = await zoneA.evaluate((el) => window.getComputedStyle(el).fontSize);
  const fontSizeB = await zoneB.evaluate((el) => window.getComputedStyle(el).fontSize);

  expect(fontSizeA, `Font size in Zone A (${fontSizeA}) does not match Zone B (${fontSizeB}) for Lane ${laneNumber}`).toBe(fontSizeB);
});
