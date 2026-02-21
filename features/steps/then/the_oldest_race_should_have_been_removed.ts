import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Then('the oldest race should have been removed', async function (this: CustomWorld) {
  const history = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history;
  });
  // The oldest was `history-49`
  const oldestStillPresent = history.some((r: any) => r.id === 'history-49');
  assert.strictEqual(oldestStillPresent, false);
});
