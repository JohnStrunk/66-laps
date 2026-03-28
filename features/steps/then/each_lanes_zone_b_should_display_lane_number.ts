import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(/^each lane's Zone B should display "(LANE|Lane)" (?:and its corresponding|followed by its) lane number$/, async function (this: CustomWorld, prefix: string) {
  const rowsLocator = this.page!.locator('[data-testid="lane-row"]');
  const count = await rowsLocator.count();
  for (let i = 0; i < count; i++) {
    const laneNumber = i + 1;
    const zoneB = rowsLocator.nth(i).locator('[data-testid="lane-zone-b"]');
    await expect(zoneB).toContainText(new RegExp(`${prefix}\\s*${laneNumber}`, 'i'));
  }
});
