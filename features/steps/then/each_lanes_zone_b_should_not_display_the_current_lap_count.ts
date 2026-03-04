import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`each lane's Zone B should not display the current lap count`, async function (this: CustomWorld) {
  const zoneBs = await this.page!.$$('[data-testid="lane-zone-b"]');
  for (const zoneB of zoneBs) {
    const lapCount = await zoneB.$('[data-testid="lane-count"]');
    expect(lapCount, 'Zone B should not contain lap count element').toBe(null);
  }
});
