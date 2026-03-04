import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the Live Leaderboard should display lanes {int}, {int}, and {int}', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    const el = this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`);
    await expect(el).toBeVisible();
    await expect(el).toBeVisible();
  }
});
