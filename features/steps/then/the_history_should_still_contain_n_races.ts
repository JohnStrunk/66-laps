import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the history should still contain {int} races', async function (this: CustomWorld, count: number) {
  const records = this.page!.locator('[data-testid="history-record"]');
  const recordCount = await records.count();
  assert.strictEqual(recordCount, count);
});
