import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see {int} races remaining in history', async function (this: CustomWorld, count: number) {
  const records = this.page!.locator('[data-testid="history-record"]');
  const recordCount = await records.count();
  assert.strictEqual(recordCount, count);
});
