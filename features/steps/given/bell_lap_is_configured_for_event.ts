import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import { EventType } from '../../../src/modules/bellLapStore';

Given('Bell Lap is configured for a {string} event', async function (this: CustomWorld, eventName: string) {
  await this.page!.evaluate((name) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setView('race');
    store.getState().setEvent(name as EventType);
    store.getState().setSetupDialogOpen(false);
  }, eventName);

  const state = await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    return {
      view: store.view,
      event: store.event,
      isSetupDialogOpen: store.isSetupDialogOpen
    };
  });


  assert.strictEqual(state.view, 'race');
  assert.strictEqual(state.event, eventName);
  assert.strictEqual(state.isSetupDialogOpen, false);
});
