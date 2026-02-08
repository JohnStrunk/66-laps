import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { longPress } from '../../support/utils';

Given('Lane {int} is marked as "EMPTY"', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  await longPress(row);
  const text = await row.textContent();
  assert.ok(text?.includes('EMPTY'));
});
