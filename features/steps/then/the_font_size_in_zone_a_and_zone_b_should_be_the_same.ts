import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the font size in Zone A and Zone B for Lane {int} should be the same', async function (this: CustomWorld, laneNumber: number) {
  const zoneA = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-a"] [data-testid="lane-count"]`);
  const zoneB = this.page!.locator(`[data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"] span`);

  await zoneA.waitFor({ state: 'visible' });
  await zoneB.waitFor({ state: 'visible' });

  const fontSizeA = await zoneA.evaluate((el) => window.getComputedStyle(el).fontSize);
  const fontSizeB = await zoneB.evaluate((el) => window.getComputedStyle(el).fontSize);

  assert.strictEqual(fontSizeA, fontSizeB, `Font size in Zone A (${fontSizeA}) does not match Zone B (${fontSizeB}) for Lane ${laneNumber}`);
});
