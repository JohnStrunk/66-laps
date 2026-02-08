import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('each lane row should be split into Zone A and Zone B', async function (this: CustomWorld) {
  const rows = await this.page!.$$('[data-testid="lane-row"]');
  for (const row of rows) {
    const zoneA = await row.$('[data-testid="lane-zone-a"]');
    const zoneB = await row.$('[data-testid="lane-zone-b"]');
    assert.ok(zoneA, 'Zone A missing');
    assert.ok(zoneB, 'Zone B missing');
  }
});
