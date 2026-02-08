import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lane stack should display {int} rows', async function (this: CustomWorld, rowCount: number) {
  await this.page!.waitForFunction(
    (count) => document.querySelectorAll('[data-testid="lane-row"]').length === count,
    rowCount,
    { timeout: 5000 }
  );
  const rows = await this.page!.locator('[data-testid="lane-row"]').count();
  assert.strictEqual(rows, rowCount);
});
