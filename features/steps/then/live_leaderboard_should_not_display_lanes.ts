import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the Live Leaderboard should not display lanes {int}, {int}, and {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    const el = this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`);

    await expect.poll(async () => {
      if (!(await el.isVisible())) return true;
      await advanceClock(this.page!, 200);
      return false;
    }, { timeout: 5000 }).toBe(true);

    await expect(el).toBeHidden();
  }
});
