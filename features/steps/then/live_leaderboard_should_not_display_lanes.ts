import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Then('the Live Leaderboard should not display lanes {int}, {int}, and {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    const el = this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`);

    // Advance clock in ticks until hidden or timeout
    for (let i = 0; i < 20; i++) {
      if (!(await el.isVisible())) break;
      await advanceClock(this.page!, 200);
    }

    await el.waitFor({ state: 'hidden', timeout: 5000 });
    assert.ok(!(await el.isVisible()));
  }
});
