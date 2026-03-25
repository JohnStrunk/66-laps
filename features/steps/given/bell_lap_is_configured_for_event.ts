import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import { EventType } from '../../../src/modules/bellLapStore';
import { expect } from '@playwright/test';

Given('Bell Lap is configured for a {string} event', async function (this: CustomWorld, eventName: string) {
  await this.page!.evaluate((name) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setView('race');
    store.getState().setEvent(name as EventType);
    store.getState().setSetupDialogOpen(false);
  }, eventName);

  const { view, event, isSetupDialogOpen } = await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    return {
      view: store.getState().view,
      event: store.getState().event,
      isSetupDialogOpen: store.getState().isSetupDialogOpen
    };
  });

  expect(view).toBe('race');
  expect(event).toBe(eventName);
  expect(isSetupDialogOpen).toBe(false);
});
