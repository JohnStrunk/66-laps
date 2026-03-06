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
  await expect(zoneA, 'Zone A should not be visible').toBeHidden();
  await expect(zoneB, 'Zone B should not be visible').toBeHidden();

  await expect(emptyState).toContainText('EMPTY');
  await expect(row).toHaveClass(/bg-neutral-200/);
});
