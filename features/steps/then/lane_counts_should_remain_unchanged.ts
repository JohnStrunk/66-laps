import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lane counts should remain unchanged', async function (this: CustomWorld) {
  const text = await this.page!.locator('[data-lane-number="1"] [data-testid="lane-count"]').textContent();
  assert.strictEqual(parseInt(text || '0', 10), 2);
});
