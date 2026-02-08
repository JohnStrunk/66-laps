import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the lane rows should be ordered from {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  const laneRows = this.page!.locator('[data-testid="lane-row"]');
  const count = await laneRows.count();
  const expectedCount = Math.abs(end - start) + 1;

  assert.strictEqual(count, expectedCount, `Expected ${expectedCount} lane rows, but found ${count}`);

  const step = start < end ? 1 : -1;
  for (let i = 0; i < count; i++) {
    const expectedLaneNumber = start + (i * step);
    const laneRow = laneRows.nth(i);
    const actualLaneNumber = await laneRow.getAttribute('data-lane-number');
    assert.strictEqual(actualLaneNumber, expectedLaneNumber.toString(), `Expected lane at index ${i} to be ${expectedLaneNumber}, but got ${actualLaneNumber}`);
  }
});
