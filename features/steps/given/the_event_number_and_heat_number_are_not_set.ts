import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('the event number and heat number are not set', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setEventNumber('');
    store.getState().setHeatNumber('');
  });
});
