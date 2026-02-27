import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('the event number is {string} and the heat number is {string}', async function (this: CustomWorld, eventNum: string, heatNum: string) {
  await this.page!.evaluate(({ e, h }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setEventNumber(e);
    store.getState().setHeatNumber(h);
  }, { e: eventNum, h: heatNum });
});
