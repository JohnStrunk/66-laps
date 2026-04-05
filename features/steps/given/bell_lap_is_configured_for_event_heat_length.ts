import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { EventType } from '../../../src/modules/bellLapStore';
import { TestWindow } from '../../support/store-type';

Given('Bell Lap is configured for event {int} heat {int} for {string}', async function (this: CustomWorld, eventNum: number, heatNum: number, eventName: string) {
  await this.page!.evaluate(({ e, h, name }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setEventNumber(e.toString());
    store.getState().setHeatNumber(h.toString());
    store.getState().setEvent(name as EventType);
    store.getState().setSetupDialogOpen(false);
  }, { e: eventNum, h: heatNum, name: eventName });

  const state = await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    return {
      eventNumber: store.eventNumber,
      heatNumber: store.heatNumber,
      event: store.event,
      isSetupDialogOpen: store.isSetupDialogOpen
    };
  });


  assert.strictEqual(state.eventNumber, eventNum.toString());
  assert.strictEqual(state.heatNumber, heatNum.toString());
  assert.strictEqual(state.event, eventName);
  assert.strictEqual(state.isSetupDialogOpen, false);
});
