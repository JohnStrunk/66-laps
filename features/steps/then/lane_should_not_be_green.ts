import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('Lane {int} should not be displayed in Green', async function (this: CustomWorld, lane: number) {
  const c = await this.page!.locator(`[data-testid="leaderboard-lane-${lane}"]`).getAttribute('class');
  expect(!c?.includes('text-success')).toBeTruthy();
});
