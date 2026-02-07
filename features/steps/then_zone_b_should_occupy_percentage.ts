import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('Zone B should occupy approximately {int}% of the width', async function (this: CustomWorld, percentage: number) {
  const row = await this.page!.locator('[data-testid="lane-row"]').first();
  const zoneB = await row.locator('[data-testid="lane-zone-b"]');

  const rowBox = await row.boundingBox();
  const zoneBBox = await zoneB.boundingBox();

  if (!rowBox || !zoneBBox) throw new Error('Could not get bounding box');

  const ratio = (zoneBBox.width / rowBox.width) * 100;
  assert.ok(Math.abs(ratio - percentage) < 1.5, `Zone B width ${ratio}% is not approximately ${percentage}%`);
});
