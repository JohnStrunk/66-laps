import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('all lanes are active', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const lanes = store.getState().lanes.map(l => ({ ...l, isEmpty: false }));
    store.setState({ lanes });
  });
  await this.page!.waitForFunction(() => window.hasOwnProperty('__bellLapStore'));

  const allActive = await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    return store.lanes.every(l => !l.isEmpty);
  });


  assert.strictEqual(allActive, true);
});
