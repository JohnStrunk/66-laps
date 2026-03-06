import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the lap count for Lane {int} should be {int}', async function (this: CustomWorld, laneNumber: number, expectedCount: number) {
  const countEl = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-count"]`);
  await expect(countEl).toHaveText(expectedCount.toString(), { timeout: 5000 });
});
