import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lap count for Lane {int} should be {int}', async function (this: CustomWorld, laneNumber: number, expectedCount: number) {
  const countEl = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-count"]`);
  await this.page!.waitForFunction(
    ({ lane, expected }) => {
      const el = document.querySelector(`[data-testid="lane-row"][data-lane-number="${lane}"] [data-testid="lane-count"]`);
      return parseInt(el?.textContent || '0', 10) === expected;
    },
    { lane: laneNumber, expected: expectedCount },
    { timeout: 5000 }
  );
  const text = await countEl.textContent();
  assert.strictEqual(parseInt(text || '0', 10), expectedCount);
});
