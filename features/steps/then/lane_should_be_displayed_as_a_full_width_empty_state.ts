import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('Lane {int} should be displayed as a full-width empty state', async function (this: CustomWorld, laneNumber: number) {
  const row = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  const emptyState = row.locator('[data-testid="lane-empty-state"]');
  await expect(emptyState).toBeVisible();

  const zoneA = row.locator('[data-testid="lane-zone-a"]');
  const zoneB = row.locator('[data-testid="lane-zone-b"]');

  await expect(emptyState, 'Empty state should be visible').toBeVisible();
  expect(!(await zoneA.isVisible()), 'Zone A should not be visible').toBeTruthy();
  expect(!(await zoneB.isVisible()), 'Zone B should not be visible').toBeTruthy();

  const text = await emptyState.textContent();
  expect(text?.includes('EMPTY'), 'Should display EMPTY text').toBeTruthy();

  const classes = await row.getAttribute('class');
  expect(classes?.includes('bg-neutral-200'), 'Background should be grey (bg-neutral-200)').toBeTruthy();
});
