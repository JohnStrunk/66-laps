import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('each lane row should be split into Zone A and Zone B', async function (this: CustomWorld) {
  const rows = await this.page!.$$('[data-testid="lane-row"]');
  for (const row of rows) {
    const zoneA = await row.$('[data-testid="lane-zone-a"]');
    const zoneB = await row.$('[data-testid="lane-zone-b"]');
    expect(zoneA, 'Zone A missing').toBeTruthy();
    expect(zoneB, 'Zone B missing').toBeTruthy();
  }
});
