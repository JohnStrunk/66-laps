import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('Zone A should occupy approximately {int}% of the width', async function (this: CustomWorld, percentage: number) {
  const row = await this.page!.locator('[data-testid="lane-row"]').first();
  const zoneA = await row.locator('[data-testid="lane-zone-a"]');

  const rowBox = await row.boundingBox();
  const zoneABox = await zoneA.boundingBox();

  if (!rowBox || !zoneABox) throw new Error('Could not get bounding box');

  const ratio = (zoneABox.width / rowBox.width) * 100;
  assert.ok(Math.abs(ratio - percentage) < 1.5, `Zone A width ${ratio}% is not approximately ${percentage}%`);
});
