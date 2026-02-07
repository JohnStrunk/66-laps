import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Given('the lane stack is currently ordered {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  if (end === 10) {
    await this.page!.evaluate(() => {
      (window as any).__bellLapStore.getState().setLaneCount(10);
    });
  }
  const firstRow = this.page!.locator('[data-testid="lane-row"]').first();
  await this.page!.waitForFunction(
    (s) => document.querySelector('[data-testid="lane-row"]')?.getAttribute('data-lane-number') === String(s),
    start
  );
  const attr = await firstRow.getAttribute('data-lane-number');
  assert.strictEqual(attr, String(start));
});
