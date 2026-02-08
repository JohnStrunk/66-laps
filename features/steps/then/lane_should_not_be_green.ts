import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('Lane {int} should not be displayed in Green', async function (this: CustomWorld, lane: number) {
  const c = await this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`).getAttribute('class');
  assert.ok(!c?.includes('text-success'));
});
