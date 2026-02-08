import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('there should be {int} lane rows displayed', async function (this: CustomWorld, expectedCount: number) {
  await this.page!.waitForFunction(
    (count) => document.querySelectorAll('[data-testid="lane-row"]').length === count,
    expectedCount,
    { timeout: 5000 }
  ).catch(() => {});
  const rows = await this.page!.$$('[data-testid="lane-row"]');
  assert.strictEqual(rows.length, expectedCount, `Expected ${expectedCount} rows, but found ${rows.length}`);
});
