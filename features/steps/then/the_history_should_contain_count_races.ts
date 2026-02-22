import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Then('the history should still only contain {int} races', async function (this: CustomWorld, count: number) {
  const historyCount = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history.length;
  });
  assert.strictEqual(historyCount, count);
});

Then('the history should contain {int} races', async function (this: CustomWorld, count: number) {
  const historyCount = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history.length;
  });
  assert.strictEqual(historyCount, count);
});
