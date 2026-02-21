import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see the race details screen', async function (this: CustomWorld) {
  const visible = await this.page!.locator('[data-testid="race-details-view"]').isVisible();
  assert.strictEqual(visible, true);
});
