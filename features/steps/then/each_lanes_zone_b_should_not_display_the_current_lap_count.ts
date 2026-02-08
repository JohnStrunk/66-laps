import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`each lane's Zone B should not display the current lap count`, async function (this: CustomWorld) {
  const zoneBs = await this.page!.$$('[data-testid="lane-zone-b"]');
  for (const zoneB of zoneBs) {
    const lapCount = await zoneB.$('[data-testid="lane-count"]');
    assert.strictEqual(lapCount, null, 'Zone B should not contain lap count element');
  }
});
