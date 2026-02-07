import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('all split history should be cleared', async function (this: CustomWorld) {
  const historyEmpty = await this.page!.evaluate(() => {
    return (window as any).__bellLapStore.getState().lanes.every((l: any) => l.history.length === 0);
  });
  assert.ok(historyEmpty, 'Split history should be empty after reset');
});
