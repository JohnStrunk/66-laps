import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Then('the view state should be {string}', async function (this: CustomWorld, expectedView: string) {
  const view = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().view;
  });
  assert.strictEqual(view, expectedView);
});
