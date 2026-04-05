import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('I am on the "History" screen', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setView('history');
  });
  await this.page!.locator('[data-testid="history-view"]').waitFor({ state: 'visible' });

  const view = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().view;
  });


  assert.strictEqual(view, 'history');
});
