import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('Lane {int} should be removed from the Live Leaderboard', async function (this: CustomWorld, laneNumber: number) {
  const entry = this.page!.locator(`[data-testid="leaderboard-lane-${laneNumber}"]`);
  await entry.waitFor({ state: 'hidden', timeout: 2000 });
  assert.ok(!(await entry.isVisible()));
});
