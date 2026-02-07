import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the Live Leaderboard should display lanes {int}, {int}, and {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    const el = this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`);
    await el.waitFor({ state: 'visible' });
    assert.ok(await el.isVisible());
  }
});
