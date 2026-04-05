import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('the event number is {string} and the heat number is {string}', async function (this: CustomWorld, eventNum: string, heatNum: string) {
  await this.page!.evaluate(({ e, h }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setEventNumber(e);
    store.getState().setHeatNumber(h);
  }, { e: eventNum, h: heatNum });

  const state = await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    return { eventNumber: store.eventNumber, heatNumber: store.heatNumber };
  });


  assert.strictEqual(state.eventNumber, eventNum);
  assert.strictEqual(state.heatNumber, heatNum);
});
