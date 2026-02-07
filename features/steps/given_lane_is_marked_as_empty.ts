import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';
import { longPress } from '../support/utils';

Given('Lane {int} is marked as "EMPTY"', async function (this: CustomWorld, laneNumber: number) {
  const zoneB = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-zone-b"]`);
  await longPress(zoneB);
  const text = await this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`).textContent();
  assert.ok(text?.includes('EMPTY'));
});
