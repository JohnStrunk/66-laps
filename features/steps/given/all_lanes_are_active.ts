import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('all lanes are active', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');
  await this.page.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const lanes = store.getState().lanes.map(l => ({ ...l, isEmpty: false }));
    store.setState({ lanes });
  });
});
