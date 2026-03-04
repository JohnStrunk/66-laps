import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('Lane {int} should be restored to the Live Leaderboard', async function (this: CustomWorld, laneNumber: number) {
  const entry = this.page!.locator(`[data-testid="leaderboard-lane-${laneNumber}"]`);
  await expect(entry).toBeVisible();
  await expect(entry).toBeVisible();
});
