import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Then('the history should be empty', async function (this: CustomWorld) {
  const history = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history;
  });

  assert.strictEqual(history.length, 0);
});
