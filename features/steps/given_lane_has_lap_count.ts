import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Given('Lane {int} has a lap count of {int}', async function (this: CustomWorld, laneNumber: number, count: number) {
  const countEl = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"] [data-testid="lane-count"]`);
  const currentText = await countEl.textContent();
  let current = parseInt(currentText || '0', 10);

  if (current === count) return;

  while (current < count) {
     await this.page!.locator(`button[aria-label="Increment lane ${laneNumber}"]`).click();
     current += 2;
  }

  while (current > count) {
     await this.page!.locator(`button[aria-label="Decrement lane ${laneNumber}"]`).click();
     current -= 2;
  }

  const finalContent = await countEl.textContent();
  assert.strictEqual(parseInt(finalContent || '0', 10), count, `Failed to set lane ${laneNumber} to count ${count}`);
});
